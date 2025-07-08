//server.js
const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { connectToDB } = require("./utils/db");

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

connectToDB().then((db) => {
  app.get("/", (req, res) => {
    res.send("LifeMeds Server Running");
  });

  app.listen(port, () => {
    console.log(`server running on port ${port}`);
    console.log(`Server running on http://localhost:${port}`);
  });
});