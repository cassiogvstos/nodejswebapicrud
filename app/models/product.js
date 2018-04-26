/**
 *Arquivo de model para Produto
 *vinculo com mongoose para ORM
 */

 var mongoose = require('mongoose');
 var Schema = mongoose.Schema;

 var ProdutoSchema = new Schema({
 	nome:String,
 	preco:Number,
 	descricao:String
 });

module.exports = mongoose.model('Produto', ProdutoSchema);


