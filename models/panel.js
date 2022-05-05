const mongoose = require("mongoose");
const schema = new mongoose.Schema({
  version: {
    type: String,
    required: true,
    unique: true
  },
  description: {
    type: String,
    required: true
  },
  active: {
    type: Boolean,
    required: true,
    default: true
  }
}, {timestamps: true});

module.exports = mongoose.model("Panels", schema);
