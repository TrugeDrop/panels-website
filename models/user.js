const mongoose = require("mongoose");
const schema = mongoose.Schema({
  username: {
    type: String,
    required: true,
    unqiue: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  active: {
    type: Boolean,
    required: true,
    default: true
  },
  auth: {
    type: Array,
    required: true,
    default: "customer"
  },
  subscription: {
    type: String,
    required: true,
    default: "none"
  }
}, { timestamps: true });

module.exports = mongoose.model("Users", schema);
