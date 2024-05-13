const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const CustomError = require("./utils/classes/custom-error");
const authRoutes = require("./routes/authentication-routes");
const userRoutes = require("./routes/user-routes");
const taskRoutes = require("./routes/task-routes");
const stickyRoutes = require("./routes/sticky-routes");

const app = express();

app.use(express.json());
app.use(morgan("dev"));
app.use(
  cors({
    origin: "http://localhost:4200",
    methods: "GET, POST, PUT, PATCH, DELETE",
  })
);

app.use("/authentication", authRoutes);
app.use("/user", userRoutes);
app.use("/task", taskRoutes);
app.use("/sticky-wall", stickyRoutes);

app.all("*", (req, res, next) => {
  next(new CustomError(404, "Page not found."));
});

app.use((error, req, res, next) => {
  if (error.code === 11000) {
    res.status(400).json({
      status: "failure",
      message: "Email already exists.",
    });
    return;
  }

  res.status(error.status || 500).json({
    status: "failure",
    message: error.message,
  });
});

module.exports = app;
