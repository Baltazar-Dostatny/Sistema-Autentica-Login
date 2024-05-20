// CONSTS BOTÕES
const form = document.getElementById("loginForm");
const botaoLogin = document.getElementById("loginButton");
const botaoEsquerdo = document.getElementById("esquerdaButton");
const botaoDireito = document.getElementById("direitaButton");

// FUNÇÕES

// PAINEIS
function painelLogin() {
    document.getElementById("loginForm").innerHTML=`
    <label id="emailLabel" for="emailInput">Email</label>
    <input id="emailInput" type="email" name="email">

    <label id="senhaLabel" for="senhaInput">Senha</label>
    <input id="senhaInput" type="password" name="senha" autocomplete="on">
    `;

    botaoLogin.innerText="Login";
    botaoEsquerdo.innerText="Esqueci a senha";
    botaoDireito.innerText="Cadastrar-se";
};

function painelCadastro() {
    document.getElementById("loginForm").innerHTML=`
    <label id="nomeLabel" for="nomeInput">Nome de usuário</label>
    <input id="nomeInput" type="text" name="nome">

    <label id="emailLabel" for="emailInput">Email</label>
    <input id="emailInput" type="email" name="email">

    <label id="senhaLabel" for="senhaInput">Senha</label>
    <input id="senhaInput" type="password" name="senha" autocomplete="off">

    <label id="senhaLabel2" for="senhaInput2">Senha Novamente</label>
    <input id="senhaInput2" type="password" name="senha" autocomplete="off">
    `;

    botaoLogin.innerText="Cadastrar-se";
    botaoEsquerdo.innerText="Visualizar senha";
    botaoDireito.innerText="Voltar ao login";
};

function painelTrocaSenha(email) {
    document.getElementById("loginForm").innerHTML=`
        <div id="canvasDiv">
            <canvas id="captchaCanvas" width="150" height="50"></canvas>
        </div>

        <label id="captchaLabel" for=" captchaInput">Captcha</label>
        <input id="captchaInput" type="text" name="captcha">

        <label id="emailLabel" for="emailInput">Email</label>
        <input id="emailInput" type="email" name="email" value=${email}>

        <label id="senhaLabel" for="senhaInput">Nova senha</label>
        <input id="senhaInput" type="password" name="senha" autocomplete="off">

        <label id="senhaLabel" for="senhaInput">Nova senha</label>
        <input id="senhaInput2" type="password" name="senha" autocomplete="off">
    `;

    capV = geraCaptcha();

    botaoLogin.innerText="Trocar senha";
    botaoEsquerdo.innerText="Visualizar senha";
    botaoDireito.innerText="Voltar ao login"
};

// APROVADOS
function loginAprovado(respota) {
    // MOSTRA LOGIN APROVADO
    document.querySelector("main").innerHTML=`
        <h1>Login Aprovado</h1>
        <h1>Aguarde alguns segundos</h1>
        <h1>Estamos redirecionando você!</h1>
    `;

    // ENCONTRA TOKEN E O ARMAZENA PARA REALIZAR O LOGIN AUTOMATICAMENTE
    if(respota !== undefined) {
        const token = respota[Object.keys(respota)[0]];
        localStorage.setItem("token", token);
    };

    // MANDA PAGINA LOGIN
    setTimeout(() => {
        window.location.href="/login";
    }, 8000);
};

function CadastroAprovado() {
    document.querySelector("main").innerHTML=`
        <h1>Cadastro Aprovado</h1>
        <h1>Aguarde alguns segundos e</h1>
        <h1>Realize seu login!</h1>
    `;

    setTimeout(() => {
        window.location.href="/";
    }, 8000);
};

// LOGIN
async function chamaLogin(dadosLogin) {
    try {
        verificaCamposEmBrancoLogin();

        const resposta = await fetchLogin(dadosLogin);

        verificaErrosLogin(resposta);

        loginAprovado(resposta);
    } catch(erro) {
        trataErrosLogin(erro.message);
    };
};

async function fetchLogin(dadosLogin) {
    const fetchConfigs = {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(dadosLogin)
    };

    const resposta = await fetch("/login", fetchConfigs);
    return resposta.json();
};

