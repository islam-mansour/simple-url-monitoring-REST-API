const mongoose = require("mongoose");

const hashesSchema = new mongoose.Schema({
  email: { type: String, unique: true },
  hash: {type: String}
});

module.exports = mongoose.model("Hashes", hashesSchema);