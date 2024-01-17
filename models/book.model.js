const mongoose = require("mongoose");

const bookSchema = mongoose.Schema(
  {
    title: { type: String, required: true },
    author: { type: String, required: true },
    publishedDate: { type: Date, required: true },
    ISBN: { type: String, required: true },
    price: { type: Number, required: true },
    userId: { type: String, required: true },
  },
  { timestamps: true }
);

const BookModel = mongoose.model("book", bookSchema);

module.exports = BookModel;
