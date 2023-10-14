const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

var userSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: [2, "min length is 2"],
  },
  lastName: {
    type: String,
    required: false,
    minlength: [2, "min length is 2"],
  },
  userName: {
    type: String,
    required: false,
    unique: true,
    minlength: [5, "min length is 5"],
  },
  email: {
    type: String,
    required: true,
    unique: true,
    minlength: [8, "min length is 8"],
  },
  password: {
    type: String,
    required: true,
    minlength: [6, "min length is 6"],
  },
  role: {
    type: String,
    default: "user",
  },
  address: {
    type: String,
    required: true,
  },
  refreshToken: {
    type: String,
    default: "",
  },
});

var User_model = mongoose.model("user", userSchema);

module.exports = User_model;
