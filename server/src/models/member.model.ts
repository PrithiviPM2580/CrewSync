import mongoose, { Document, Schema } from "mongoose";

export interface MemberDocument extends Document {
  userId: mongoose.Types.ObjectId;
  workspaceId: mongoose.Types.ObjectId;
  // role: RoleDocument;
  joinedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const memberSchema = new Schema<MemberDocument>(
  {
    userId: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: "User",
    },
    workspaceId: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: "Workspace",
    },
    // role:{
    //     type: mongoose.Types.ObjectId,
    //     required: true,
    //     ref: 'Role'
    // },
    joinedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

const Member = mongoose.model<MemberDocument>("Member", memberSchema);

export default Member;
