import * as mongoose from "mongoose";
import { model } from "mongoose";

const reportSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    related_files: [{ type: String, required: true }],
    tags: [{ type: String, required: true }],
    group: { type: mongoose.Schema.Types.ObjectId, ref: "Group" },
    uploader: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    content : { type: String, required: true },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now },
  },
  { id: false }
);

reportSchema.set("toObject", { virtuals: true });
reportSchema.set("toJSON", { virtuals: true });

export default model("reports", reportSchema);
