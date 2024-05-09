const Order = require("./../models/orderModel");
const OrderItem = require("../models/orderItemModel");

exports.createOrder = async (req, res, next) => {
  try {
    console.log("inside")
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
    let order = new Order({
      orderItems: orderItemsIdsResolved,
      shippingAddress1: req.body.shippingAddress1,
      shippingAddress2: req.body.shippingAddress2,
      city: req.body.city,
      zip: req.body.zip,
      country: req.body.country,
      phone: req.body.phone,
      status: req.body.status,
      totalPrice: req.body.totalPrice,
      user: req.body.user,
    });

    order = await order.save();
    res.status(201).json({
      status: "success",
      data: {
        order,
      },
    });

    res.send("hello")
  } catch (err) {
    console.log("here too")
    res.status(500).json({ error: err.message });
  }
};
