const express = require("express");
const orderRouter = require("./routes/orderRoute");
const categoryRouter = require("./routes/categoryRoutes");
const productRouter = require("./routes/productRoutes");
const userRouter = require("./routes/userRoutes");
const errorHandler = require("./helpers/error-handler");
const authJwt = require("./helpers/jwt");
const api = process.env.API_URL;
const app = express();

app.use(express.json());
app.use(authJwt());
app.use(errorHandler);

// Route
app.use(`${api}/order`, orderRouter);
app.use(`${api}/user`, userRouter);
app.use(`${api}/category`, categoryRouter);
app.use(`${api}/product`, productRouter);

module.exports = app;