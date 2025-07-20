// routes/dashboard.routes.js
const express = require("express");

const {
  verifyToken,
  verifyTokenEmail,
  verifyAdmin,
  verifySeller,
} = require("../middlewares/auth.middlewares");

const {
  getSalesReport,
  getAdminDashboardStats,
  getSellerDashboardStats,
  getUserDashboardStats,
} = require("../controllers/dashboard.controller");

module.exports = (db) => {
  const router = express.Router();

  // Inject db to req for middleware use
  router.use((req, res, next) => {
    req.db = db;
    next();
  });
  router.get(
    "/api/sales-report",
    verifyToken,
    getSalesReport
  );
  router.get(
    "/dashboard/admin",
    verifyToken,
    verifyAdmin,
    getAdminDashboardStats
  );
  router.get(
    "/dashboard/seller/:email",
    verifyToken,
    verifySeller,
    getSellerDashboardStats
  );
  router.get(
    "/dashboard/user/:email",
    verifyToken,
    getUserDashboardStats
  );

  return router;
};
