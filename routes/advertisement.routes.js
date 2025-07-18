const express = require("express");

const {
  
  getBannerSlider,
  getAllSellerAdvertisements,
  getSellerAdvertisements,
  requestAdvertisement,
  updateAdvertisementStatus,
  cancelAdvertisementRequest,
  updateSliderStatus ,
} = require("../controllers/advertisement.controller");

module.exports = (db) => {
  const router = express.Router();

  // Inject db into request
  router.use((req, res, next) => {
    req.db = db;
    next();
  });

  router.get("/advertisements/slider", getBannerSlider,);
  router.get("/advertisements", getAllSellerAdvertisements);
  router.get("/advertisements/:email", getSellerAdvertisements);
  router.post("/advertisements", requestAdvertisement);
  router.put("/advertisements/:id", updateAdvertisementStatus);
  router.delete("/advertisements/:id", cancelAdvertisementRequest);
  router.patch("/advertisements/slider/:id", updateSliderStatus);

  return router;
};