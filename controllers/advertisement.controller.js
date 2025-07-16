const { ObjectId } = require("mongodb");

// GET /advertisements?sellerEmail=
const getSellerAdvertisements = async (req, res) => {
  const sellerEmail  = req.params.email;

  if (!sellerEmail) {
    return res.status(400).json({ error: "sellerEmail is required" });
  }

  try {
    const ads = await req.db.advertisements
      .find({ sellerEmail })
      .sort({ createdAt: -1 })
      .toArray();

    res.json(ads);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch advertisements" });
  }
};

// POST /advertisements
const requestAdvertisement = async (req, res) => {
  const { medicineImage, description, sellerEmail } = req.body;

  console.log(req.body)

  if (!medicineImage || !description || !sellerEmail) {
    return res.status(400).json({ error: "All fields are required" });
  }

  const adData = {
    medicineImage,
    description,
    sellerEmail,
    status: "pending",
    createdAt: new Date(),
  };

  try {
    const result = await req.db.advertisements.insertOne(adData);
    res.json({ insertedId: result.insertedId });
  } catch (err) {
    res.status(500).json({ error: "Failed to request advertisement" });
  }
};

// PUT /advertisements/:id
const updateAdvertisementStatus = async (req, res) => {
  const id = req.params.id;
  const { status } = req.body;

  if (!status || !["approved", "rejected", "pending"].includes(status)) {
    return res.status(400).json({ error: "Invalid or missing status" });
  }

  try {
    const result = await req.db.advertisements.updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          status,
          updatedAt: new Date(),
        },
      }
    );

    if (result.modifiedCount > 0) {
      res.json({ modifiedCount: result.modifiedCount });
    } else {
      res.status(404).json({ error: "Advertisement not found or unchanged" });
    }
  } catch (err) {
    res.status(500).json({ error: "Failed to update status" });
  }
};

// DELETE /advertisements/:id
const cancelAdvertisementRequest = async (req, res) => {
  const { ObjectId } = require("mongodb");
  const id = req.params.id;

  try {
    const result = await req.db.advertisements.deleteOne({ _id: new ObjectId(id) });
    if (result.deletedCount > 0) {
      res.json({ success: true });
    } else {
      res.status(404).json({ error: "Ad not found" });
    }
  } catch (err) {
    res.status(500).json({ error: "Failed to cancel ad request" });
  }
};

module.exports = {
  getSellerAdvertisements,
  requestAdvertisement,
  updateAdvertisementStatus,
    cancelAdvertisementRequest,
};
