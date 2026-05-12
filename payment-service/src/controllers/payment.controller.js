const Transaction = require('../models/transaction.model');
const { orderClient, notificationClient } = require('../config/axios');

exports.processPayment = async (req, res) => {
  const user_id = req.headers['x-user-id'];
  const { order_id, gateway_ref, card_number } = req.body;

  if (!order_id || !card_number)
    return res.status(400).json({ message: 'order_id and card_number are required' });

  const normalizedCard = String(card_number).replace(/\s+/g, '');
  if (!/^[0-9]{10}$/.test(normalizedCard))
    return res.status(400).json({ message: 'card_number must be exactly 10 digits' });

  try {
    // Fetch order details from order-service to get the actual amount
    const orderRes = await orderClient.get(`/api/orders/internal/${order_id}/details`);
    const order = orderRes.data.order;
    const amount = order.total_amount;

    // Create a pending transaction first
    const transaction = await Transaction.create({
      order_id,
      user_id,
      amount,
      gateway_ref: gateway_ref || null,
      status: 'pending',
    });

    /*
     * === PAYMENT GATEWAY STUB ===
     * This is a mock payment gateway.
     * It succeeds only when card_number has exactly 10 digits.
     */
    const paymentSucceeded = /^[0-9]{10}$/.test(normalizedCard);

    if (!paymentSucceeded) throw new Error('Invalid card number');

    await transaction.update({ status: 'success' });

    // Tell order-service to mark the order as paid (internal endpoint, no auth required)
    await orderClient.patch(`/api/orders/internal/${order_id}/mark-paid`);

    // Notify the user (fire-and-forget)
    notificationClient.post('/api/notifications/internal/payment-success', {
      user_id,
      order_id,
      amount,
    }).catch(() => {});

    return res.status(200).json({ transaction });
  } catch (err) {
    return res.status(402).json({ message: 'Payment failed', error: err.message });
  }
};

exports.getMyTransactions = async (req, res) => {
  try {
    const user_id = req.headers['x-user-id'];
    const transactions = await Transaction.findAll({
      where: { user_id },
      order: [['createdAt', 'DESC']],
    });
    res.json({ transactions });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch transactions', error: err.message });
  }
};

exports.getTransactionById = async (req, res) => {
  try {
    const user_id = req.headers['x-user-id'];
    const role    = req.headers['x-user-role'];

    const transaction = await Transaction.findByPk(req.params.id);
    if (!transaction) return res.status(404).json({ message: 'Transaction not found' });

    if (transaction.user_id !== user_id && role !== 'admin')
      return res.status(403).json({ message: 'Forbidden' });

    res.json({ transaction });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch transaction', error: err.message });
  }
};

exports.getAllTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.findAll({ order: [['createdAt', 'DESC']] });
    res.json({ transactions });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch all transactions', error: err.message });
  }
};