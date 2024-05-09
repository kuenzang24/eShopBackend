const Product = require("./../models/productModel");
const Category = require("./../models/categoryModel");
const mongoose = require("mongoose");
const multer = require("multer");

const multerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/uploads");
  },
  filename: (req, file, cb) => {
    const fileName = file.originalname.split(" ").join("-");
    const ext = file.mimetype.split("/")[1];
    cb(null, `${fileName}-${Date.now()}.${ext}`);
  },
});

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new Error("Not an image! Please upload only images"), false);
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

exports.uploadProductPhoto = upload.single("image");
exports.uploadProductPhotos = upload.array("images", 10); 

exports.createProduct = async (req, res, next) => {
  try {
    const category = await Category.findById(req.body.category);
    if (!category) {
      return res
        .status(400)
        .json({ status: "Invalid", message: "Invalid Category" });
    }

    // Image
    const file = req.file;
    if (!file) {
      return res
        .status(400)
        .json({ status: "Invalid", message: "No Image in the request" });
    }
    const fileName = req.file.filename;
    const basePath = `${req.protocol}://${req.get("host")}/public/uploads/`;

    const product = await Product.create({
      name: req.body.name,
      description: req.body.description,
      richDescription: req.body.richDescription,
      image: `${basePath}${fileName}`,
      brand: req.body.brand,
      price: req.body.price,
      category: req.body.category,
      countInStock: req.body.countInStock,
      rating: req.body.rating,
      numReviews: req.body.numReviews,
      isFeatured: req.body.isFeatured,
    });

    res.status(201).json({
      status: "success",
      data: {
        product,
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getAllProduct = async (req, res, next) => {
  try {
    let filter = {};
    if (req.query.categories) {
      filter = { category: req.query.categories.split(",") };
    }
    const productList = await Product.find(filter).populate("category");
    // const productList = await Product.find().populate("category");
    // const productList = await Product.find();

    res.status(201).json({
      status: "success",
      data: productList,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.productId).populate(
      "category"
    );
    res.status(201).json({
      status: "success",
      data: {
        product,
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateProduct = async (req, res, next) => {
  try {
    const category = await Category.findById(req.body.category);
    if (!category) {
      return res
        .status(400)
        .json({ status: "Invalid", message: "Invalid Category" });
    }

    // Image
    const product = await Product.findById(req.params.productId);
    if (!product) {
      return res
        .status(400)
        .json({ status: "Invalid", message: "Invalid Product" });
    }
    const file = req.file;
    let imagepath;
    if (file) {
      const fileName = req.file.filename;
      const basePath = `${req.protocol}://${req.get("host")}/public/uploads/`;
      imagepath = `${basePath}${fileName}`;
    } else {
      imagepath = product.image;
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.productId,
      {
        name: req.body.name,
        description: req.body.description,
        richDescription: req.body.richDescription,
        image: imagepath,
        brand: req.body.brand,
        price: req.body.price,
        category: req.body.category,
        countInStock: req.body.countInStock,
        rating: req.body.rating,
        numReviews: req.body.numReviews,
        isFeatured: req.body.isFeatured,
      },
      { new: true }
    );
    res.status(201).json({
      status: "success",
      data: {
        updatedProduct,
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteProduct = async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.productId)) {
      res.status(400).json({ message: "Invalid Product Id" });
    }
    const product = await Product.findByIdAndDelete(req.params.productId);
    res.status(201).json({
      status: "success",
      message: "Product Deleted",
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getProductCount = async (req, res, next) => {
  try {
    const productCount = await Product.countDocuments();
    // const productCount = await Product.countDocuments((count) => count)

    console.log(productCount);

    if (!productCount) {
      return res.status(500).json({ success: false });
    }

    res.status(201).json({
      status: "success",
      count: {
        productCount,
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getFeatured = async (req, res, next) => {
  try {
    const count = req.params.count ? req.params.count : 0;
    const products = await Product.find({ isFeatured: true }).limit(count);
    if (!products) {
      res.status(500).json({ success: false });
    }
    res.status(201).json({
      status: "success",
      products: {
        products,
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateGalleryProduct = async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.productId)) {
      res.status(400).json({ message: "Invalid Product Id" });
    }
    const files = req.files;
    let imagePaths = [];
    const basePath = `${req.protocol}://${req.get("host")}/public/uploads/`;
    if (files) {
      files.map((file) => {
        imagePaths.push(`${basePath}${file.filename}`);
      });
    }
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.productId,
      {
        images: imagePaths,
      },
      { new: true }
    );
    res.status(201).json({
      status: "success",
      data: {
        updatedProduct,
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
