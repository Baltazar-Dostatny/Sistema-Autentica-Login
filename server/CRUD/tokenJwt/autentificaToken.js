import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

function verificaToken(token) {
    try {
        const chave_secreta = process.env.MINHA_CHAVE_T
        
        const resultado = jwt.verify(token, chave_secreta);
        return resultado;
    } catch(erro) {
        throw new Error("Token inválido");
    };
};

export {verificaToken};
