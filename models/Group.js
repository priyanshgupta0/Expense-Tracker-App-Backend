const mongoose = require('mongoose');

const groupSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a group name'],
    trim: true
  },
  members: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }],
  expenses: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Expense'
  }],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Middleware to populate members and expenses when querying
groupSchema.pre(/^find/, function(next) {
  this.populate({
    path: 'members',
    select: 'name email'
  }).populate({
    path: 'expenses',
    select: 'description amount paidBy splitBetween createdAt'
  });
  next();
});

module.exports = mongoose.model('Group', groupSchema);