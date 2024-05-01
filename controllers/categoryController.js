const Category = require("./../models/categoryModel");

exports.createCategory = async (req, res, next) => {
  try {
    const category = await Category.create(req.body);
    res.status(201).json({
      status: "success",
      data: {
        category,
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteCategory = async (req, res, next) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.categoryId);
    res.status(201).json({
      status: "success",
      data: {
        category,
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getAllCategory = async (req, res, next) => {
  try {
    const categoryList = await Category.find();
    res.status(201).json({
      status: "success",
      data: categoryList,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getCategory = async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.categoryId);
    res.status(201).json({
      status: "success",
      data: category,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateCategory = async (req, res, next) => {
  try {
    const category = await Category.findByIdAndUpdate(
      req.params.categoryId,
      req.body,
      { new: true }
    );
    res.status(201).json({
      status: "success",
      data: {
        category,
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
