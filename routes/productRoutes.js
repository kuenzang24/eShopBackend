const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");

router.get("/count", productController.getProductCount);
router.get("/featured/:count", productController.getFeatured);
router.post("/", productController.createProduct);
router.get("/", productController.getAllProduct);
router.get("/:productId", productController.getProduct);

router.put("/:productId", productController.updateProduct);
router.delete("/:productId", productController.deleteProduct);

module.exports = router;