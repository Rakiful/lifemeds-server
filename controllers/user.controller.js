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
    if (req.decoded.email !== email) {
      return res.status(403).send({ message: "Forbidden" });
    }
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

module.exports = {
  getUsers,
  addOrUpdateUser,
  getUserRole,
  updateUserRole,
};
