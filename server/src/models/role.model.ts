import {
  PermissionEnum,
  RoleEnum,
  type PermissionEnumType,
  type RoleEnumType,
} from "@/enums/index.enum.js";
import { RolePermissions } from "@/utils/index.util.js";
import mongoose, { Document, Schema } from "mongoose";

export interface RoleDocument extends Document {
  name: RoleEnumType;
  permissions: Array<PermissionEnumType>;
  createdAt: Date;
  updatedAt: Date;
}

const roleSchema = new Schema<RoleDocument>(
  {
    name: {
      type: String,
      enum: Object.values(RoleEnum),
      required: true,
      unique: true,
    },
    permissions: {
      type: [String],
      enum: Object.values(PermissionEnum),
      required: true,
      default: function (this: RoleDocument) {
        return RolePermissions[this.name];
      },
    },
  },
  {
    timestamps: true,
  }
);
