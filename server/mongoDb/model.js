import mongoose from "mongoose";
import loginSchema from "./schema.js";

const loginModel = mongoose.model("login", loginSchema);

export default loginModel;
