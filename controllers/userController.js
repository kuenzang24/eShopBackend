const User = require("./../models/userModel");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

const signToken = (id, isAdmin) => {
  return jwt.sign({ id, isAdmin }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id, user.isAdmin);
  res.status(statusCode).json({
    status: "success",
    token,
    data: user,
    // data: {
    // user: user.email,
    // },
  });
};

exports.registerUser = async (req, res, next) => {
  try {
    let user = new User({
      name: req.body.name,
      email: req.body.email,
      passwordHash: req.body.password,
      phone: req.body.phone,
      isAdmin: req.body.isAdmin,
      street: req.body.street,
      apartment: req.body.apartment,
      zip: req.body.zip,
      city: req.body.city,
      country: req.body.country,
    });
    user = await user.save();
    res.status(201).json({
      status: "success",
      data: user,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getAllUser = async (req, res, next) => {
  try {
    const userList = await User.find().select("-passwordHash");
    res.status(201).json({
      status: "success",
      data: {
        userList,
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.userId.trim()).select(
      "-passwordHash"
    );
    res.status(201).json({
      status: "success",
      data: user,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    // 1) Check if email and password exist
    if (!email || !password) {
      return res.status(400).send("Please provide an email and password!");
    }

    const user = await User.findOne({ email }).select("+passwordHash");
    if (!user || !(await user.correctPassword(password, user.passwordHash))) {
      console.log(typeof user.passwordHash);
      return res.status(400).send("Incorrect email or password");
    }

    createSendToken(user, 200, res);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getUserCount = async (req, res, next) => {
  try {
    const userCount = await User.countDocuments();
    // const UserCount = await User.countDocuments((count) => count)
    if (!userCount) {
      res.status(500).json({ success: false });
    }
    res.status(201).json({
      status: "success",
      count: {
        userCount,
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteUser = async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.userId)) {
      res.status(400).json({ message: "Invalid User Id" });
    }
    const user = await User.findByIdAndDelete(req.params.userId);
    res.status(201).json({
      status: "success",
      message: "User Deleted",
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};