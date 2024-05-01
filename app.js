const express = require("express");
const categoryRouter = require("./routes/categoryRoutes");
const productRouter = require("./routes/productRoutes");
const userRouter = require("./routes/userRoutes");
const errorHandler = require("./helpers/error-handler");
const authJwt = require("./helpers/jwt");
const api = process.env.API_URL;
const app = express();

console.log(api);

app.use(express.json());
app.use(authJwt());
app.use(errorHandler);

// Route
app.use(`${api}/user`, userRouter);
app.use(`${api}/category`, categoryRouter);
app.use(`${api}/product`, productRouter);

module.exports = app;
