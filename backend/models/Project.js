const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    desc: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      required: true,
      enum: ['pending', 'ongoing', 'yetToFinal', 'complete'],
      default: 'pending',
    },
    tag: {
      type: String,
      default: 'UI Design',
    },
    taskType: {
      type: String,
      enum: ['Project', 'Meeting', 'Alpha Team', 'Daily Routine', 'Sprint'],
      default: 'Project',
    },
    assignees: [
      {
        type: String,
        default: [],
      },
    ],
    createdBy: {
      type: String,
      default: 'user_1',
    },
    dueDate: {
      type: String,
      default: '',
    },
    estimatedHours: {
      type: Number,
      default: 5.0,
    },
    commentsCount: {
      type: Number,
      default: 0,
    },
    attachmentsCount: {
      type: Number,
      default: 0,
    },
    location: {
      type: String,
      default: 'Main Office',
    },
    deleted: {
      type: Boolean,
      default: false,
    },
    deletedAt: {
      type: Date,
      default: null,
    },
    deletedBy: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Project', ProjectSchema);

