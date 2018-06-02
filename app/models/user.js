/**
 * Criação de arquivo de modelo para Usuário
 * Vinculando com mongoose para ORM
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var usuarioSchema = new Schema({
	nome: String,
	sobrenome: String,
	apelido: String,
	sexo: String,
	email: String,
	// foto: String pesquisar sobre gridFS
});

module.exports = mongoose.model('Usuario', usuarioSchema);