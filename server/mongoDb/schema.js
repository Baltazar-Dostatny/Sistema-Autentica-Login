import mongoose from "mongoose";

const loginSchema = new mongoose.Schema(
    {
        nome: {type: String, required: true},
        email: {type: String, required: true},
        senha: {type: String, required: true}
    }
);

export default loginSchema;