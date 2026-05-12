const Order = require('../models/order.model');
const OrderItem = require('../models/orderItem.model');
const { productsClient, notificationClient } = require('../config/serviceClients');

exports.createOrder = async (req, res) => {
  try {
    const user_id = req.headers['x-user-id'];
    const { items } = req.body; // [{ product_id, quantity }]

    if (!items || !items.length)
      return res.status(400).json({ message: 'items array is required' });

    // Fetch product details to get actual prices
    const itemsWithPrices = await Promise.all(
      items.map(async (item) => {
        const productRes = await productsClient.get(`/api/products/${item.product_id}`);
        if (!productRes.data.product) {
          throw new Error(`Product ${item.product_id} not found`);
        }
        const product = productRes.data.product;
        return {
          ...item,
          unit_price: parseFloat(product.price),
        };
      })
    );

    // Decrement stock in products-service
    await productsClient.post('/api/products/internal/decrement-stock', { items: itemsWithPrices });

    const total_amount = itemsWithPrices.reduce((sum, i) => sum + i.unit_price * i.quantity, 0);

    const order = await Order.create({ user_id, total_amount, status: 'pending' });
    const orderItems = itemsWithPrices.map((i) => ({
      order_id: order.id,
      product_id: i.product_id,
      quantity: i.quantity,
      unit_price: i.unit_price,
    }));
    await OrderItem.bulkCreate(orderItems);

    // Notify asynchronously — don't block response
    notificationClient.post('/api/notifications/order-created', {
      user_id,
      order_id: order.id,
      total_amount,
    }).catch(() => {}); // fire and forget

    return res.status(201).json({ order: { ...order.toJSON(), items: orderItems } });
  } catch (err) {
    if (err.response) return res.status(err.response.status).json(err.response.data);
    return res.status(500).json({ message: 'Failed to create order', error: err.message });
  }
};

exports.getMyOrders = async (req, res) => {
  try {
    const user_id = req.headers['x-user-id'];
    const orders = await Order.findAll({
      where: { user_id },
      include: [{ model: OrderItem, as: 'items' }],
      order: [['created_at', 'DESC']],
    });
    res.json({ orders });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch orders', error: err.message });
  }
};

exports.getOne = async (req, res) => {
  try {
    const user_id = req.headers['x-user-id'];
    const role    = req.headers['x-user-role'];
    const order = await Order.findByPk(req.params.id, {
      include: [{ model: OrderItem, as: 'items' }],
    });
    if (!order) return res.status(404).json({ message: 'Order not found' });
    if (order.user_id !== user_id && role !== 'admin')
      return res.status(403).json({ message: 'Forbidden' });
    res.json({ order });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch order', error: err.message });
  }
};

// Internal: called by payment-service (no auth check)
exports.getOneInternal = async (req, res) => {
  try {
    const order = await Order.findByPk(req.params.id, {
      include: [{ model: OrderItem, as: 'items' }],
    });
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json({ order });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch order', error: err.message });
  }
};

exports.updateStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findByPk(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    await order.update({ status });
    res.json({ order });
  } catch (err) {
    res.status(500).json({ message: 'Failed to update order', error: err.message });
  }
};

// Internal: called by payment-service after payment success
exports.markPaid = async (req, res) => {
  try {
    const order = await Order.findByPk(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    await order.update({ status: 'paid' });
    res.json({ message: 'Order marked as paid', order });
  } catch (err) {
    res.status(500).json({ message: 'Failed to update order', error: err.message });
  }
};