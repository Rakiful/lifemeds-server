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
  router.get("/medicines/seller/:email", getMedicinesBySeller);
  router.post("/medicines", verifyFirebaseToken, addMedicine);
  router.put("/medicines/:id", verifyFirebaseToken, updateMedicine);
  router.delete("/medicines/:id", verifyFirebaseToken, deleteMedicine);

  // Get distinct companies from medicineCollections
  router.get("/companies", getCompanies);

  return router;
};
