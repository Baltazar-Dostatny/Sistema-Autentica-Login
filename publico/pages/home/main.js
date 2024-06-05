// CONSTS BOTÕES
const form = document.getElementById("loginForm");
const botaoLogin = document.getElementById("loginButton");
const botaoEsquerdo = document.getElementById("esquerdaButton");
const botaoDireito = document.getElementById("direitaButton");

// FUNÇÕES

// PAINEIS
function painelLogin() {
    // MOSTRA PAINEL PARA REALIZAR LOGIN

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
    // MOSTRA PAINEL PARA REALIZAR CADASTRO

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
    // MOSTRA PAINEL PARA REALIZAR TROCA DE SENHA

    document.getElementById("loginForm").innerHTML=`
        <div id="canvasDiv">
            <canvas id="captchaCanvas" width="150" height="50"></canvas>
        </div>

        <label id="captchaLabel" for=" captchaInput">Captcha</label>
        <input id="captchaInput" type="text" name="captcha">

        <label id="emailLabel" for="emailInput" style="display: none">Email</label>
        <input id="emailInput" type="email" name="email" value=${email} style="display: none">

        <label id="senhaLabel" for="senhaInput">Nova senha</label>
        <input id="senhaInput" type="password" name="senha" autocomplete="off">

        <label id="senhaLabel" for="senhaInput">Nova senha</label>
        <input id="senhaInput2" type="password" name="senha2" autocomplete="off">
    `;

    botaoLogin.innerText="Trocar senha";
    botaoEsquerdo.innerText="Visualizar senha";
    botaoDireito.innerText="Voltar ao login"

    // REALIZA AÇÕES NECESSARIAS PARA FORMAR O CAPTCHA
    capV = geraCaptcha();
};

// LOGIN CADASTRO APROVADOS
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
    // MOSTRA CADASTRO APROVADO
    document.querySelector("main").innerHTML=`
        <h1>Cadastro Aprovado</h1>
        <h1>Aguarde alguns segundos e</h1>
        <h1>Realize seu login!</h1>
    `;

    // MANDA PAGINA PARA REALIZAR LOGIN
    setTimeout(() => {
        window.location.href="/";
    }, 8000);
};

// LOGIN
async function chamaLogin(dadosLogin) {
    // REALIZA O LOGIN
    try {
        verificaCamposEmBrancoLogin();

        // FAZ CONEXÃO COM O SERVIDOR PARA CONFERIR OS DADOS NECESSARIOS E REALIZAR LOGIN
        const resposta = await fetchLogin(dadosLogin);

        // VERIFICA POSSIVEIS ERROS
        verificaErrosLogin(resposta);

        // REALIZA AÇÕES NECESSARIAS COM O LOGIN APROVADO
        loginAprovado(resposta);
    } catch(erro) {

        // TRATA ALGUM ERRO OCORRIDO AO TENTAR REALIZAR O LOGIN
        trataErrosLogin(erro.message);
    };
};

async function fetchLogin(dadosLogin) {
    // CONFIGURAÇÕES PARA REALIZAR A CONEXÃO COM O SERVIDOR
    const fetchConfigs = {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(dadosLogin)
    };

    // REALIZA E RETORNA RESPOSTA DO SERVIDOR
    const resposta = await fetch("/login", fetchConfigs);
    return resposta.json();
};

function verificaCamposEmBrancoLogin() {
    // VERIFICA OS CAMPOS QUE POSSIVELMENTE PODEM ESTAR EM BRANCO
    if(document.getElementById("emailInput").value === "") {throw new Error("Digite seu email")};
    if(document.getElementById("senhaInput").value === "") {throw new Error("Digite sua senha")};
};

function verificaErrosLogin(resposta) {
    // IDENTIFICA POSSIVEIS ERROS E MANDA ELE PARA SEREM TRATADOS DE FORMA CORRETA
    if(Object.keys(resposta)[0] === "Erro") {throw new Error(resposta.Erro)};
};

