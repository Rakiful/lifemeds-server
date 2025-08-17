// controllers/medicine.controller.js
const { ObjectId } = require("mongodb");

const getMedicines = async (req, res) => {
  try {
    const medicines = await req.db.medicineCollections.find().toArray();
    res.send(medicines);
  } catch (error) {
    res
      .status(500)
      .send({ message: "Internal Server Error", error: error.message });
  }
};
const getMedicinesByCategory = async (req, res) => {
  try {
    const categoryName = req.params.categoryName;
    const medicines = await req.db.medicineCollections
      .find({ category: categoryName })
      .toArray();
    res.send(medicines);
  } catch (error) {
    res
      .status(500)
      .send({ message: "Internal Server Error", error: error.message });
  }
};
const getDiscountedMedicines = async (req, res) => {
  try {
    const medicines = await req.db.medicineCollections
      .find({ discount: { $gt: 0 } })
      .sort({ discount: -1 })
      .toArray();
    res.send(medicines);
  } catch (error) {
    res
      .status(500)
      .send({ message: "Internal Server Error", error: error.message });
  }
};
const getRecentMedicines = async (req, res) => {
  try {
    const medicines = await req.db.medicineCollections
      .find()
      .sort({ createdAt: -1 })
      .limit(4)
      .toArray();
    res.send(medicines);
  } catch (error) {
    res
      .status(500)
      .send({ message: "Internal Server Error", error: error.message });
  }
};
const getMedicinesBySeller = async (req, res) => {
  try {
    const sellerEmail = req.params.email;

    if (!sellerEmail) {
      return res.status(400).json({ error: "sellerEmail is required" });
    }

    const medicines = await req.db.medicineCollections
      .find({ sellerEmail: sellerEmail })
      .toArray();

    res.send(medicines);
  } catch (error) {
    res
      .status(500)
      .send({ message: "Internal Server Error", error: error.message });
  }
};

const addMedicine = async (req, res) => {
  try {
    const newitem = req.body;
    const { category } = req.body;

    const categoryMedicineCount = await req.db.categoryCollections.updateOne(
      { categoryName: category },
      { $inc: { medicineCount: 1 } }
    );

    const result = await req.db.medicineCollections.insertOne(newitem);
    res.send(result);
  } catch (error) {
    res
      .status(500)
      .send({ message: "Internal Server Error", error: error.message });
  }
};

const updateMedicine = async (req, res) => {
  const id = req.params.id;
  const updatedMedicine = req.body;

  if (updatedMedicine._id) {
    delete updatedMedicine._id;
  }

  try {
    const result = await req.db.medicineCollections.updateOne(
      { _id: new ObjectId(id) },
      {
        $set: updatedMedicine,
      }
    );
    res.send(result);
  } catch (err) {
    console.error("Error in updateMedicine:", err);
    res.status(500).json({ error: "Failed to update medicine." });
  }
};

const deleteMedicine = async (req, res) => {
  const id = req.params.id;

  try {
    const result = await req.db.medicineCollections.deleteOne({
      _id: new ObjectId(id),
    });

    if (result.deletedCount > 0) {
      res.json({ deletedCount: result.deletedCount });
    } else {
      res.status(404).json({ error: "Medicine not found." });
    }
  } catch (err) {
    res.status(500).json({ error: "Failed to delete medicine." });
  }
};

// Get distinct companies from medicineCollections
const getCompanies = async (req, res) => {
  try {
    const companies = [
      "Beximco Pharma",
      "Square Pharmaceuticals",
      "ACI Limited",
      "Eskayef",
      "Incepta Pharma",
      "Renata Ltd",
      "Acme Laboratories",
      "Aristopharma",
      "Opsonin Pharma",
    ];
    res.send(companies);
  } catch (error) {
    res
      .status(500)
      .send({ message: "Failed to fetch companies", error: error.message });
  }
};

module.exports = {
  getMedicinesBySeller,
  getDiscountedMedicines,
  getRecentMedicines,
  getMedicinesByCategory,
  getMedicines,
  addMedicine,
  updateMedicine,
  deleteMedicine,
  getCompanies,
};
