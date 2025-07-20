const express = require("express");

const {
  verifyToken,
  verifyTokenEmail,
  verifyAdmin,
  verifySeller,
} = require("../middlewares/auth.middlewares");

const {
  getBannerSlider,
  getAllSellerAdvertisements,
  getSellerAdvertisements,
  requestAdvertisement,
  cancelAdvertisementRequest,
  updateSliderStatus,
} = require("../controllers/advertisement.controller");

module.exports = (db) => {
  const router = express.Router();

  // Inject db into request
  router.use((req, res, next) => {
    req.db = db;
    next();
  });

  router.get("/advertisements/slider", getBannerSlider);
  router.get(
    "/advertisements",
    verifyToken,
    verifyAdmin,
    getAllSellerAdvertisements
  );
  router.get(
    "/advertisements/:email",
    verifyToken,
    verifySeller,
    getSellerAdvertisements
  );
  router.post(
    "/advertisements",
    verifyToken,
    verifySeller,
    requestAdvertisement
  );

  router.patch(
    "/advertisements/slider/:id",
    verifyToken,
    verifyAdmin,
    updateSliderStatus
  );
  router.delete(
    "/advertisements/:id",
    verifyToken,
    verifySeller,
    cancelAdvertisementRequest
  );

  return router;
};
