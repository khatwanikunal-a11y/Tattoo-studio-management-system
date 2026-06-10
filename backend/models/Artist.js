const mongoose = require('mongoose');

const artistSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: [100, 'Name must be 100 characters or fewer']
  },
  speciality: {
    type: String,
    required: [true, 'Speciality is required'],
    trim: true,
    maxlength: [100, 'Speciality must be 100 characters or fewer']
  },
  bio: {
    type: String,
    maxlength: [500, 'Bio must be 500 characters or fewer'],
    default: null
  },
  years_exp: {
    type: Number,
    required: [true, 'Years of experience is required'],
    min: [0, 'Years of experience must be at least 0'],
    max: [60, 'Years of experience must be 60 or fewer'],
    validate: {
      validator: Number.isInteger,
      message: 'Years of experience must be an integer'
    }
  }
}, { timestamps: true });

module.exports = mongoose.model('Artist', artistSchema);
