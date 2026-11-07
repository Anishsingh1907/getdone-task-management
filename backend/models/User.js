const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      default: 'password123',
    },
    role: {
      type: String,
      required: true,
      enum: ['Owner', 'Admin', 'HR', 'Employee'],
      default: 'Employee',
    },
    title: {
      type: String,
      default: 'Team Member',
    },
    avatar: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('User', UserSchema);

