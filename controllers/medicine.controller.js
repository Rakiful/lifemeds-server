// controllers/medicine.controller.js
const { ObjectId } = require("mongodb");

const getMedicines = async (req, res) => {
  try {
    const users = await req.db.medicineCollections.find().toArray();
    res.send(users);
  } catch (error) {
    res
      .status(500)
      .send({ message: "Internal Server Error", error: error.message });
  }
};

const addMedicine = async (req, res) => {
  try {
    const newitem = req.body;
    const result = await req.db.medicineCollections.insertOne(newitem);
    res.send(result);
  } catch (error) {
    res
      .status(500)
      .send({ message: "Internal Server Error", error: error.message });
  }
};

// Get distinct categories from medicineCollections
const getCategories = async (req, res) => {
  try {
    const categories = await req.db.medicineCollections.distinct("category");
    res.send(categories);
  } catch (error) {
    res
      .status(500)
      .send({ message: "Failed to fetch categories", error: error.message });
  }
};

// Get distinct companies from medicineCollections
const getCompanies = async (req, res) => {
  try {
    const companies = await req.db.medicineCollections.distinct("company");
    res.send(companies);
  } catch (error) {
    res
      .status(500)
      .send({ message: "Failed to fetch companies", error: error.message });
  }
};

module.exports = {
  getMedicines,
  addMedicine,
  getCategories,
  getCompanies,
};
