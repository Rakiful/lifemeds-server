// routes/payment.routes.js
const express = require("express");
const {
  createPaymentIntent,
  placeOrder,
  getOrders,
  getUserOrders,
  getSellerPaymentHistory,
  updatePaymentStatus,
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
  router.get("/user/payments/:email", getUserOrders);
  router.get("/seller/payments/:email", getSellerPaymentHistory);
  router.post("/orders", placeOrder);
  router.patch("/orders/:id/payment",updatePaymentStatus);

  return router;
};
