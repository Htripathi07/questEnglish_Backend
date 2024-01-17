const mongoose = require("mongoose");

// name, age, email, city, phone_no, password,
const logSchema = mongoose.Schema({
  method: { type: String },
  url: { type: String },
  currentTime: { type: Number },
  responseTime: { type: Number },
});

const LogModel = mongoose.model("log", logSchema);

module.exports = { LogModel };