function trataErrosLogin(erro) {
    // RECEBE POSSIVEIS ERROS E OS TRATA DA MELHOR FORMA
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
    // LOCALIZA O TOKEN E O PEGA
    const token = localStorage.getItem("token");

    // CASO O TOKEN EXISTA ELE É VERIFICADO E REALIZADO O LOGIN DE FORMA AUTOMATICA
    if(token !== null) {
        const tokenVerificado = await fetchVerificaToken(token);

        if(Object.keys(tokenVerificado)[0] !== "Erro") {setTimeout(() => {loginAprovado()}, 3000)};
    };
};

async function fetchVerificaToken(token) {
    // CONFIGURAÇÕES PARA REALIZAR A CONEXÃO COM O SERVIDOR
    const fetchConfigs = {
        method: "POST",
        headers: {"authorization": token},
    };

    // REALIZA E RETORNA RESPOSTA DO SERVIDOR
    const resposta = await fetch("/login/autentica/token", fetchConfigs);
    return resposta.json();
};

// CADASTRAR-SE
async function chamaCadastro(dadosCadastro) {
    // REALIZA O LOGIN
    try {
        verificaCamposEmbrancoCadastro();
        verificaErrosSenhaCadastro();
        
        // FAZ CONEXÃO COM O SERVIDOR PARA CONFERIR OS DADOS NECESSARIOS E REALIZAR LOGIN
        const resposta = await fetchCadastro(dadosCadastro);
        
        // VERIFICA POSSIVEIS ERROS
        verificaErrosCadastro(resposta);

        // REALIZA AÇÕES NECESSARIAS COM O CADASTRO APROVADO
        CadastroAprovado();
    } catch(erro) {
        // TRATA ALGUM ERRO OCORRIDO AO TENTAR REALIZAR O LOGIN
        trataErrosCadastro(erro.message);
    };
};

async function fetchCadastro(dadosCadastro) {
    // CONFIGURAÇÕES PARA REALIZAR A CONEXÃO COM O SERVIDOR
    const fetchConfigs = {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(dadosCadastro)
    };

    // REALIZA E RETORNA RESPOSTA DO SERVIDOR
    const resposta = await fetch("/cadastros", fetchConfigs);
    return resposta.json();
};

function verificaCamposEmbrancoCadastro() {
    // VERIFICA POSSIVEIS CAMPOS EM BRANCO AO TENTAR CADASTRAR-SE
    if(document.getElementById("nomeInput").value === "") {throw new Error("Digite seu nome")};
    if(document.getElementById("emailInput").value === "") {throw new Error("Digite seu email")};
    if(document.getElementById("senhaInput").value === "") {throw new Error("Digite sua senha")};
};

function verificaErrosSenhaCadastro() {   
    // VERIFICA POSSIVEIS ERROS RELACIONADOS A SENHA AO CADASTRAR-SE
    if(document.getElementById("senhaInput").value !== document.getElementById("senhaInput2").value) {throw new Error("Sua senha precisa seu igual a acima")};
};

function verificaErrosCadastro(resposta) {
    // VERIFICA POSSIVEIS ERROS AO TENTAR CADASTRAR-SE E OS ENVIA PARA SEREM TRATADOS DA MELHOR FORMA
    if(Object.keys(resposta)[0] === "Erro") {throw new Error(resposta.Erro)};
};

