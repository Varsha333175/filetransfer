const mongoose = require('mongoose');

const TrashSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  path: {
    type: String,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  isPublic: {
    type: Boolean,
    default: false,
  },
  data: {
    type: Buffer,
  },
  deletedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Trash', TrashSchema);
