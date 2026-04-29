import mongoose from "mongoose";

const ProjectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },

  technologies: {
    type: [String],
    default: [],
  },
  url: {
    type: String,
  },
  githubUrl: {
    type: String,
  },
  imageUrl: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  order: {
    type: Number,
    default: 0,
  },
});

export default mongoose.models.Project || mongoose.model("Project", ProjectSchema);
