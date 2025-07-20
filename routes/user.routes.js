// routes/user.routes.js
const express = require("express");

const {
  verifyTokenEmail,
  verifyAdmin,
  verifyToken,
} = require("../middlewares/auth.middlewares");

const {
  getUsers,
  addOrUpdateUser,
  getUserRole,
  updateUserRole,
} = require("../controllers/user.controller");

module.exports = (db) => {
  const router = express.Router();

  // Inject db to req for middleware use
  router.use((req, res, next) => {
    req.db = db;
    next();
  });

  router.get("/users", verifyToken, verifyAdmin, getUsers);
  router.get("/users/:email/role",verifyToken, getUserRole);
  router.post("/users", addOrUpdateUser);
  router.patch(
    "/users/role/:id",
    verifyToken,
    verifyAdmin,
    updateUserRole
  );

  return router;
};
