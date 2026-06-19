const express = require("express");
const app = express();
const porta = 3000;

//indicação de pasta de aruivos estáticos - css, js, img 
app.use(express.static("./app/public"));

//configuar o ejs como mecanismo de renderização
app.set("view engine","ejs");
//configurar a pasta das views - html->ejs
app.set("views","./app/views");


//SEMPRE ANTES DA REQUISIÇÃO DAS ROTAS
//consfiguar o envio de dados e analise de dados na requisição
//configurar o payload para formato JSON (API)
app.use(express.json());
//consfiguar o payload para formato URLencoded - (form html -> array, objeto, json)
app.use(express.urlencoded({extended:true}));


//requisitar arquivos de rotas
const rota = require("./app/routes/router");
// indicar o local de uso das rotas
app.use("/", rota);
// ("/") indica a raiz do site 
// http://localhost:3000

//iniciar o servidor
app.listen(porta, ()=>{
    console.log(`Servidor on-line \nhttp://localhost:${porta}`)
})

