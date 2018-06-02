/**
 *Arquivo de model para Servicos
 *vinculo com mongoose para ORM
 */

 var mongoose = require('mongoose');//mongoose e o ODM
 var Schema = mongoose.Schema;

 var serviceSchema = new Schema({
 	nome: String,
 	preco: Number,
 	descricao: String,
 	dataServico: Date,
 });

module.exports = mongoose.model('Service', serviceSchema);