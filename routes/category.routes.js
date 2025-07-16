const express = require("express");

const {
  verifyFirebaseToken,
  verifyTokenEmail,
  verifyAdmin,
} = require("../middlewares/auth.middlewares");

const {
  getAllCategories,
  addCategory,
  deleteCategory,
  updateCategory,
} = require("../controllers/category.controller");

module.exports = (db) => {
  const router = express.Router();

  // Inject db to req for middleware use
  router.use((req, res, next) => {
    req.db = db;
    next();
  });

  router.get("/categories", getAllCategories);
  router.post("/categories", verifyFirebaseToken, verifyAdmin, addCategory);
  router.delete(
    "/categories/:id",
    verifyFirebaseToken,
    verifyAdmin,
    deleteCategory
  );
  router.put(
    "/categories/:id",
    verifyFirebaseToken,
    verifyAdmin,
    updateCategory
  );

  return router;
};
