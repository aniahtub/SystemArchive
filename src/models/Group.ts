import * as mongoose from "mongoose";
import { model } from "mongoose";

const groupSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now },
    },
    { id: false }

);

groupSchema.set("toObject", { virtuals: true });
groupSchema.set("toJSON", { virtuals: true });

export default model("Group", groupSchema);

