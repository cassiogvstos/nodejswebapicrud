//importar pacotes
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var Produto = require('./app/models/product');

//Conexao com o banco (Cloud - MLAB)
mongoose.connect('mongodb://cassiounivem:univem1234@ds014368.mlab.com:14368/bancoapi')

//configurar a app para usar o body-parser
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

//Definindo a porta onde o servidor vai responder
var port = process.env.port || 8000;

//Definindo as rotas
var router = express.Router();//intercepta todas as rotas

router.get('/', function(req, res){
	res.json({'message': 'OK, rota principal funcionando'});
});

router.route('/produtos')
	.post(function(req, res){
		var produto = new Produto();
		produto.nome = req.body.nome;
		produto.preco = req.body.preco;
		produto.descricao = req.body.descricao;

		produto.save(function(error){
			if (error)
				res.send("Erro ao salvar o produto " + error);

			res.json({message:"Produto inserido com sucesso"});
		});
	});

//Criando vinculo da app com o motor de rotas, tudo que chegar vincula ao express
//Definindo uma rotapadrão para as minhas apis
app.use('/api', router);


app.listen(port);
console.log("API up and running! on port " + port);