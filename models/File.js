const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const FileSchema = new Schema(
  {
    name: { type: String, required: true },
    path: { type: String },
    owner: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    isPublic: { type: Boolean, default: false },
    data: { type: Buffer },
    sharedWith: [
      {
        user: { type: Schema.Types.ObjectId, ref: 'User' },
        canEdit: { type: Boolean, default: false },
      },
    ],
    deleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model('File', FileSchema);
