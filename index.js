// biblioteca js que faz o mapeamento das pastas em função do server.js
require('rootpath')(); 
var config = require('config.json');
// Inicialização do express. 
var express = require('express');
// bibloteca que ajuda no parse de mensagens requisitadas que contém JSON
var bodyParser = require('body-parser');

// carrega as configurações mapeadas no json
var config = require('config.json');

// Criação da API e indicação que trabalha com JSON
var api = express();
api.use(bodyParser.urlencoded({ extended: false }));
api.use(bodyParser.json());
api.use('/api/pessoas', require('./controllers/api/pessoas.controller'));
api.use('/api/about', require('./controllers/api/about.controller'));


// Porta fixa
var apiPort = config.port;


// start server API
var serverAPI = api.listen(apiPort, function () {
    console.log('Server API listening at http://' + serverAPI.address().address + ':' + serverAPI.address().port);
});