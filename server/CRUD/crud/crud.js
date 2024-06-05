// PRINCIPAIS IMPORTS PARA O FUNCIONAMENTO
import { app, diretorioPublico } from "../../server/server.js";
import loginModel from "../../mongoDb/model.js";
// TRATA ERROS ORDENADOS POR MÉTODOS;
import {trataCadastrosEncontrados} from "../trataErros/trataErrosGetCadastros.js";
import {verificaCamposObrigatorios, verificaNomeEmailJaUtilizados, verificaSenhaSegura} from "../trataErros/trataErrosPostCadastros.js";
import {trataCadastroEncontrado, trataSenhaVerificada, trataCadastrosDeletados} from "../trataErros/trataErrosDeleteCadastros.js";
// HASH
import {gerarHash} from "../criptografaSenhas/gerarHash.js";
import {verificaHash} from "../criptografaSenhas/verificarHash.js";
import {geraToken} from "../tokenJwt/geraToken.js";
import {verificaToken} from "../tokenJwt/autentificaToken.js";

// PAGINAS WEB //

app.get("/", (req, res) => {
    const diretorio = `${diretorioPublico}/pages/home/`
    res.status(200).sendFile(diretorio);
});

app.get("/login", (req, res) => {
    const diretorio = `${diretorioPublico}/pages/login/`
    res.status(200).sendFile(diretorio);
})

// POSTMAN //

// GERENCIA CADASTROS
app.get("/cadastros", async (req, res) => {
    try {
        const cadastros = await loginModel.find();
        trataCadastrosEncontrados(cadastros);
        res.status(200).send(cadastros);
    } catch(error) {
        res.status(500).send({Erro: error.message});
    };
});

app.get("/cadastros/:email", async (req, res) => {
    const params = req.params;
    try {
        const cadastro = await loginModel.find({email: params.email});
        trataCadastroEncontrado(cadastro);

        res.status(200).send(cadastro);
    } catch(erro) {
        res.status(500).send({Erro: erro.message});
    };
});

app.post("/cadastros", async (req, res) => {
    const dados = req.body;

    try {
        verificaCamposObrigatorios(dados);
        await verificaNomeEmailJaUtilizados(dados.nome, dados.email)
        await verificaSenhaSegura(dados.senha);

        const senhaCriptografada = await gerarHash(dados.senha);
        
        const cadastro = await loginModel.create({nome: dados.nome, email: dados.email, senha: senhaCriptografada});
        res.status(200).send(dados);
    } catch(erro) {
        res.status(500).send({Erro: erro.message});
    };
});

app.put("/cadastros", async (req, res) => {
    try {
        const novosDados = req.body;
        await verificaSenhaSegura(novosDados.senha);
        
        const cadastro = await loginModel.findOneAndUpdate({email: novosDados.email}, {senha: await gerarHash(novosDados.senha)});

        res.status(200).send(cadastro);
    } catch(erro) {
        res.status(500).send({Erro: erro.message});
    };
});

app.delete("/cadastros", async (req, res) => {
    const dados = req.body;
    
    try {
        const cadastro = await loginModel.find({nome: dados.nome, email: dados.email});
        trataCadastrosEncontrados(cadastro);

        const verificaSenha = await verificaHash(dados.senha, cadastro[0].senha);
        trataSenhaVerificada(verificaSenha);

        const deletados = await loginModel.deleteOne({nome: dados.nome, email: dados.email});
        trataCadastrosDeletados(deletados);

        res.status(200).send({"Cadastro deletado": dados.email});
    } catch(erro) {
        res.status(500).send({Erro: erro.message});
    };
});

app.delete("/cadastros/deleteAll", async (req, res) => {
    try {
        const deletados = await loginModel.deleteMany();
        res.status(200).send({"Cadastros deletados": deletados.deletedCount});
    } catch(erro) {
        res.status(500).send({Erro: erro.message});
    };
});

// REALIZA LOGIN
app.post("/login", async (req, res) => {
    try {
        const dados = req.body;
        const cadastro = await loginModel.find({email: dados.email});
        trataCadastroEncontrado(cadastro);
        
        if(await verificaHash(dados.senha, cadastro[0].senha) !== true) {throw new Error("Senha inválida")};
        const token = geraToken({nome: cadastro[0].nome, email: dados.email, senha: dados.senha});

        res.status(200).send({"Login realizado com sucesso, aqui está seu token": token});
    } catch(erro) {
        res.status(500).send({Erro: erro.message});
    };
})

// VERIFICA TOKEN PARA ACESSO
app.post("/login/autentica/token", (req, res) => {
    try {
        const token = req.headers.authorization;

        if(token === undefined) {throw new Error("Você não possui um Token. Faça o login para adquirir um e proseguir")};
        const tokenVerificado = verificaToken(token);
        
        res.status(200).send(tokenVerificado);
    } catch(erro) {
        res.status(500).send({Erro: erro.message});
    };
});

// VERIFICA EMAIL E SENHA PARA TROCA
app.post("/login/troca/senha", async (req, res) => {
    const dados = req.body;

    try {
        const login = await loginModel.find({email: dados.email});
        if(login.length === 0) {throw new Error("Email inválido")};
        if(await verificaHash(dados.senha, login[0].senha) !== true) {throw new Error("Senha inválida")};

        res.status(200).send(true);
    } catch(erro) {
        res.status(500).send({Erro: erro.message});
    };
});
