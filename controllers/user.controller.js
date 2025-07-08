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

module.exports = {
  getUsers,
  addOrUpdateUser,
};
