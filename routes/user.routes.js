// routes/user.routes.js
const express = require("express");

const { verifyAdmin, verifyToken } = require("../middlewares/auth.middlewares");

const {
  getUsers,
  getUserByEmail,
  addOrUpdateUser,
  getUserRole,
  updateUserRole,
  updateUser,
} = require("../controllers/user.controller");

module.exports = (db) => {
  const router = express.Router();

  // Inject db to req for middleware use
  router.use((req, res, next) => {
    req.db = db;
    next();
  });

  router.get("/users", verifyToken, verifyAdmin, getUsers);
  router.get("/users/:email/role", getUserRole);
  router.post("/users", addOrUpdateUser);
  router.patch("/users/role/:id", verifyToken, verifyAdmin, updateUserRole);
  router.patch("/users/:id", verifyToken, updateUser);
  router.get("/users/email/:email", verifyToken, getUserByEmail);

  return router;
};
