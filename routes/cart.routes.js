// routes/medicine.routes.js
const express = require("express");

const {
  verifyFirebaseToken,
  verifyTokenEmail,
  verifyAdmin,
} = require("../middlewares/auth.middlewares");

const {
  getCartItem,
  addCartItem,
  updateCartItem,
  clearCart,
  getCartItemCount,
} = require("../controllers/cart.controller");

module.exports = (db) => {
  const router = express.Router();

  // Inject db to req for middleware use
  router.use((req, res, next) => {
    req.db = db;
    next();
  });

  router.get("/cart/:email", getCartItem);
  router.patch("/cart/:id", updateCartItem);
  router.post("/cart", verifyFirebaseToken, addCartItem);
  router.delete("/cart/clear/:email", clearCart);
  router.get("/cart/count/:email", getCartItemCount);

  return router;
};
