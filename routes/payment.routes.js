// routes/payment.routes.js
const express = require("express");
const {
  createPaymentIntent,
  placeOrder,
  getOrders,
} = require("../controllers/payment.controller");

const { verifyFirebaseToken } = require("../middlewares/auth.middlewares");

module.exports = (db) => {
  const router = express.Router();

  // Inject db into every request
  router.use((req, res, next) => {
    req.db = db;
    next();
  });

  // Create Stripe payment intent
  router.post("/create-payment-intent", createPaymentIntent);

  router.get("/orders", getOrders);
  router.post("/orders", placeOrder);

  return router;
};