function verificaCamposEmBrancoLogin() {
    if(document.getElementById("emailInput").value === "") {throw new Error("Digite seu email")};
    if(document.getElementById("senhaInput").value === "") {throw new Error("Digite sua senha")};
};

function verificaErrosLogin(resposta) {
    if(Object.keys(resposta)[0] === "Erro") {throw new Error(resposta.Erro)};
};

function trataErrosLogin(erro) {
    if(erro === "Digite seu email" || erro === "Digite sua senha") {
        document.getElementById("emailInput").placeholder="Digite seu email";
        document.getElementById("senhaInput").placeholder="Digite sua senha";
    };

    if(erro === "Email não encontrado") {
        document.getElementById("emailInput").value=""
        document.getElementById("emailInput").placeholder=erro;
    };
    
    if(erro === "Senha inválida") {
        document.getElementById("senhaInput").value=""
        document.getElementById("senhaInput").placeholder=erro;
    };
};

async function verificaLogin() {
    const token = localStorage.getItem("token");

    if(token !== null) {
        const tokenVerificado = await fetchVerificaToken(token);

        if(Object.keys(tokenVerificado)[0] !== "Erro") {setTimeout(() => {loginAprovado()}, 3000)};
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

// CADASTRAR-SE
async function chamaCadastro(dadosCadastro) {
    try {
        verificaCamposEmbrancoCadastro();
        verificaErrosSenhaCadastro();
        
        const resposta = await fetchCadastro(dadosCadastro);
        verificaErrosCadastro(resposta);

        CadastroAprovado();
    } catch(erro) {
        trataErrosCadastro(erro.message);
    };
};

async function fetchCadastro(dadosCadastro) {
    const fetchConfigs = {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(dadosCadastro)
    };

    const resposta = await fetch("/cadastros", fetchConfigs);
    return resposta.json();
};

function verificaCamposEmbrancoCadastro() {
    if(document.getElementById("nomeInput").value === "") {throw new Error("Digite seu nome")};
    if(document.getElementById("emailInput").value === "") {throw new Error("Digite seu email")};
    if(document.getElementById("senhaInput").value === "") {throw new Error("Digite sua senha")};
};

function verificaErrosSenhaCadastro() {   
    if(document.getElementById("senhaInput").value !== document.getElementById("senhaInput2").value) {throw new Error("Sua senha precisa seu igual a acima")};
};

function verificaErrosCadastro(resposta) {
    if(Object.keys(resposta)[0] === "Erro") {throw new Error(resposta.Erro)};
};

function trataErrosCadastro(erro) {
    // ERROS FRONT-END
    if(erro === "Digite seu nome") {
        document.getElementById("nomeInput").placeholder=erro;
    };

    if(erro === "Digite seu email") {
        document.getElementById("emailInput").placeholder=erro;
    };

    if(erro === "Digite sua senha") {
        document.getElementById("senhaInput").placeholder=erro;
    };

    if(erro === "Sua senha precisa seu igual a acima") {
        document.getElementById("senhaInput2").value="";
        document.getElementById("senhaInput2").placeholder=erro;
    };

    // ERROS BACK-END
    if(erro === "Nome já utilizado") {
        document.getElementById("nomeInput").value="";
        document.getElementById("nomeInput").placeholder=erro;
    };

    if(erro === "Email já utilizado") {
        document.getElementById("emailInput").value="";
        document.getElementById("emailInput").placeholder=erro; 
    };

    if(erro === "Sua senha deve conter no minimo 6 caracteres incluindo letras maiusculas, minusculas e numeros") {
        document.getElementById("senhaInput").value="";
        document.getElementById("senhaInput2").value="";
        alert(erro);
    };
};

// TROCA SENHA
async function chamaTrocaSenha(dados) {
    try {
        verificaCamposEmBrancoTrocaSenha();
        verificaCaptcha()
        verificaErrosSenhaTrocaSenha();
        
        const resposta = await fetchTrocaSenha(dados);
        verificaErrosTrocaSenha(resposta);
        
        CadastroAprovado();
    } catch(erro) {
        console.log(erro);
        trataErrosTrocaSenha(erro.message);
    };
};

async function fetchTrocaSenha(dados) {
    const fetchConfigs = {
        method: "PUT",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(dados)
    };

    const resposta = await fetch("/cadastros", fetchConfigs);
    return resposta.json();
};

function verificaErrosTrocaSenha(resposta) {
    if(Object.keys(resposta)[0] === "Erro") {throw new Error(resposta.Erro)};
};

function verificaCamposEmBrancoTrocaSenha() {
    if(captchaInput.value === "") {throw new Error("Digite o captcha acima")};
    if(document.getElementById("emailInput").value === "") {throw new Error("Digite seu email")};
    if(document.getElementById("senhaInput").value === "") {throw new Error("Digite sua senha")};
};

function verificaErrosSenhaTrocaSenha() {
    if(document.getElementById("senhaInput").value !== document.getElementById("senhaInput2").value) {throw new Error("Sua senha precisa seu igual a acima")};
};

function trataErrosTrocaSenha(erro) {
    if(erro === "Digite o captcha acima") {
        document.getElementById("captchaInput").placeholder=erro;
    };

    if(erro === "Digite seu email") {
        document.getElementById("emailInput").placeholder=erro;
    };

    if(erro === "Digite sua senha") {
        document.getElementById("senhaInput").placeholder=erro;
    };

    if(erro === "Sua senha precisa seu igual a acima") {
        document.getElementById("senhaInput2").value="";
        document.getElementById("senhaInput2").placeholder=erro;
    };

    if(erro === "Captcha incorreto") {
        document.getElementById("captchaInput").value="";
        document.getElementById("captchaInput").placeholder=erro;
    };
};

function esqueciSenha() {
    if(document.getElementById("emailInput").value !== "") {
        painelTrocaSenha(document.getElementById("emailInput").value);
    } else {
        document.getElementById("emailInput").placeholder="Digite seu email"
    };
};

function visualizarSenha() {
    if(document.getElementById("senhaInput").type === "password") {
        document.getElementById("senhaInput").type="text";
        document.getElementById("senhaInput2").type="text";
    } else {
        document.getElementById("senhaInput").type="password";
        document.getElementById("senhaInput2").type="password"; 
    };
};

// CAPTCHA
function geraCaptcha() {
    const canvasDiv = document.getElementById("captchaCanvas");
    const context = canvasDiv.getContext("2d");
    const captchaText = Math.random().toString(36).substring(7).toUpperCase();

    context.font = "30px Arial";
    context.fillStyle = "black";
    context.fillText(captchaText, 20, 50);

    return captchaText;
}

function verificaCaptcha() {
    if(document.getElementById("captchaInput").value.toUpperCase() !== capV.toUpperCase()) {throw new Error("Captcha incorreto")};
};

let capV;

// BOTÃO CENTRAL [LOGIN, CADASTRAR-SE, ESQUECI_A_SENHA]
botaoLogin.onclick=async function() {
    const dadosForm = new FormData(form);
    const dadosLogin = {nome: dadosForm.get("nome"), email: dadosForm.get("email"), senha: dadosForm.get("senha")};

    if(botaoLogin.innerText === "Login") {chamaLogin(dadosLogin)};
    if(botaoLogin.innerText === "Cadastrar-se") {chamaCadastro(dadosLogin)};
    if(botaoLogin.innerText === "Trocar senha") {chamaTrocaSenha(dadosLogin)};
};

// BOTÃO ESQUERDO [ESQUECI_A_SENHA, VER_SENHA]
botaoEsquerdo.onclick=function() {
    if(botaoEsquerdo.innerText === "Esqueci a senha" ? esqueciSenha() : visualizarSenha());
};

// BOTÃO DIREITO [CADASTRAR-SE, VOLTAR_AO_LOGIN]
botaoDireito.onclick=function() {
    if(botaoDireito.innerText==="Cadastrar-se") {painelCadastro()} else
    if(botaoDireito.innerText==="Voltar ao login") {painelLogin()};
};

// INCIALIZADORES
verificaLogin()
