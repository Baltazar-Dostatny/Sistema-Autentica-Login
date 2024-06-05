import mongoose from "mongoose";

async function conectaMongoDb() {
    try {
        await mongoose.connect("mongodb+srv://User:User123@admin.fxvepf1.mongodb.net/cadastros?retryWrites=true&w=majority&appName=Admin");
        console.log("MongoDb Conectado!");
    }catch(error) {
        console.log("Não foi possivel estabelecer uma conexão com MongoDb");
    };
};

export default conectaMongoDb;
