
const getAdminDashboardStats = async (req, res) => {
  try {

    // Orders
    const orders = await req.db.ordersCollections.find().toArray();
    const totalOrders = orders.length;

    let totalPaidAmount = 0;
    let totalPendingAmount = 0;

    for (const order of orders) {
      if (order.paymentStatus === "paid") {
        totalPaidAmount += order.total || 0;
      } else {
        totalPendingAmount += order.total || 0;
      }
    }

    const totalEarnings = totalPaidAmount + totalPendingAmount ;

    // Users
    const users = await req.db.userCollections.find().toArray();
    const totalUsers = users.filter((user) => user.role === "user").length;
    const totalSellers = users.filter((user) => user.role === "seller").length;

    const medicines = await req.db.medicineCollections.find().toArray();
    const totalMedicines = medicines.length;

    res.send({
      totalOrders,
      totalPaidAmount,
      totalPendingAmount,
      totalEarnings,
      totalMedicines,
      totalUsers,
      totalSellers,
    });
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    res.status(500).send({ message: "Server Error" });
  }
};


module.exports = {
  getAdminDashboardStats
};
