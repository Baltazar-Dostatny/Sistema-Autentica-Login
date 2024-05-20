import loginModel from "../../mongoDb/model.js";

function verificaCamposObrigatorios(dados) {
    if(dados.nome === undefined) {throw new Error("Você precisa digitar seu nome de usúario")}
    if(dados.email === undefined) {throw new Error("Você precisa digitar seu email")}
    if(dados.senha === undefined) {throw new Error("Você precisa digitar sua senha")}
};

async function verificaSenhaSegura(senha) {
    if(!/[A-Z]/.test(senha)) {throw new Error("Sua senha deve conter no minimo 6 caracteres incluindo letras maiusculas, minusculas e numeros")};
    if(!/[a-z]/.test(senha)) {throw new Error("Sua senha deve conter no minimo 6 caracteres incluindo letras maiusculas, minusculas e numeros")};
    if(!/\d/.test(senha)) {throw new Error("Sua senha deve conter no minimo 6 caracteres incluindo letras maiusculas, minusculas e numeros")};
    if(senha.length < 6) {throw new Error("Sua senha deve conter no minimo 6 caracteres incluindo letras maiusculas, minusculas e numeros")};
};

async function verificaNomeEmailJaUtilizados(nome, email) {
    const verificaNome = await loginModel.find({nome: nome});
    const verificaEmail = await loginModel.find({email: email});

    if(verificaNome.length > 0) {throw new Error("Nome já utilizado")};
    if(verificaEmail.length > 0) {throw new Error("Email já utilizado")};
};

export {verificaCamposObrigatorios, verificaNomeEmailJaUtilizados, verificaSenhaSegura}
