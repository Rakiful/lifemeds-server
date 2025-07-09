// middlewares/auth.middleware.js
const { admin } = require("../utils/firebase");

const verifyFirebaseToken = async (req, res, next) => {
  const authHeader = req.headers?.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).send({ message: "unauthorized access" });
  }
  const token = authHeader.split(" ")[1];
  try {
    const userInfo = await admin.auth().verifyIdToken(token);
    req.decoded = { email: userInfo.email };
    next();
  } catch (err) {
    return res.status(403).send({ message: "invalid token" });
  }
};

const verifyTokenEmail = (req, res, next) => {
  if (req.query.email !== req.decoded.email) {
    return res.status(403).send({ message: "forbidden access" });
  }
  next();
};

const verifyAdmin = async (req, res, next) => {
  const email = req.decoded?.email;

  const user = await req.db.userCollections.findOne({ email });
  if (!user || user.role !== "admin") {
    return res.status(403).send({ message: "admin access only" });
  }
  next();
};

module.exports = {
  verifyFirebaseToken,
  verifyTokenEmail,
  verifyAdmin,
};
