// routes/cart.routes.js
const express = require("express");

const {
  verifyToken,
  verifyTokenEmail,
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

  router.get("/cart/:email", verifyToken, getCartItem);
  router.get(
    "/cart/count/:email",
    getCartItemCount
  );
  router.post("/cart", verifyToken,  addCartItem);
  router.patch("/cart/:id", verifyToken,  updateCartItem);
  router.delete("/cart/clear/:email", verifyToken, clearCart);

  return router;
};
