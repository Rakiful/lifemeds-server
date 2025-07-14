//server.js
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { connectToDB } = require("./utils/db");
const { initializeFirebase } = require("./utils/firebase");
const userRoutes = require("./routes/user.routes");
const medicineRoutes = require("./routes/medicine.routes");
const cartRoutes = require("./routes/cart.routes");
const paymentRoutes = require("./routes/payment.routes");


const app = express();
const port = process.env.PORT || 3000;

app.use(
  cors({
    origin: ["http://localhost:5173", "https://rakif.netlify.app"],
    credentials: true,
  })
);
app.use(express.json());

initializeFirebase();

connectToDB().then((db) => {
  app.use("/", userRoutes(db));
  app.use("/", medicineRoutes(db));
  app.use("/", cartRoutes(db));
  app.use("/", paymentRoutes(db));
  app.get("/", (req, res) => {
    res.send("LifeMeds Server Running");
  });

  app.listen(port, () => {
    console.log(`server running on port ${port}`);
    console.log(`Server running on http://localhost:${port}`);
  });
});
