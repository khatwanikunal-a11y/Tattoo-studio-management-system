const mongoose = require('mongoose');

const designSchema = new mongoose.Schema({
  artist_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Artist',
    required: [true, 'Artist ID is required']
  },
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    maxlength: [150, 'Title must be 150 characters or fewer']
  },
  style: {
    type: String,
    required: [true, 'Style is required'],
    trim: true,
    maxlength: [100, 'Style must be 100 characters or fewer']
  },
  description: {
    type: String,
    maxlength: [500, 'Description must be 500 characters or fewer'],
    default: null
  },
  size: {
    type: String,
    required: [true, 'Size is required'],
    enum: {
      values: ['small', 'medium', 'large'],
      message: 'Size must be one of: small, medium, large'
    }
  }
}, { timestamps: true });

module.exports = mongoose.model('Design', designSchema);
