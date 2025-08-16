//server.js
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const { connectToDB } = require("./utils/db");
// const { initializeFirebase } = require("./utils/firebase");
const userRoutes = require("./routes/user.routes");
const medicineRoutes = require("./routes/medicine.routes");
const cartRoutes = require("./routes/cart.routes");
const paymentRoutes = require("./routes/payment.routes");
const categoryRoutes = require("./routes/category.routes");
const advertisementRoutes = require("./routes/advertisement.routes");
const dashboardRoutes = require("./routes/dashboard.routes");
const subscriberRoutes = require("./routes/subscriber.routes");

const app = express();
const port = process.env.PORT || 3000;

app.use(
  cors({
    origin: ["http://localhost:5173", "https://lifemeds-pharma.netlify.app"],
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

// initializeFirebase();

connectToDB().then((db) => {
  app.use("/", userRoutes(db));
  app.use("/", medicineRoutes(db));
  app.use("/", cartRoutes(db));
  app.use("/", paymentRoutes(db));
  app.use("/", categoryRoutes(db));
  app.use("/", advertisementRoutes(db));
  app.use("/", dashboardRoutes(db));
  app.use("/", subscriberRoutes(db));

  app.post("/jwt", async (req, res) => {
    const { email } = req.body;
    const user = { email };

    const token = jwt.sign(user, process.env.JWT_SECRET_KEY, {
      expiresIn: "7d",
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "none", 
    });

    res.send({ token });
  });

  app.get("/", (req, res) => {
    res.send("LifeMeds Server Running");
  });

  app.listen(port, () => {
    // console.log(`server running on port ${port}`);
    // console.log(`Server running on http://localhost:${port}`);
  });
});
