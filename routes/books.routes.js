const express = require("express");
const UserModel = require("../models/user.models");
const jwt = require("jsonwebtoken");
const { authenticate } = require("../middlewares/authenticate");
const BookModel = require("../models/book.model");

const bookRouter = express.Router();

const checkSort = async (req, res, next) => {
  const { sort, order } = req.query;

  if (sort) {
    if (order === "desc") {
      req.sortedData = req.filteredData.sort((a, b) => b.price - a.price);
    } else {
      req.sortedData = req.filteredData.sort((a, b) => a.price - b.price);
    }
  } else {
    req.sortedData = req.filteredData;
  }
  next();
};
const checkFilter = async (req, res, next) => {
  let queryObj = {};
  const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000);

  if (req.query.old === "1") {
    // console.log("old");
    queryObj.createdAt = { $lt: tenMinutesAgo };
  }
  if (req.query.new === "1") {
    // console.log("new");
    queryObj.createdAt = { $gte: tenMinutesAgo, $lt: new Date() };
  }
  if (!req.userRoles.includes("VIEW_ALL")) {
    queryObj = { ...queryObj, userId: req.userId };
  }
  try {
    req.filteredData = await BookModel.find(queryObj);
    next();
  } catch (error) {
    res.status(500).send({ msg: "internal server error" });
  }
};
bookRouter.get("/", authenticate, checkFilter, checkSort, async (req, res) => {
  const userId = req.userId;
  try {
    // const employees = await BookModel.find({ userId });
    res.send(req.sortedData);
  } catch (err) {
    res.status(400).send({ msg: "bad request" });
  }
});
bookRouter.post("/", authenticate, async (req, res) => {
  const { title, author, publishedDate, ISBN, price } = req.body;
  if (!req.userRoles.includes("CREATOR")) {
    return res.send({ msg: "You are not authorized to create a book" });
  }
  try {
    const book = await BookModel.create({
      title,
      author,
      publishedDate,
      ISBN,
      price,
      userId: req.userId,
    });

    res.send({ msg: "book created", book });
  } catch (err) {
    console.log(err);
    res.status(400).send("check whether u added all fields");
  }
});
bookRouter.patch("/update", authenticate, async (req, res) => {
  const { bookId, payload } = req.body;

  if (!req.userRoles.includes("CREATOR")) {
    return res.send({ msg: "You are not authorized to create a book" });
  }
  try {
    await BookModel.findByIdAndUpdate(
      {
        _id: bookId,
      },
      { ...payload }
    );

    res.send({ msg: "book updated" });
  } catch (error) {
    res.status(500).send({ msg: "internal server error" });
    console.log(error);
  }
});
bookRouter.delete("/delete/:bookId", authenticate, async (req, res) => {
  const { bookId } = req.params;
  if (!req.userRoles.includes("CREATOR")) {
    return res.send({ msg: "You are not authorized to create a book" });
  }
  try {
    await BookModel.findByIdAndDelete({
      _id: bookId,
    });

    res.send({ msg: "book deleted" });
  } catch (error) {
    res.status(500).send({ msg: "internal server error" });
    console.log(error);
  }
});

module.exports = bookRouter;
