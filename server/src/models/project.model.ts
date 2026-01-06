import mongoose, { Document, Schema } from "mongoose";

export interface ProjectDocument extends Document {
  name: string;
  description: string;
  emoji: string;
  workspace: mongoose.Types.ObjectId;
  createBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const projectSchema = new Schema<ProjectDocument>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: false,
    },
    emoji: {
      type: String,
      required: false,
      trim: true,
      default: "📁",
    },
    workspace: {
      type: mongoose.Types.ObjectId,
      ref: "Workspace",
      required: true,
    },
    createBy: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Project = mongoose.model<ProjectDocument>("Project", projectSchema);

export default Project;
