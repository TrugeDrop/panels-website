const mongoose = require("mongoose");
const schema = new mongoose.Schema({
  pluginurl: {
    type: String,
    required: true,
    unique: true
  }
}, { timestamps: true });

module.exports = mongoose.model("Plugin Suggestion", schema);