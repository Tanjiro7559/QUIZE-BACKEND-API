const mongoose = require('mongoose');
const questionSchema = require('./Question');

const testSchema = new mongoose.Schema({
  title: { type: String, required: true },
  subject: { type: String, required: true },
  questions: [questionSchema],
  startTime: { type: Date, required: true },
  duration: { type: Number, required: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  approvedByAdmin: { type: Boolean, default: false },
  approvedAt: { type: Date },
});

const Test = mongoose.model('Test', testSchema);
module.exports = Test;
