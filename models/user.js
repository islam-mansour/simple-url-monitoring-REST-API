const mongoose = require("mongoose");



const userSchema = new mongoose.Schema({
  first_name: { type: String, required: true },
  last_name: { type: String, required: true },
  email: { type: String, unique: true },
  password: { type: String, required: true},
  token: { type: String },
  verified: {type: Boolean, default: false},
  checks: [{ type: mongoose.Types.ObjectId, ref: 'Check' }],
});


module.exports = mongoose.model("User", userSchema);