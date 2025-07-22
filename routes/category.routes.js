const express = require("express");

const {
  verifyAdmin,
  verifyToken,
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
  router.post(
    "/categories",
    verifyToken,
    verifyAdmin,
    addCategory
  );
  router.put(
    "/categories/:id",
    verifyToken,
    verifyAdmin,
    updateCategory
  );
  router.delete(
    "/categories/:id",
    verifyToken,
    verifyAdmin,
    deleteCategory
  );

  return router;
};
