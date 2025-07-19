const { ObjectId } = require("mongodb");

// GET /categories
const getAllCategories = async (req, res) => {
  try {
    const categories = await req.db.categoryCollections
      .find()
      .sort({ createdAt: -1 })
      .toArray();
    res.json(categories);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch categories." });
  }
};

// POST /categories
const addCategory = async (req, res) => {
  const { categoryName, categoryImage } = req.body;

  if (!categoryName || !categoryImage) {
    return res.status(400).json({ error: "Both fields are required." });
  }

  const newCategory = {
    categoryName,
    categoryImage,
    medicineCount: 0,
    createdAt: new Date(),
  };

  try {
    const result = await req.db.categoryCollections.insertOne(newCategory);
    res.json({ insertedId: result.insertedId });
  } catch (err) {
    res.status(500).json({ error: "Failed to add category." });
  }
};

// DELETE /categories/:id
const deleteCategory = async (req, res) => {
  const id = req.params.id;

  try {
    const result = await req.db.categoryCollections.deleteOne({
      _id: new ObjectId(id),
    });

    if (result.deletedCount > 0) {
      res.json({ deletedCount: result.deletedCount });
    } else {
      res.status(404).json({ error: "Category not found." });
    }
  } catch (err) {
    res.status(500).json({ error: "Failed to delete category." });
  }
};

// PUT /categories/:id
const updateCategory = async (req, res) => {
  const id = req.params.id;
  const { categoryName, categoryImage } = req.body;

  if (!categoryName || !categoryImage) {
    return res.status(400).json({ error: "All fields are required." });
  }

  try {
    const result = await req.db.categoryCollections.updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          categoryName,
          categoryImage,
          updatedAt: new Date(),
        },
      }
    );

    if (result.modifiedCount > 0) {
      res.json({ modifiedCount: result.modifiedCount });
    } else {
      res.status(404).json({ error: "Category not found or unchanged." });
    }
  } catch (err) {
    res.status(500).json({ error: "Failed to update category." });
  }
};

module.exports = {
  getAllCategories,
  addCategory,
  deleteCategory,
  updateCategory,
};
