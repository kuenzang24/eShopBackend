const Order = require("./../models/orderModel");
const OrderItem = require("../models/orderItemModel");

exports.createOrder = async (req, res, next) => {
  try {
    console.log("inside");
    const orderItemsIds = Promise.all(
      req.body.orderItems.map(async (orderItem) => {
        let newOrderItem = new OrderItem({
          quantity: orderItem.quantity,
          product: orderItem.product,
        });
        newOrderItem = await newOrderItem.save();
        return newOrderItem._id;
      })
    );

    const orderItemsIdsResolved = await orderItemsIds;

    // Calculating the total price
    const totalPrices = await Promise.all(
      orderItemsIdsResolved.map(async (orderItemId) => {
        const orderItem = await OrderItem.findById(orderItemId).populate(
          "product",
          "price"
        );
        const totalPrice = orderItem.product.price * orderItem.quantity;
        return totalPrice;
      })
    );
    const totalPrice = totalPrices.reduceRight((a, b) => a + b, 0);

    let order = new Order({
      orderItems: orderItemsIdsResolved,
      shippingAddress1: req.body.shippingAddress1,
      shippingAddress2: req.body.shippingAddress2,
      city: req.body.city,
      zip: req.body.zip,
      country: req.body.country,
      phone: req.body.phone,
      status: req.body.status,
      totalPrice: totalPrice,
      user: req.body.user,
    });

    order = await order.save();
    res.status(201).json({
      status: "success",
      data: {
        order,
      },
    });

    res.send("hello");
  } catch (err) {
    console.log("here too");
    res.status(500).json({ error: err.message });
  }
};

exports.getAllOrder = async (req, res, next) => {
  try {
    const orderList = await Order.find()
      .populate("user", "name")
      .sort({ dateOrdered: -1 });
    res.status(201).json({
      status: "success",
      data: {
        orderList,
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.orderId)
      .populate("user", "name")
      .populate({
        path: "orderItems",
        populate: { path: "product", populate: "category" },
      });

    // .populate('orderItems')
    res.status(201).json({
      status: "success",
      data: {
        order,
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateOrder = async (req, res, next) => {
  try {
    const order = await Order.findByIdAndUpdate(
      req.params.orderId,
      { status: req.body.status },
      { new: true }
    );
    res.status(201).json({
      status: "success",
      data: {
        order,
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteOrder = async (req, res, next) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.orderId);
    if (order) {
      await order.orderItems.map(async (orderItem) => {
        await OrderItem.findByIdAndDelete(orderItem);
      });
      return res.status(201).json({
        status: "success",
        data: {
          order,
        },
      });
    } else {
      return res.status(404).json({
        status: "false",
        message: "Order not found",
      });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.totalSales = async (req, res, next) => {
  try {
    const totalSales = await Order.aggregate([
      { $group: { _id: null, totalsales: { $sum: "$totalPrice" } } },
    ]);
    if (!totalSales) {
      return res.status(400).send("The order sales cannot be generated");
    }
    res.status(201).json({
      status: "success",
      data: {
        totalSales,
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.orderCount = async (req, res, next) => {
  try {
    const orderCount = await Order.countDocuments();
    if (!orderCount) {
      res.status(500).json({ success: false });
    }
    res.status(201).json({
      status: "success",
      count: {
        orderCount,
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.userOrders = async (req, res, next) => {
  try {
    const userOrderList = await Order.find({
      user: req.params.userId,
    }).populate({
      path: "orderItems",
      populate: { path: "product", populate: "category" },
    });
    res.status(201).json({
      status: "success",
      data: {
        userOrderList,
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
