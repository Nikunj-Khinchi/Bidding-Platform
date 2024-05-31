const express = require("express");
const bodyParser = require("body-parser");
const userRoutes = require("./routes/userRoutes");
const itemRoutes = require("./routes/itemRoutes");
const bidRoutes = require("./routes/bidRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const errorMiddleware = require("./middleware/errorMiddleware");
const logger = require("./utils/logger");

const app = express();

app.use(logger);

app.use(bodyParser.json());

app.use("/users", userRoutes);
app.use("/items", itemRoutes);
app.use("/bids", bidRoutes);
app.use("/notifications", notificationRoutes);

app.use(errorMiddleware);


console.log(new Date());

module.exports = app;
