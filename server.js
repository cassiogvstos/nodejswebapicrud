//importar pacotes
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var Servico = require('./app/models/service');
var Usuario = require('./app/models/user');
var Service = require('/app/models/service');

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
	/*OBSERVAÇÃO - Para que a API tenha autorização de acessar ou ser acessada por outro host precisa-se 
		redefinir o Header*/
	// Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8100');

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
				message:"Okay usuário encontrado",
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
				todosServico:users
			});
		});
	});
/*+------------------------------------------------+
  |				Rota de Servico 				   |
  |			  GetById de Servico				   |
  +------------------------------------------------+*/
router.route('/servicos/:serviceId')
//recebe o servico pela url
	.get(function(req, res){
		const id = req.params.serviceId;
//faz a busca no banco com o id cindo da url
	Servico.findById(id, function(err, service){
		if (err) {
			res.status(500).json({
				message:"Erro ao tentar encontrar servico, ID mal formado"
			});
		}
		else if (service == null) {
			res.status(400).json({
				message:"Serviço não encontrado"
			});
		}
		else{
			res.status(200).json({
				message:"Okay serviço encontrado",
				service: service
			});
		}
	});
})

/*+------------------------------------------------+
  |				Rota de Servico 				   |
  |			Atualização OR Update - PUT, 	   	   |
  +------------------------------------------------+*/
//ex:localhost:8000/api/servicos/serviceId
.put(function(req, res){
	const id = req.params.serviceId;
	Servico.findById(id, function(err, servico){
		if(err){
			res.status(500).json({
				message:"Id mal formado, erro ao tentar encontrar serviço"
			});
		}
		else if (servico == null) {
			res.status(400).json({
				message:"Serviço não encontrado"
			});
		}
		else{
			servico.tipo = req.body.tipo;
			servico.descricao = req.body.descricao;
			servico.preco = req.body.preco;
			servico.dataServico = req.body.dataServico;

			servico.save(function(error){
				if (error)
					res.send("Erro ao tentar atualizar o serviço " + error);	

				res.status(200).json({
					message:"Serviço atualizado com sucesso"
				});
			});			
		}
	});
})

/*+------------------------------------------------+
  |				Rota de Serviço 				   |
  |			Remover OR delete - DELETE,  	   	   |
  +------------------------------------------------+*/
//ex:localhost:8000/api/servicos/serviceId
.delete(function(req, res){
	Servico.findByIdAndRemove(req.params.serviceId, (err, service) => {
		if (err) return res.status(500).send(err);

		const response = {
			message:"Serviço removido com sucesso",
			id: servico.id
		};
		return res.status(200).send(response);
	});
});


/*+------------------------------------------------+
<<<<<<< HEAD
  |				Rota de Servico 				   |
=======
  |				Rota de Produtos 				   |
>>>>>>> c2bd4294f7c33c02915f9de1085ca738fb27894c
  |		cria uma rota que responda a um POST   	   |
  +------------------------------------------------+*/
router.route('/servicos')
//		POST para servico (CREATE)	  
	.post(function(req,res){
<<<<<<< HEAD
		var servico = new Servico();
		servico.tipo = req.body.tipo;
		servico.descricao = req.body.descricao;
		servico.preco = req.body.preco;
		servico.dataServico = req.body.dataServico;
=======
		var produto = new Produto();
		produto.nome = req.body.nome;
		produto.preco = req.body.preco;

		produto.descricao = req.body.descricao;

>>>>>>> c2bd4294f7c33c02915f9de1085ca738fb27894c

		servico.save(function(error){
			if (error)
				res.send("Erro ao tentar salvar um novo serviço " + error);

			res.status(201).json({"message":"Serviço inserido com sucesso"});
		});
	})

	/*+---------------------------------------------------+
  |		GET retornará todos os serviço cadastrados	  |
  +---------------------------------------------------+*/
	.get(function(req, res){

		Servico.find(function(err, services){
			if(err)
				res.send(err);

			res.status(200).json({
				message:"Return all services",
				todosServico:services
			});
		});
	});

/*+---------------------------------------------------------------------------------------+
  |		Criando vinculo da app com o motor de rotas, tudo que chegar vincula ao express	  | 
  |		Definindo uma rotapadrão para as minhas apis									  |
  +---------------------------------------------------------------------------------------+*/
app.use('/api', router);
//lsitem serve para escutar a porta
app.listen(port);
console.log("API up and running! on port " + port);