function trataErrosCadastro(erro) {
    // TRATA POSSIVEIS ERROS DA MELHOR FORMA
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
async function esqueciSenha() {
    // ARMAZENA EMAIL E SENHA
    const email = document.getElementById("emailInput").value;
    const senha = document.getElementById("senhaInput").value;

     try {
        // VERIFICA POSSIVEIS CAMPOS EM BRANCO
        verificaCamposEmBrancoEsqueciSenha();

        // VERIFICA SE EMAIL E SENHA CORRESPONDEM A ALGUM CADASTRO NO SERVIDOR
        const verificaLogin = await fetchVerificaLogin(email, senha);

        // IDENTIFICA POSSIVEIS ERROS E OS ENVIA PARA SEREM TRATADOS DA MELHOR FORMA
        if(Object.keys(verificaLogin)[0] === "Erro") {throw new Error(verificaLogin["Erro"])};

        // ENVIA PAINEL PARA REALIZAR A TROCA DA SENHA
        painelTrocaSenha(email);        
     } catch(erro) {
        // TRATA POSSIVEIS ERROS RECEBIDOS DA MELHOR FORMA
        trataErrosEsqueciSenha(erro.message);
     }
};

function verificaCamposEmBrancoEsqueciSenha() {
    // VERIFICA POSSIVEIS CAMPOS EM BRANCO
    if(document.getElementById("emailInput").value === "" || document.getElementById("senhaInput").value === "") {
        throw new Error("Campos em branco");
    };
};

async function fetchVerificaLogin(email, senha) {
    // CONFIGURAÇÕES PARA REALIZAR A CONEXÃO COM O SERVIDOR
    const fetchConfigs = {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({email: email, senha: senha})
    };

    // REALIZA E RETORNA RESPOSTA DO SERVIDOR
    const respostaFetch = await fetch("/login/troca/senha", fetchConfigs);
    return respostaFetch.json();
};

async function fetchTrocaSenha(email, senha) {
    // CONFIGURAÇÕES PARA REALIZAR A CONEXÃO COM O SERVIDOR
    const fetchConfigs = {
        method: "PUT",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({email: email, senha: senha})
    };

    // REALIZA E RETORNA RESPOSTA DO SERVIDOR
    const respostaFetch = await fetch("/cadastros", fetchConfigs);
    return respostaFetch.json();
};

function verificaErrosLogin(login) {
    // IDENTIFICA POSSIVEIS ERROS E OS ENVIA PARA SEREM TRATADOS DA MELHOR FORMA
    if(Object.keys(login)[0] === "Erro") {throw new Error(login)}
};

async function chamaTrocaSenha(dadosLogin) {
    try {
        // VERIFICA POSSIVEIS ERROS
        verificaErrosTrocaSenha(dadosLogin);
    
        // REALIZA CONEXÃO COM O SERVIDOR PARA TROCAR A SENHA
        const fetch = await fetchTrocaSenha(dadosLogin.email, dadosLogin.senha);

        // IDENTIFICA POSSIVEIS ERROS E OS ENVIA PARA SEREM TRATADOS DA MELHOR FORMA
        if(Object.keys(fetch)[0] === "Erro") {throw new Error(fetch["Erro"])};

        // ENVIA PAINEL PARA MOSTRAR O SUCESSO EM TROCAR A SENHA
        CadastroAprovado();
    } catch(erro) {
        // TRATA POSSIVEIS ERROS DA MELHOR FORMA
        trataErrosEsqueciSenha(erro.message);
    };
};

function verificaErrosTrocaSenha(dadosLogin) {
    // VERIFICA POSSIVEIS ERROS AO TENTAR REALIZAR A TROCA DE SENHA
    if(dadosLogin.captcha.toUpperCase() !== capV.toUpperCase()) {throw new Error("Captcha inválido")};
    if(dadosLogin.senha === "") {throw new Error("Você precisa digitar sua senha")};
    if(dadosLogin.senha2 === "") {throw new Error("Você precisa digitar sua senha novamente")}
    if(dadosLogin.senha !== dadosLogin.senha2) {throw new Error("Sua senha precisa seu igual a acima")};
};

function trataErrosEsqueciSenha(erro) {
    // TRATA POSSIVEIS ERROS RECEBIDOS DA MELHOR FORMA
    if(erro === "Campos em branco") {
        document.getElementById("emailInput").placeholder = "Digite seu email";
        document.getElementById("senhaInput").placeholder = "Digite sua senha";
    };

    if(erro === "Email inválido") {
        document.getElementById("emailInput").value = "";
        document.getElementById("emailInput").placeholder = erro;
    };

    if(erro === "Senha inválida") {
        document.getElementById("senhaInput").value = "";
        document.getElementById("senhaInput").placeholder = erro;
    };

    if(erro === "Captcha inválido") {
        document.getElementById("captchaInput").value = "";
        document.getElementById("captchaInput").placeholder = erro;
    };

    if(erro === "Você precisa digitar sua senha") {
        document.getElementById("senhaInput").value = "";
        document.getElementById("senhaInput").placeholder = "Digite sua senha";
        document.getElementById("senhaInput2").value = "";
    };

    if(erro === "Você precisa digitar sua senha novamente") {
        document.getElementById("senhaInput2").value = "";
        document.getElementById("senhaInput2").placeholder = "Digite sua senha novamente";
    };

    if(erro === "Sua senha precisa seu igual a acima") {
        document.getElementById("senhaInput2").value = "";
        document.getElementById("senhaInput2").placeholder = "Senha diferente da acima";
    };

    if(erro === "Sua senha deve conter no minimo 6 caracteres incluindo letras maiusculas, minusculas e numeros") {
        document.getElementById("senhaInput").value = "";
        document.getElementById("senhaInput2").value = "";
        alert(erro);
    };
};

// CAPTCHA
function geraCaptcha() {
    // CONFIGURAÇÕES PARA GERAR CAPTCHA
    const canvasDiv = document.getElementById("captchaCanvas");
    const context = canvasDiv.getContext("2d");
    const captchaText = Math.random().toString(36).substring(7).toUpperCase();

    context.font = "30px Arial";
    context.fillStyle = "black";
    context.fillText(captchaText, 20, 50);

    return captchaText;
}

function verificaCaptcha() {
    // VERIFICA CAPTCHA GERADO COM CAPTCHA DIGITADO PELO USUARIO
    if(document.getElementById("captchaInput").value.toUpperCase() !== capV.toUpperCase()) {throw new Error("Captcha incorreto")};
};

let capV;

// BOTÃO CENTRAL [LOGIN, CADASTRAR-SE, ESQUECI_A_SENHA]
botaoLogin.onclick=async function() {
    // DADOS DIGITADOS PELO USUARIO
    const dadosForm = new FormData(form);
    const dadosLogin = {nome: dadosForm.get("nome"), email: dadosForm.get("email"), senha: dadosForm.get("senha"), senha2: dadosForm.get("senha2"), captcha: dadosForm.get("captcha")};

    // BOTÕES A SEREM PRECIONADOS PELO USUARIO E SUAS RESPECTIVAS AÇÕES
    if(botaoLogin.innerText === "Login") {chamaLogin(dadosLogin)};
    if(botaoLogin.innerText === "Cadastrar-se") {chamaCadastro(dadosLogin)};
    if(botaoLogin.innerText === "Trocar senha") {chamaTrocaSenha(dadosLogin)};
};

// BOTÃO ESQUERDO [ESQUECI_A_SENHA, VER_SENHA]
botaoEsquerdo.onclick=async function() {

    // BOTÕES A SEREM PRECIONADOS PELO USUARIO E SUAS RESPECTIVAS AÇÕES
    if(botaoEsquerdo.innerText === "Trocar senha" ? await esqueciSenha() : visualizarSenha());
};

// BOTÃO DIREITO [CADASTRAR-SE, VOLTAR_AO_LOGIN]
botaoDireito.onclick=function() {

    // BOTÕES A SEREM PRECIONADOS PELO USUARIO E SUAS RESPECTIVAS AÇÕES
    if(botaoDireito.innerText==="Cadastrar-se") {painelCadastro()} else
    if(botaoDireito.innerText==="Voltar ao login") {painelLogin()};
};

// INCIALIZADORES
verificaLogin()
