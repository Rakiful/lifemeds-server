// routes/medicine.routes.js
const express = require("express");

const {
  verifyFirebaseToken,
  verifyTokenEmail,
  verifyAdmin,
} = require("../middlewares/auth.middlewares");

const {
  getMedicines,
  addMedicine,
  // getCategories,
  getCompanies,
} = require("../controllers/medicine.controller");

module.exports = (db) => {
  const router = express.Router();

  // Inject db to req for middleware use
  router.use((req, res, next) => {
    req.db = db;
    next();
  });

  router.get("/medicines", getMedicines);
  router.post("/medicines", verifyFirebaseToken, addMedicine);

  // Get distinct categories from medicineCollections
  // router.get("/categories", getCategories);

  // Get distinct companies from medicineCollections
  router.get("/companies", getCompanies);

  return router;
};
