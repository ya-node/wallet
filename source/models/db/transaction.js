const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Transaction = mongoose.model('Transaction', {
  cardId: Number,
  type: String,
  data: Schema.Types.Mixed,
  time: {
    type: Date,
    default: Date.now
  },
  sum: String,
  id: {
    type: Number,
    required: true
  }
});

module.exports = Transaction;
