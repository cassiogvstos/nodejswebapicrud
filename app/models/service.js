/**
 *Arquivo de model para Produto
 *vinculo com mongoose para ORM
 */

 var mongoose = require('mongoose');//mongoose e o ODM
 var Schema = mongoose.Schema;

 var servicoSchema = new Schema({
 	tipo: String,
 	descricao: String,
 	preco: Number,
 	dataServico: Date.parse('dd/mm/yyyy'),
 	
 });

module.exports = mongoose.model('Servico', servicoSchema);