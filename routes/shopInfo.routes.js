// routes/medicine.routes.js
const express = require("express");

const {
  verifyFirebaseToken,
  verifyTokenEmail,
  verifyAdmin,
} = require("../middlewares/auth.middlewares");

const { getSalesReport } = require("../controllers/shopInfo.controller");

module.exports = (db) => {
  const router = express.Router();

  // Inject db to req for middleware use
  router.use((req, res, next) => {
    req.db = db;
    next();
  });

  router.get("/api/sales-report", getSalesReport);


  return router;
};
