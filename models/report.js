const mongoose = require("mongoose");
const Check = require("./check");
const Log = require('./log');

const reportSchema = new mongoose.Schema({
  status: { type: Boolean },
  availability: { type: Number, default: 0 },
  outages: { type: Number, default: 0 },
  downtime: { type: Number, default: 0 },
  uptime: { type: Number, default: 0 },
  responseTime: { type: Number, default: 0 },
  history: [{ type: mongoose.Types.ObjectId, ref: 'log' }]
});

module.exports = mongoose.model("Report", reportSchema);