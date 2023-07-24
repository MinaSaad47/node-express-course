module.exports = (req, res, next) => {
  let date = new Date();
  date = date.toUTCString();
  const message = {
    url: req.url,
    method: req.method,
    body: req.body,
  };
  console.log("[INFO] ", date, " request ", message);
  next();
};
