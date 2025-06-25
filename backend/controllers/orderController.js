exports.getOrderStatus = async (req, res) => {
  const { orderId } = req.params;
  const order = await db.query("SELECT status FROM orders WHERE id = $1", [orderId]);
  res.json(order.rows[0]);
};

exports.updateOrderStatus = async (req, res) => {
  const { orderId } = req.params;
  const { status } = req.body;
  await db.query("UPDATE orders SET status = $1 WHERE id = $2", [status, orderId]);
  res.json({ message: "Order status updated" });
};
