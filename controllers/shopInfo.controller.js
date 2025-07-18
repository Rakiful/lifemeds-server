const { ObjectId } = require("mongodb");

const getSalesReport = async (req, res) => {
  try {
    const orders = await req.db.ordersCollections.find().toArray();
    const medicines = await req.db.medicineCollections.find().toArray();

    const medicineMap = {};
    medicines.forEach((med) => {
      medicineMap[med._id.toString()] = med;
    });

    const report = [];

    orders.forEach((order) => {
      const buyerEmail = order.buyerEmail;
      const paymentStatus = order.paymentStatus;
      const orderDate = order.orderDate;
      const cartData = order.cartData || [];

      cartData.forEach((item) => {
        const med = medicineMap[item.medicineId];
        if (med) {
          report.push({
            medicineName: med.name,
            medicineImage: med.image,
            sellerEmail: med.sellerEmail,
            buyerEmail,paymentStatus,
            quantity: item.quantity,
            price: med.price,
            totalPrice: item.quantity*med.price,
            orderDate,
          });
        }
      });
    });

    res.json(report);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error", details: err.message });
  }
};

module.exports = {
  getSalesReport,
};
