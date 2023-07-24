const express = require("express");
const connectDb = require("./db/connect");
const dotenv = require("dotenv");

const routes = {
  tasks: require("./routes/tasks"),
};

let middlewares = {
  notFound: require("./middlewares/not-found"),
};

const app = express();

// setup global middileware
app.use(express.static("./public"));
app.use(express.json());

// setup routes
app.use("/api/v1/tasks", routes.tasks);

// global middlewares
app.use("/api/v1/*", middlewares.notFound);

// configurations
dotenv.config();
const config = {
  mongoUrl: process.env.MONGO_URL,
  port: Number(process.env.PORT || 2000),
};

(async () => {
  try {
    console.log("[INFO] configurations: ", config);
    await connectDb(config.mongoUrl);
    console.log("[INFO] connected to database");
    app.listen(config.port, () =>
      console.log(`[INFO] listening on port ${config.port} `)
    );
  } catch (error) {
    console.error(`[ERROR] ${error} `);
  }
})();
