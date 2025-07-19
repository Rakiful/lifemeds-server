// controllers/cart.controller.js
const { ObjectId } = require("mongodb");

const getCartItem = async (req, res) => {
  try {
    const email = req.params.email;
    if (!email) {
      return res.status(400).send({ message: "Email query is required." });
    }
    const carts = await req.db.cartCollections
      .find({ userEmail: email })
      .toArray();
    res.send(carts);
  } catch (error) {
    res
      .status(500)
      .send({ message: "Internal Server Error", error: error.message });
  }
};

const addCartItem = async (req, res) => {
  try {
    const newitem = req.body;
    const existingCart = await req.db.cartCollections.findOne({
      medicineId: newitem.medicineId,
      userEmail: newitem.userEmail,
    });
    if (existingCart) {
      return res.send({ message: "Already in cart" });
    } else {
      const result = await req.db.cartCollections.insertOne(newitem);
      res.send(result);
    }
  } catch (error) {
    res
      .status(500)
      .send({ message: "Internal Server Error", error: error.message });
  }
};

const updateCartItem = async (req, res) => {
  try {
    const id = req.params.id;
    const { operation } = req.body;

    if (!ObjectId.isValid(id)) {
      return res.status(400).send({ message: "Invalid cart item ID." });
    }

    const query = { _id: new ObjectId(id) };

    if (operation === "increase") {
      const result = await req.db.cartCollections.updateOne(query, {
        $inc: { quantity: +1 },
      });
      return res.send(result);
    }

    if (operation === "decrease") {
      const result = await req.db.cartCollections.updateOne(query, {
        $inc: { quantity: -1 },
      });
      return res.send(result);
    }

    if (operation === "removeItem") {
      const result = await req.db.cartCollections.deleteOne(query);
      return res.send(result);
    }

    // If operation doesn't match any known action
    return res.status(400).send({ message: "Invalid operation type." });
  } catch (error) {
    res.status(500).send({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

const clearCart = async (req, res) => {
  try {
    const email = req.params.email;
    await db.cartCollections.deleteMany({ userEmail: email });
    res.send({ message: "Cart cleared" });
  } catch (error) {
    res.status(500).send({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

const getCartItemCount = async (req, res) => {
  try {
    const email = req.params.email;

    if (!email) {
      return res.status(400).send({ message: "Email is required" });
    }

    const count = await req.db.cartCollections.countDocuments({
      userEmail: email,
    });

    res.send({ count });
  } catch (error) {
    res.status(500).send({
      message: "Failed to fetch cart item count",
      error: error.message,
    });
  }
};

module.exports = {
  addCartItem,
  getCartItem,
  updateCartItem,
  clearCart,
  getCartItemCount,
};
