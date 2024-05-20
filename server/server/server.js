import express from "express";
import url from "url";
import path from "path";
import bodyParser from "body-parser";
import conectaMongoDb from "../mongoDb/dbConnect.js";

const app = express();
const porta = 3000;

const diretorioAtual = url.fileURLToPath(import.meta.url);
const diretorioPublico = path.join(diretorioAtual, "../../../publico")

app.use(express.static(diretorioPublico));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.listen(porta, () => {
    console.log(`Servidor rodando na porta: ${porta}`);
});

conectaMongoDb();

export { app, diretorioPublico };
