//importar pacotes
var express = require('express');
var app = express();
var bodyParser = require('body-parser');

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

//Criando vinculo da app com o motor de rotas, tudo que chegar vincula ao express
//Definindo uma rotapadrão para as minhas apis
app.use('/api', router);


app.listen(port);
console.log("API up and running! on port " + port);