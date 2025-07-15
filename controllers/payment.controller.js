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
    const { cartData, transactionId, orderDate } = req.body;

    for (const cart of cartData) {
      const sellerEarn = cart.price * cart.quantity;
      const existingMedicine = await req.db.medicineCollections.findOne({
        _id: new ObjectId(cart.medicineId),
      });
      const sellerEmail = existingMedicine.sellerEmail;
      const sellerPaymentHistoryData = {
        buyerName: orderData.buyerName,
        buyerEmail: orderData.buyerEmail,
        medicineId: cart.medicineId,
        quantity: cart.quantity,
        sellerEmail,
        paymentStatus: "pending",
        total: sellerEarn,
        transactionId,
        orderDate,
      };
      await req.db.sellerPaymentCollections.insertOne(sellerPaymentHistoryData);
      const query = { _id: new ObjectId(cart.cartId) };
      await req.db.cartCollections.deleteOne(query);
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

const getSellerPaymentHistory = async (req, res) => {
  try {
    const email = req.params.email;
    if (!email) {
      return res.status(400).send({ message: "Email query is required." });
    }
    const result = await req.db.sellerPaymentCollections
      .find({ sellerEmail: email })
      .toArray();
    res.send(result);
  } catch (error) {
    res
      .status(500)
      .send({ message: "Internal Server Error", error: error.message });
  }
};

const updatePaymentStatus = async (req, res) => {
  const { id } = req.params;
  const query = { _id: new ObjectId(id) };

  const existingOrder = await req.db.ordersCollections.findOne(query);

  const cartData = existingOrder.cartData;

  for (const cart of cartData) {
    const existingMedicine = await req.db.medicineCollections.findOne({
      _id: new ObjectId(cart.medicineId),
    });
    const sellerEmail = existingMedicine.sellerEmail;
    const existingSellerHistory = await req.db.sellerPaymentCollections
      .find({
        sellerEmail: sellerEmail,
        medicineId: cart.medicineId,
        transactionId: existingOrder.transactionId,
      })
      .toArray();

    for (const sellerHistory of existingSellerHistory) {
      await req.db.sellerPaymentCollections.updateOne(
        { _id: sellerHistory._id },
        {
          $set: { paymentStatus: "paid" },
        }
      );
    }
  }

  const result = await req.db.ordersCollections.updateOne(query, {
    $set: { paymentStatus: "paid" },
  });
  res.send(result);
};

module.exports = {
  createPaymentIntent,
  placeOrder,
  getOrders,
  getSellerPaymentHistory,
  updatePaymentStatus,
};