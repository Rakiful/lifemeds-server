// controllers/user.controller.js

const getUsers = async (req, res) => {
  try {
    const users = await req.db.userCollections.find().toArray();
    res.send(users);
  } catch (error) {
    res.status(500).send({ message: "Internal Server Error", error: error.message });
  }
};

module.exports = {
  getUsers,
};