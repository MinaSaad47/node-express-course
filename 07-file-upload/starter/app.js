require("dotenv").config();
require("express-async-errors");

const express = require("express");
const fileUpload = require("express-fileupload");
const app = express();

// database
const connectDB = require("./db/connect");

// error handler
const notFoundMiddleware = require("./middleware/not-found");
const errorHandlerMiddleware = require("./middleware/error-handler");

app.use(express.static("public"));

// routes
const productRoutes = require("./routes/productRoutes");

app.use(express.json());
app.use(fileUpload());
app.use("/api/v1/products", productRoutes);

app.get("/", (req, res) => {
  res.send("<h1>File Upload Starter</h1>");
});

// middleware
app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 200;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URL);

    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();
