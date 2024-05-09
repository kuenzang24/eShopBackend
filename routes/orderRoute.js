const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController");

router.get("/totalsales", orderController.totalSales);
router.get("/count", orderController.orderCount);
router.get("/userorders/:userId", orderController.userOrders);
router.get("/:orderId", orderController.getOrder);
router.post("/", orderController.createOrder);
router.get("/", orderController.getAllOrder);
router.put("/:orderId", orderController.updateOrder);
router.delete("/:orderId", orderController.deleteOrder);

module.exports = router;