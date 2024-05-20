import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

function geraToken(dados) {
    const chave = process.env.MINHA_CHAVE_T;

    const payload = {
        nome: dados.nome,
        email: dados.email,
        senha: dados.senha,
        exp: Math.floor(Date.now() / 1000) + (30 * 60)
    };


    const token = jwt.sign(payload, chave);

    return token;
};

export {geraToken};