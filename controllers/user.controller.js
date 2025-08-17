// controllers/user.controller.js
const { ObjectId } = require("mongodb");

const getUsers = async (req, res) => {
  try {
    const users = await req.db.userCollections.find().toArray();
    res.send(users);
  } catch (error) {
    res
      .status(500)
      .send({ message: "Internal Server Error", error: error.message });
  }
};

const getUserRole = async (req, res) => {
  try {
    const email = req.params.email;
    const user = await req.db.userCollections.findOne({ email });
    res.send({ role: user?.role || "user" });
  } catch (error) {
    res
      .status(500)
      .send({ message: "Internal Server Error", error: error.message });
  }
};

const addOrUpdateUser = async (req, res) => {
  try {
    const { name, email, uid, photo, createdAt, role, lastLogin } = req.body;

    const newUser = { name, email, uid, photo, createdAt, role, lastLogin };

    const existingUser = await req.db.userCollections.findOne({ email, uid });

    if (existingUser) {
      const query = { _id: new ObjectId(existingUser._id) };
      const updateDoc = {
        $set: { lastLogin },
      };
      const result = await req.db.userCollections.updateOne(query, updateDoc);
      res.status(201).send(result);
      return;
    } else {
      const result = await req.db.userCollections.insertOne(newUser);
      res.status(201).send(result);
    }
  } catch (error) {
    res
      .status(500)
      .send({ message: "Internal Server Error", error: error.message });
  }
};

const updateUserRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;
    const result = await req.db.userCollections.updateOne(
      { _id: new ObjectId(id) },
      { $set: { role } }
    );
    res.send(result);
  } catch {
    res
      .status(500)
      .send({ message: "Internal Server Error", error: error.message });
  }
};

// Get single user by email
const getUserByEmail = async (req, res) => {
  try {
    const { email } = req.params;
    const user = await req.db.userCollections.findOne({ email });
    if (!user) return res.status(404).send({ message: "User not found" });
    res.send(user);
  } catch (error) {
    res
      .status(500)
      .send({ message: "Internal Server Error", error: error.message });
  }
};

// Update User Profile
const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      nickName,
      gender,
      country,
      address,
      language,
      timezone,
      photo,
    } = req.body;

    // Build the update object dynamically
    const updateFields = {};
    if (name) updateFields.name = name;
    if (nickName) updateFields.nickName = nickName;
    if (gender) updateFields.gender = gender;
    if (country) updateFields.country = country;
    if (address) updateFields.address = address;
    if (language) updateFields.language = language;
    if (timezone) updateFields.timezone = timezone;
    if (photo) updateFields.photo = photo;

    if (Object.keys(updateFields).length === 0) {
      return res
        .status(400)
        .send({ success: false, message: "No fields provided for update" });
    }

    const result = await req.db.userCollections.updateOne(
      { _id: new ObjectId(id) },
      { $set: updateFields }
    );

    if (result.matchedCount === 0) {
      return res
        .status(404)
        .send({ success: false, message: "User not found" });
    }

    res
      .status(200)
      .send({ success: true, message: "User updated successfully" });
  } catch (err) {
    console.error("Update User Error:", err);
    res.status(500).send({ success: false, message: err.message });
  }
};

module.exports = {
  getUsers,
  getUserByEmail,
  addOrUpdateUser,
  getUserRole,
  updateUserRole,
  updateUser,
};
