// routes/user.routes.js
const express = require("express");

const {
  verifyFirebaseToken,
  verifyTokenEmail,
  verifyAdmin,
} = require("../middlewares/auth.middlewares");

const {
  getUsers,
  addOrUpdateUser,
  getUserRole,
} = require("../controllers/user.controller");

module.exports = (db) => {
  const router = express.Router();

  // Inject db to req for middleware use
  router.use((req, res, next) => {
    req.db = db;
    next();
  });

  router.get("/users", getUsers);
  router.post("/users", addOrUpdateUser);
  router.get("/users/:email/role",verifyFirebaseToken, getUserRole);

  return router;
};
