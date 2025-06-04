const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({
  description: {
    type: String,
    required: [true, 'Please add a description'],
    trim: true
  },
  amount: {
    type: Number,
    required: [true, 'Please add an amount'],
    min: [0, 'Amount cannot be negative']
  },
  paidBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  splitBetween: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    share: {
      type: Number,
      required: true,
      default: 0
    }
  }],
  groupId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Group',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Calculate shares before saving
expenseSchema.pre('save', function(next) {
  const totalMembers = this.splitBetween.length;
  const sharePerPerson = this.amount / totalMembers;
  
  this.splitBetween.forEach(split => {
    split.share = sharePerPerson;
  });
  
  next();
});

// Populate references when querying
expenseSchema.pre(/^find/, function(next) {
  this.populate({
    path: 'paidBy',
    select: 'name email'
  }).populate({
    path: 'splitBetween.user',
    select: 'name email'
  });
  next();
});

module.exports = mongoose.model('Expense', expenseSchema);