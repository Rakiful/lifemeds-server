// controllers/subscriber.controller.js
const getSubscribers = async (req, res) => {
  try {
    const result = await req.db.subscriberCollections.find({}).toArray();

    const emails = result.map((item) => item._id);
    res.send(emails);
  } catch (error) {
    res
      .status(500)
      .send({ message: "Internal Server Error", error: error.message });
  }
};

const addSubscribers = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).send({ message: "Email is required" });

    const existingSubscriber = await req.db.subscriberCollections.findOne({
      _id: email,
    });

    if (existingSubscriber) {
      res.status(201).send({ message: "This email already taken" });
      return;
    } else {
      const result = await req.db.subscriberCollections.insertOne({
        _id: email,
      });
      res.status(201).send({ message: "Subscribed successfully", email });
    }
  } catch (error) {
    res
      .status(500)
      .send({ message: "Internal Server Error", error: error.message });
  }
};

module.exports = {
  getSubscribers,
  addSubscribers,
};
