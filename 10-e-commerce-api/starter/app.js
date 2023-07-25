const dotenv = require("dotenv");
const express = require("express");
require("express-async-errors");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const fileUploads = require("express-fileupload");

const connectDb = require("./db/connect");
const middleware = require("./middleware");
const routes = require("./routes");

dotenv.config();

const app = express();

app.use(morgan("dev"));
app.use(cookieParser(process.env.CONFIG_JWT_SECRET));
app.use(express.json());
app.use(express.static("./public"));
app.use(fileUploads());

app.use("/api/v1/auth", routes.auth);
app.use("/api/v1/users", routes.users);
app.use("/api/v1/products", routes.products);
app.use("/api/v1/reviews", routes.reviews);
app.use("/api/v1/orders", routes.orders);

// dummy route
app.use("/api/v1", async (req, res) => {
  const object = {
    body: req.body,
    cookies: req.signedCookies,
  };
  res.json(object);
});

app.use(middleware.notFound);
app.use(middleware.errorHandler);

(async () => {
  try {
    await connectDb(process.env.CONFIG_MONGO_URL);
    app.listen(process.env.CONFIG_PORT, () =>
      console.log(`listening on port ${process.env.CONFIG_PORT} ...`)
    );
  } catch (error) {
    console.error(`[ERROR] ${error}`);
  }
})();
