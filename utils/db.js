// utils/db.js
const { MongoClient, ServerApiVersion } = require("mongodb");

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ijkngio.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: false,
    deprecationErrors: true,
  },
});

async function connectToDB() {
  await client.connect();
  const connected = await client.db("MyPortfolio").command({ ping: 1 });
  if (connected) {
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  }
  return {
    userCollections: client.db("LifeMeds").collection("user"),
    medicineCollections: client.db("LifeMeds").collection("medicine"),
    cartCollections: client.db("LifeMeds").collection("cart"),
    ordersCollections: client.db("LifeMeds").collection("order"),
    sellerPaymentCollections: client.db("LifeMeds").collection("sellerPaymentHistory"),
    shopPaymentCollections: client.db("LifeMeds").collection("shopInfo"),
  };
}

module.exports = { connectToDB };