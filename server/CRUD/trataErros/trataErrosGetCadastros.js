function trataCadastrosEncontrados(cadastros) {
    if(cadastros.length === 0) {
        throw new Error("Nenhum cadastro encontrado");
    };
};

export {trataCadastrosEncontrados};