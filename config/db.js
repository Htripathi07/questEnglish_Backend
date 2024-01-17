const mongoose = require("mongoose");
require("dotenv").config();
const url = process.env.MONGO_URI;

const connection = mongoose.connect(url);

module.exports = connection;
