const app = require("./app");
require("dotenv").config({ path: "./config.env" });
require("./utils/databases/mongodb");

const server = app.listen(process.env.PORT, () => {
  console.log("server running on http://localhost:" + process.env.PORT);
});

process.on("unhandledRejection", (error) => {
  console.log(`${error.name}: ${error.message}`);
  server.close(() => {
    process.exit(1);
  });
});

process.on("uncaughtException", (error) => {
  console.log(`${error.name}: ${error.message}`);
  process.exit(1);
});
