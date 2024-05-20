import bcrypt from "bcrypt";

async function verificaHash(senhaNormal, senhaCriptografada) {
    return new Promise((resultadoPromise, erroPromise) => {
        bcrypt.compare(senhaNormal, senhaCriptografada, (erro, resultado) => {
            if(erro) {erroPromise("Erro ao verificar senha")};
            if(resultado ? resultadoPromise(true) : resultadoPromise(false));
        });
    });
};

export {verificaHash};
