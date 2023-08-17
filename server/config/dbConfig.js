const mongoose = require("mongoose");

const endpoint = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/todolist";

mongoose
  .connect(endpoint)
  .then((db) => console.log("DB connected: ", db.connection.name))
  .catch((e) => console.error(e));
