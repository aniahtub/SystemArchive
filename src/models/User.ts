import * as mongoose from "mongoose";
import { model } from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    phone: { type: String, required: true },
    role: { type: String, enum: ["admin", "user"], default: "user" },
    group: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Group",
     }],
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now },
  },
  { id: false }
);

userSchema.set("toObject", { virtuals: true });

userSchema.set("toJSON", { virtuals: true });

//export the model
export default model("User", userSchema);
