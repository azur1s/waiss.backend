import mongoose from "mongoose";
import { IComment, IProject, IProjectHistory, IUser } from "./DatabaseManager";

export const userSchema = new mongoose.Schema<IUser, mongoose.Model<IUser>>({
  uuid: {
    type: String,
    unique: true,
    index: true,
  },
  username: {
    type: String,
    unique: true,
    required: true,
    index: true,
  },
  created_at: {
    type: Number,
  },
  updated_at: {
    type: Number,
  },
  email: {
    type: String,
    unique: true,
    required: true,
    index: true,
  },
  password: {
    type: String,
    required: true,
  },
  avatar: {
    type: String,
  },
});
export const projectSchema = new mongoose.Schema<IProject, mongoose.Model<IProject>>({
  cover_art: {
    type: String,
  },
  version: {
    type: Number,
    required: true,
  },
  daw_name: {
    type: String,
    required: true,
  },
  history: {
    type: [String],
    required: true,
  },
  is_finished: {
    type: Boolean,
    default: false,
  },
  name: {
    type: String,
    required: true,
    default: "New project",
  },
  owner: {
    type: String,
    required: true,
  },
  private: {
    type: Boolean,
    default: true,
  },
  updated_at: {
    type: Number,
    required: true,
  },
  users: {
    type: [String],
    default: [],
  },
});
export const commentSchema = new mongoose.Schema<IComment, mongoose.Model<IComment>>({
  uuid: {
    type: String,
    unique: true,
    index: true,
  },
  content: {
    type: String,
    required: true,
  },
  created_at: {
    type: Number,
    required: true,
  },
  updated_at: {
    type: Number,
    required: true,
  },
});
export const projectHistorySchema = new mongoose.Schema<IProjectHistory, mongoose.Model<IProjectHistory>>({
  comments: {
    type: [String],
    default: [],
  },
  committees: {
    type: [String],
    default: [],
    required: true,
  },
  created_at: {
    type: Number,
    required: true,
  },
  daw_version: {
    type: String,
    required: true,
  },
  path: {
    type: String,
    required: true,
  },
  plugin_count: {
    type: Number,
    required: true,
  },
  plugins: {
    type: [String],
  },
  render_preview_url: {
    type: String,
    required: true,
  },
  summary: {
    type: String,
    required: true,
  },
  track_count: {
    required: true,
    type: Number,
  },
  uuid: {
    type: String,
    unique: true,
    index: true,
  },
});
