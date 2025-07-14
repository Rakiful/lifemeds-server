// controllers/payment.controller.js
const { ObjectId } = require("mongodb");
const stripe = require("stripe")(process.env.PAYMENT_GATEWAY_KEY);

const createPaymentIntent = async (req, res) => {
  try {
    const { amountInCents } = req.body;
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountInCents,
      currency: "usd",
      payment_method_types: ["card"],
    });
    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    res
      .status(500)
      .send({ message: "Internal Server Error", error: error.message });
  }
};

const getOrders = async (req, res) => {
  try {
    const orders = await req.db.ordersCollections.find().toArray();
    res.send(orders);
  } catch (error) {
    res
      .status(500)
      .send({ message: "Internal Server Error", error: error.message });
  }
};

const placeOrder = async (req, res) => {
  try {
    const orderData = req.body;
    const {cartData} = req.body;

    for(const cart of cartData){
      const query ={ _id: new ObjectId(cart.cartId)}
      const cartRemove = await req.db.cartCollections.deleteOne(query);
      console.log(cartRemove)
    }

    const result = await req.db.ordersCollections.insertOne(orderData);

    res.json({
      message: "Order placed successfully",
      insertedId: result.insertedId,
    });
  } catch (error) {
    res
      .status(500)
      .send({ message: "Internal Server Error", error: error.message });
  }
};

module.exports = {
  createPaymentIntent,
  placeOrder,
  getOrders,
};
