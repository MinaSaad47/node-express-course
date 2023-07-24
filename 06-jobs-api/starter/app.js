require("dotenv").config();
require("express-async-errors");
const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const rateLimiter = require("express-rate-limit");
const xss = require("xss-clean");

const connectDb = require("./db/connect");

const routes = {
  auth: require("./routes/auth"),
  jobs: require("./routes/jobs"),
};

const app = express();

// error handler
const notFoundMiddleware = require("./middleware/not-found");
const errorHandlerMiddleware = require("./middleware/error-handler");
const loggerMiddleware = require("./middleware/logger");

app.use(rateLimiter({ windowMs: 15 * 60 * 1000, max: 100 }));
app.use(express.json());
// extra packages
app.use(cors());
app.use(xss());
app.use(helmet());

// routes
app.get("/", (_req, res) => {
  res.send("jobs api");
});

app.use(loggerMiddleware);

app.use("/api/v1/auth", routes.auth);
app.use("/api/v1/jobs", routes.jobs);

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 3000;

const start = async () => {
  try {
    connectDb(process.env.MONGO_URL);
    console.log("[INFO] connected to mongo");
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();
