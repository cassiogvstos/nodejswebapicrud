//importar pacotes
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var Produto = require('./app/models/product');

/*Persistência Conexao com o banco (Cloud - MLAB)
mongoose.connect('mongodb://cassiounivem:univem1234@ds014368.mlab.com:14368/bancoapi')
*/
mongoose.connect('mongodb://localhost/dbCrud');

//configurar a app para usar o body-parser pega o que quero
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

//Definindo a porta onde o servidor vai responder
var port = process.env.port || 8000;

//Definindo as rotas
var router = express.Router();//intercepta todas as rotas

//MIDDLEWARE pega antes de chegar na rota desejada
router.use(function(req,res,next){
	console.log("Interceptação pelo Middleware OK");
	next();
});

router.get('/', function(req, res){
	res.json({'message': 'OK, rota principal funcionando'});
});

//GetById
router.route('/produtos/:productId')
	.get(function(req, res){
		const id = req.params.productId;

	Produto.findById(id, function(err, produto){
		if(err){
			res.status(500).json({
				message:"Erro ao tentar encontrar produto, ID mal formado"
			});
		}
		else if (produto == null) {
			res.status(400).json({
				message:"Produto não encontrado"
			});
		}
		else{
			res.status(200).json({
				message:"Okay produto encontrado",
				produto: produto
			});
		}
	});
})


//Atualização OR Update - PUT, ex:localhost:8000/api/produtos/productId
.put(function(req, res){
	const id = req.params.productId;
	Produto.findById(id, function(err, produto){
		if(err){
			res.status(500).json({
				message:"Id mal formado, erro ao tentar encontrar produto"
			});
		}
		else if (produto == null) {
			res.status(400).json({
				message:"Produto não encontrado"
			});
		}
		else{
			produto.nome = req.body.nome;
			produto.preco = req.body.preco;
			produto.descricao = req.body.descricao;

			produto.save(function(error){
				if(error)
					res.send("Erro au tentar atualizar o produto " + error);

				res.status(200).json({
					message:"Produto atualizado com sucesso"
				});
			});
		}
	});
})


//Remover OR delete - DELETE, ex:localhost:8000/api/produtos/productId
.delete(function(req, res){
	Produto.findByIdAndRemove(req.params.productId, (err, produto) => {
		if (err) return res.status(500).send(err);

		const response = {
			message:"Produto removido com sucesso",
			id: produto.id
		};
		return res.status(200).send(response);
	});
});


//cria uma rota que responda a um POST
router.route('/produtos')
	//POST para produto (CREATE)
	.post(function(req,res){
		var produto = new Produto();
		produto.nome = req.body.nome;
		produto.preco = req.body.preco;
		produto.descricao = req.body.descricao;


		produto.save(function(error){
			if (error)
				res.send("Erro ao tentar salvar um novo produto " + error);

			res.status(201).json({"message":"Produto inserido com sucesso"});
		});
	})


	.get(function(req, res){

		Produto.find(function(err, prods){
			if(err)
				res.send(err);

			res.status(200).json({
				message:"Return all products",
				todosProdutos:prods
			});
		});
	});

//Criando vinculo da app com o motor de rotas, tudo que chegar vincula ao express
//Definindo uma rotapadrão para as minhas apis
app.use('/api', router);


app.listen(port);
console.log("API up and running! on port " + port);