const razorpay = require("../config/razorpay");

const createOrder = async (req, res) => {
  try {

    const { amount } = req.body;

    const order = await razorpay.orders.create({
      amount: amount * 100,
      currency: "INR",
      receipt: "receipt_" + Date.now()
    });

    res.json(order);

  } catch (err) {

    console.log(err);

    res.status(500).json({
      message: "Order creation failed"
    });
  }
};

module.exports = {
  createOrder
};