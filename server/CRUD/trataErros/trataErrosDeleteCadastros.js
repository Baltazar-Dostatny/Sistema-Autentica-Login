function trataCadastroEncontrado(cadastro) {
    if(cadastro.length === 0) {
        throw new Error("Email não encontrado");
    };
};

function trataSenhaVerificada(senhaVerificada) {
    if(senhaVerificada === false) {throw new Error("Senha inválida")};
};

function trataCadastrosDeletados(quantidade) {
    if(quantidade === 0) {
        throw new Error("Nenhum cadastro foi encontrado");
    };
};



export {trataCadastroEncontrado, trataSenhaVerificada, trataCadastrosDeletados};
