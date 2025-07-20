// routes/medicine.routes.js
const express = require("express");

const {
  verifyToken,
  verifyTokenEmail,
  verifyAdmin,
  verifySeller,
} = require("../middlewares/auth.middlewares");

const {
  getMedicines,
  addMedicine,
  updateMedicine,
  deleteMedicine,
  getMedicinesBySeller,
  getMedicinesByCategory,
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
  router.get("/medicines/:categoryName", getMedicinesByCategory);
  router.get(
    "/medicines/seller/:email",
    verifyToken,
    verifySeller,
    getMedicinesBySeller
  );
  router.post(
    "/medicines",
    verifyToken,
    verifySeller,
    addMedicine
  );
  router.put(
    "/medicines/:id",
    verifyToken,
    verifySeller,
    updateMedicine
  );
  router.delete(
    "/medicines/:id",
    verifyToken,
    verifySeller,
    deleteMedicine
  );

  // Get distinct companies from medicineCollections
  router.get(
    "/companies",
    verifyToken,
    verifySeller,
    getCompanies
  );

  return router;
};
