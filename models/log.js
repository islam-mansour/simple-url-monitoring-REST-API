const mongoose = require("mongoose");

const logSchema = new mongoose.Schema({
  text: { type: String },
  at: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Log", logSchema);