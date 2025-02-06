const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const NoteSchema = new Schema({
  content: {
    type: String,
    required: [true, "Please add content for the note"],
    trim: true,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  course: {
    type: Schema.Types.ObjectId,
    ref: "Course",
    required: true,
  },
  lecture: {
    type: Schema.Types.ObjectId,
    ref: "Lecture",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  tags: [
    {
      type: String,
      trim: true,
    },
  ],
  isPrivate: {
    type: Boolean,
    default: true,
  },
  attachments: [
    {
      type: String,
      // You might want to store URLs to files here
    },
  ],
});

// Add text index for searching
NoteSchema.index({ content: "text", tags: "text" });

module.exports = mongoose.model("Note", NoteSchema);
