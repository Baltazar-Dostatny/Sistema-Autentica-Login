import bcrypt from "bcrypt";
import dotenv from "dotenv";

dotenv.config();

async function gerarHash(senha) {
    const saltIteracoes = Number(process.env.SALT_ITERACTIONS);
    const hash = await bcrypt.hash(senha, saltIteracoes);
    return hash;
};

export {gerarHash};
