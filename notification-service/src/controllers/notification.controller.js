let notifications = [];

const createNotification = async ({ user_id, title, body, type, meta = {} }) => {
  const notification = {
    id: `notif_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    user_id,
    title,
    body,
    type,
    meta,
    read: false,
    createdAt: new Date().toISOString(),
  };
  notifications.unshift(notification);
  console.log(`[NOTIFICATION] user=${user_id} | ${title} |`, meta);
  return notification;
};

exports.orderPlaced = async (req, res) => {
  try {
    const { user_id, order_id, total_amount } = req.body;
    await createNotification({
      user_id,
      title: 'Order Placed',
      body: `Your order #${order_id} has been placed. Total: $${total_amount}`,
      type: 'order_placed',
      meta: { order_id, total_amount },
    });
    res.json({ message: 'Order placed notification created' });
  } catch (err) {
    res.status(500).json({ message: 'Notification failed', error: err.message });
  }
};

exports.paymentSuccess = async (req, res) => {
  try {
    const { user_id, order_id, amount } = req.body;
    await createNotification({
      user_id,
      title: 'Payment Successful',
      body: `Payment of $${amount} for order #${order_id} was successful.`,
      type: 'payment_success',
      meta: { order_id, amount },
    });
    res.json({ message: 'Payment success notification created' });
  } catch (err) {
    res.status(500).json({ message: 'Notification failed', error: err.message });
  }
};

exports.paymentFailed = async (req, res) => {
  try {
    const { user_id, order_id } = req.body;
    await createNotification({
      user_id,
      title: 'Payment Failed',
      body: `Payment for order #${order_id} failed. Please try again.`,
      type: 'payment_failed',
      meta: { order_id },
    });
    res.json({ message: 'Payment failed notification created' });
  } catch (err) {
    res.status(500).json({ message: 'Notification failed', error: err.message });
  }
};

exports.orderShipped = async (req, res) => {
  try {
    const { user_id, order_id } = req.body;
    await createNotification({
      user_id,
      title: 'Order Shipped',
      body: `Your order #${order_id} has been shipped and is on its way!`,
      type: 'order_shipped',
      meta: { order_id },
    });
    res.json({ message: 'Order shipped notification created' });
  } catch (err) {
    res.status(500).json({ message: 'Notification failed', error: err.message });
  }
};

exports.getMyNotifications = async (req, res) => {
  try {
    const user_id = req.headers['x-user-id'];
    if (!user_id) return res.status(400).json({ message: 'x-user-id header is required' });
    const userNotifications = notifications.filter((n) => n.user_id === user_id);
    res.json({ notifications: userNotifications });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch notifications', error: err.message });
  }
};