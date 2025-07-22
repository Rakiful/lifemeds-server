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

const {
  verifyToken,
  verifyAdmin,
  verifySeller,
} = require("../middlewares/auth.middlewares");

module.exports = (db) => {
  const router = express.Router();

  // Inject db into every request
  router.use((req, res, next) => {
    req.db = db;
    next();
  });

  // Create Stripe payment intent
  router.post("/create-payment-intent", createPaymentIntent);

  router.get("/orders", verifyToken,  verifyAdmin, getOrders);
  router.get(
    "/user/payments/:email",
    verifyToken,
    getUserOrders
  );
  router.get(
    "/seller/payments/:email",
    verifyToken,
    verifySeller,
    getSellerPaymentHistory
  );
  router.post("/orders", verifyToken, placeOrder);
  router.patch(
    "/orders/:id/payment",
    verifyToken,
    verifyAdmin,
    updatePaymentStatus
  );

  return router;
};
