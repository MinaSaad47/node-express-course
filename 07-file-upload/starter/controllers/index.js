module.exports = {
  products: {
    ...require("./productController"),
    uploads: require("./uploadsController"),
  },
};
