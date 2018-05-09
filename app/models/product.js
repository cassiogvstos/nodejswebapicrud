/**
 *Arquivo de model para Produto
 *vinculo com mongoose para ORM
 */

 var mongoose = require('mongoose');//mongoose e o ODM
 var Schema = mongoose.Schema;

 var produtoSchema = new Schema({
 	nome: String,
 	preco: Number,
 	descricao: String
 });

module.exports = mongoose.model('Produto', produtoSchema);