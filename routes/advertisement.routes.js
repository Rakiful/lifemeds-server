const express = require("express");

const {
  getSellerAdvertisements,
  requestAdvertisement,
  updateAdvertisementStatus,
  cancelAdvertisementRequest,
} = require("../controllers/advertisement.controller");

module.exports = (db) => {
  const router = express.Router();

  // Inject db into request
  router.use((req, res, next) => {
    req.db = db;
    next();
  });

  router.get("/advertisements/:email", getSellerAdvertisements);
  router.post("/advertisements", requestAdvertisement);
  router.put("/advertisements/:id", updateAdvertisementStatus);
  router.delete("/advertisements/:id", cancelAdvertisementRequest);

  return router;
};
