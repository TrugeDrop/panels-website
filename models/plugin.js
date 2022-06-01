const mongoose = require("mongoose");
const schema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  description: {
    type: String,
    required: true
  },
  page: {
    type: String,
    required: true,
    unique: true
  },
  versions: {
    type: Array,
    required: true
  },
  active: {
    type: Boolean,
    required: true
  }
});

module.exports = mongoose.model("Plugin", schema);
