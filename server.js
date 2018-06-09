// moment.locale(en-my-settings, null {

// });
//importar pacotes
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var Produto = require('./app/models/product');
var Usuario = require('./app/models/user');

/*Persistência Conexao com o banco (Cloud - MLAB)*/

mongoose.connect('mongodb://teste:teste123@ds016718.mlab.com:16718/nodeapi');



//mongoose.connect('mongodb://localhost/bancoapinode');

//configurar a app para usar o body-parser pega o que quero
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

//Definindo a porta onde o servidor vai responder
var port = server.listen(process.env.port || 3000);


//Definindo as rotas
var router = express.Router();//intercepta todas as rotas

//MIDDLEWARE pega antes de chegar na rota desejada
router.use(function(req,res,next){
	/*OBSERVAÇÃO - Para que a API tenha autorização de acessar ou ser acessada por outro host precisa-se 
		redefinir o Header*/
	// Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8100');
    res.setHeader('Access-Control-Allow-Origin', 'https://apinode-salty-springs-19764.herokuapp.com/');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
	console.log("Interceptação pelo Middleware OK");
	next();
});

/*+----------------------------------------+
  |				ROTA PADRÃO 			   |
  +----------------------------------------+*/
router.get('/', function(req, res){
	res.json({'message': 'OK, rota principal funcionando'});
});
/*+------------------------------------------------+
  |				Rota de Usuario 				   |
  |			  GetById de Usuário				   |
  +------------------------------------------------+*/
router.route('/usuarios/:userId')
//recebe o usuario pela url
	.get(function(req, res){
		const id = req.params.userId;
//faz a busca no banco com o id cindo da url
	Usuario.findById(id, function(err, user){
		if (err) {
			res.status(500).json({
				message:"Erro ao tentar encontrar usuário, ID mal formado"
			});
		}
		else if (user == null) {
			res.status(400).json({
				message:"Usuário não encontrado"
			});
		}
		else{
			res.status(200).json({
				// message:"Okay usuário encontrado",
				user: user
			});
		}
	});
})
/*+------------------------------------------------+
  |				Rota de Usuario 				   |
  |			Atualização OR Update - PUT, 	   	   |
  +------------------------------------------------+*/
//ex:localhost:8000/api/usuarios/userId
.put(function(req, res){
	const id = req.params.userId;
	Usuario.findById(id, function(err, usuario){
		if(err){
			res.status(500).json({
				message:"Id mal formado, erro ao tentar encontrar usuário"
			});
		}
		else if (usuario == null) {
			res.status(400).json({
				message:"Usuário não encontrado"
			});
		}
		else{
			usuario.nome = req.body.nome;
			usuario.sobrenome = req.body.sobrenome;
			usuario.email = req.body.email;

			usuario.save(function(error){
				if (error)
					res.send("Erro ao tentar atualizar o usuário " + error);	

				res.status(200).json({
					message:"Usuário atualizado com sucesso"
				});
			});			
		}
	});
})
/*+------------------------------------------------+
  |				Rota de Usuario 				   |
  |			Remover OR delete - DELETE,  	   	   |
  +------------------------------------------------+*/
//ex:localhost:8000/api/usuarios/userId
.delete(function(req, res){
	Usuario.findByIdAndRemove(req.params.userId, (err, user) => {
		if (err) return res.status(500).send(err);

		const response = {
			message:"Usuário removido com sucesso",
			id: usuario.id
		};
		return res.status(200).send(response);
	});
});
/*+------------------------------------------------+
  |				Rota de Usuario 				   |
  |		cria uma rota que responda a um POST   	   |
  +------------------------------------------------+*/
router.route('/usuarios')
//		POST para usuario (CREATE)	  
	.post(function(req,res){
		var usuario = new Usuario();
		usuario.nome = req.body.nome;
		usuario.sobrenome = req.body.sobrenome;
		usuario.apelido = req.body.apelido;
		usuario.sexo = req.body.sexo;
		usuario.email = req.body.email;
		usuario.agendamento = req.body.agendamento;

		usuario.save(function(error){
			if (error)
				res.send("Erro ao tentar salvar um novo usuário " + error);

			res.status(201).json({"message":"Usuário inserido com sucesso"});
		});
	})
/*+---------------------------------------------------+
  |		GET retornará todos os usuários cadastrados	  |
  +---------------------------------------------------+*/
	.get(function(req, res){

		Usuario.find(function(err, users){
			if(err)
				res.send(err);

			res.status(200).json({
				message:"Return all users",
				todosUsuarios:users
			});
		});
	});
/*+--------------------------------------------+
  |				Rota de Produto 			   |
  |			  GetById de Produto			   |
  +--------------------------------------------+*/
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
/*+------------------------------------------------+
  |				Rota de Produto 				   |
  |			Atualização OR Update - PUT, 	   	   |
  +------------------------------------------------+*/
//ex:localhost:8000/api/produtos/productId
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
/*+------------------------------------------------+
  |				Rota de Produto 				   |
  |			Remover OR delete - DELETE,  	   	   |
  +------------------------------------------------+*/
//ex:localhost:8000/api/produtos/productId
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
/*+------------------------------------------------+
  |				Rota de Usuario 				   |
  |		cria uma rota que responda a um POST   	   |
  +------------------------------------------------+*/
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
/*+---------------------------------------------------------------------------------------+
  |		Criando vinculo da app com o motor de rotas, tudo que chegar vincula ao express	  | 
  |		Definindo uma rotapadrão para as minhas apis									  |
  +---------------------------------------------------------------------------------------+*/
app.use('/api', router);
//lsitem serve para escutar a porta
app.listen(process.env.port || 3000, function(){
	console.log("API up and running!",this.address().port, app.settings.env);

});


console.log("API up and running! on port " + port);