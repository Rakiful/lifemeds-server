// routes/subscriber.routes.js
const express = require("express");

const {
  getSubscribers,
  addSubscribers,
} = require("../controllers/subscriber.controller");

module.exports = (db) => {
  const router = express.Router();

  // Inject db to req for middleware use
  router.use((req, res, next) => {
    req.db = db;
    next();
  });

  router.get("/subscribers", getSubscribers);
  router.post("/subscribers", addSubscribers);

  return router;
};
