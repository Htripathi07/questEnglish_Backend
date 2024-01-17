const UserModel = require("../../models/user.models");

const checkUser = async (req, res, next) => {
  const { email, password } = req.body;
  const user = await UserModel.findOne({ email });
  if (user) {
    res.status(400).send({ msg: "user already exist" });
  } else {
    next();
  }
};
module.exports = { checkUser };
