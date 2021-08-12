const mongoose = require("mongoose");
const report = require("./report");

const Status = Object.freeze({
  WORKING: 'working',
  PAUSED: 'paused',
  DELETED: 'deleted',
});

const checkSchema = new mongoose.Schema({
    status: { type: String, enum: Object.values(Status), default: Status.WORKING },
    name: { type: String },
    url: { type: String, unique: true },
    protocal: { type: String, default: 'http' },
    path: { type: String, default: '/' },
    port: { type: Number, default: null },
    webhook: { type: String, default: null },
    timeout: { type: Number, default: 5 },
    interval: { type: Number, default: 10 },
    threshold: { type: Number, default: 1 },
    failedRequests: { type: Number, defualt: 0, immutable: true }, // number of contiguous failed requests to the url
    auth: { type: mongoose.Types.ObjectId, ref: 'Auth'},
    httpHeaders: [{ type: mongoose.Types.ObjectId, ref: 'httpHeader' }],
    report: { type: mongoose.Types.ObjectId, ref: 'Report' }
});

Object.assign(checkSchema.statics, {
    Status,
});

checkSchema.pre('deleteOne', function(next){
    const id = this.getQuery()['_id'];
    report.deleteOne({_id: this.report._id});
    next();
});

module.exports = mongoose.model("Check", checkSchema);