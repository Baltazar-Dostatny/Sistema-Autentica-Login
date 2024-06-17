console.log("Javascript inicializado");
// BOTÕES
const buttonOpcoes = document.getElementById("buttonOpcao");
const buttonSair = document.getElementById("buttonSair");

// FUNCTIONS

// VERIFICA LOGIN
async function verificaLogin() {
    const token = localStorage.getItem("token");

    try {
        const tokenVerificado = await fetchVerificaToken(token);
        verificaErrosRespostaVerificaLogin(tokenVerificado);
        
        tokenValido(tokenVerificado.nome, tokenVerificado.email);
    } catch(erro) {
        trataErrosVerificaLogin(erro.message);
    };
};

async function fetchVerificaToken(token) {
    const fetchConfigs = {
        method: "POST",
        headers: {"authorization": token},
    };

    const resposta = await fetch("/login/autentica/token", fetchConfigs);
    return resposta.json();
};

function verificaErrosRespostaVerificaLogin(resposta) {
    if(Object.keys(resposta)[0] === "Erro") {throw new Error(resposta["Erro"])};
};

function trataErrosVerificaLogin(erro) {
    if(erro === "Token inválido" || erro === "Você não possui um Token. Faça o login para adquirir um e proseguir") {
        tokenInvalido();
    };
};

function tokenInvalido() {
    alert("Você precisa realizar seu login!");
    window.location.href="/";
};

function tokenValido(nome, email) {
    document.getElementById("h1Login").innerText="Login aprovado";

    document.querySelector("main").innerHTML=`
    <h1>Login efetuado com sucesso!</h1>
    <h1>Bem-vindo(a) ${nome}</h1>
    `

    document.getElementById("nomeUsuario").innerText=nome;
};

// BUTTON SAIR

buttonSair.onclick=function() {
    localStorage.removeItem("token");

    document.querySelector("main").innerHTML=`
    <h1>Saindo</h1>
    <h1>Aguarde alguns segundos</h1>
    `;

    setTimeout(() => {
        window.location="/";
    }, 4000);
};

// INICIALIZALIZADORES
verificaLogin();
