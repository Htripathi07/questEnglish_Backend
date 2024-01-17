const express = require("express");
const bcrypt = require("bcrypt");
const UserModel = require("../models/user.models");
const jwt = require("jsonwebtoken");
const { authenticate } = require("../middlewares/authenticate");
const { checkUser } = require("../middlewares/user/checkUser");

const userRouter = express.Router();

userRouter.get("/", authenticate, async (req, res) => {
  const userId = req.userId;
  try {
    const user = await UserModel.findOne({ _id: userId });
    res.send(user);
  } catch (error) {
    console.log(error);
    res.status(400).send({ msg: "error loading user" });
  }
});

userRouter.post("/signup", checkUser, (req, res) => {
  const { name, email, password, roles } = req.body;
  bcrypt.hash(password, 10, async function (err, hash) {
    if (err) {
      res.status(400).send("bad request");
    }
    try {
      await UserModel.create({ name, email, password: hash, roles });
      res.status(200).send({ msg: "User Created" });
    } catch (error) {
      console.log(error);
      res.status(400).send({ msg: "Error Creating User" });
    }
  });
});
userRouter.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await UserModel.findOne({ email });
  if (user) {
    bcrypt.compare(password, user.password, function (err, result) {
      if (err) {
        res.status(400).send("bad request");
      } else {
        const token = jwt.sign(
          { userId: user._id, userRoles: user.roles },
          "secretkey"
        );
        console.log(token);
        res.send({ msg: "login successful", token: token });
      }
    });
  } else {
    res.status(401).send({ msg: "user not found" });
  }
});

module.exports = userRouter;
