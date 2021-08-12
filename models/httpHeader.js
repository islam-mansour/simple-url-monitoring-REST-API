const mongoose = require("mongoose");

const httpHeaderSchema = new mongoose.Schema({
  key: { type: String, unique: true },
  value: {type: String},
});

module.exports = mongoose.model("httpHeader", httpHeaderSchema);