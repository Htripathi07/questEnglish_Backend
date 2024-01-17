const { LogModel } = require("../models/log.model");

const logger = async (req, res, next) => {
  const currentTime = Date.now();

  next();
  const endTime = Date.now();
  const responseTime = endTime - currentTime;
  const method = req.method;
  const url = req.url;

  await LogModel.create({
    method,
    responseTime,

    url,
    currentTime,
  });
};

module.exports = { logger };
