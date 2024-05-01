const express = require("express");
const router = express.Router();
const categoryController = require("../controllers/categoryController");

router.post("/", categoryController.createCategory);
router.delete("/:categoryId", categoryController.deleteCategory);
router.get("/", categoryController.getAllCategory);
router.get("/:categoryId", categoryController.getCategory);
router.put("/:categoryId", categoryController.updateCategory);

module.exports = router;