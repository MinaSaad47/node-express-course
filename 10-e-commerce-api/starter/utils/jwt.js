const jwt = require("jsonwebtoken");

module.exports.sign = async ({ payload }) =>
  jwt.sign(payload, process.env.CONFIG_JWT_SECRET, {
    expiresIn: process.env.CONFIG_JWT_LIFETIME,
  });

module.exports.verify = async ({ token }) =>
  jwt.verify(token, process.env.CONFIG_JWT_SECRET);

module.exports.attachCookiesToResponse = async (res, user) => {
  const token = await module.exports.sign({ payload: user });

  res.cookie("token", token, {
    httpOnly: true,
    expires: new Date(Date.now() + 1000 * 60 * 60 * 24),
    secure: process.env.CONFIG_NODE_ENV === "producttion",
    signed: true,
  });
};
