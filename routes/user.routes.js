// routes/user.routes.js
const express = require("express");
const {
  verifyFirebaseToken,
  verifyTokenEmail,
  verifyAdmin,
} = require("../middlewares/auth.middleware");

const { getUsers } = require("../controllers/user.controller");

module.exports = (db) => {
  const router = express.Router();

  // Inject db to req for middleware use
  router.use((req, res, next) => {
    req.db = db;
    next();
  });

  router.get("/users", getUsers);

  return router;
};
