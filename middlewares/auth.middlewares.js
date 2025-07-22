// middlewares/auth.middleware.js
const jwt = require("jsonwebtoken");

const verifyToken = async (req, res, next) => {
  const token = req?.cookies?.token;
  if (!token) {
    return res.status(401).send({ message: "unauthorized access" });
  }

  jwt.verify(token, process.env.JWT_SECRET_KEY, (error, decoded) => {
    if (error) {
      return res.status(401).send({ message: "unauthorized access" });
    }
    req.decoded = decoded;
    next();
  });
};

const verifyAdmin = async (req, res, next) => {
  const email = req.decoded?.email;

  const user = await req.db.userCollections.findOne({ email });
  if (!user || user.role !== "admin") {
    return res.status(403).send({ message: "admin access only" });
  }
  next();
};

const verifySeller = async (req, res, next) => {
  const email = req.decoded?.email;

  const user = await req.db.userCollections.findOne({ email });
  if (!user || user.role !== "seller") {
    return res.status(403).send({ message: "seller access only" });
  }
  next();
};

module.exports = {
  verifyToken,
  verifyAdmin,
  verifySeller
};