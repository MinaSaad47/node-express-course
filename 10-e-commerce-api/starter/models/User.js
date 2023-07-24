const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

const schema = mongoose.Schema({
  name: {
    type: String,
    required: [true, "name must be provided"],
    minlength: 3,
    maxlength: 50,
  },
  email: {
    type: String,
    required: [true, "email must be provided"],
    unique: true,
    validate: {
      validator: validator.isEmail,
      message: "a valid email must be provided",
    },
  },
  password: {
    type: String,
    required: [true, "password must be provided"],
    minlength: 6,
  },
  role: {
    type: String,
    enum: ["admin", "user"],
    default: "user",
  },
});

schema.pre("save", async function () {
  if (!this.isModified("password")) return;
  const salt = await bcrypt.genSalt();
  this.password = await bcrypt.hash(this.password, salt);
});

schema.methods.comparePassword = async function (candidatePassowrd) {
  return await bcrypt.compare(candidatePassowrd, this.password);
};

module.exports = mongoose.model("User", schema);
