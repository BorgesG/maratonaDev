//Configurar o servidor
const express = require("express")
const server = express()

//Configurar o servidor para mostrar arquivos estaticos
server.use(express.static('public'))
//habilitar body do formulário
server.use(express.urlencoded({extended:true}))

//Configurar conexão com o banco de dados

const Pool = require('pg').Pool
const db = new Pool({
    user :'postgres',
    password : '0000',
    host: 'localhost',
    port: '5432',
    database: 'doe'

})

//Configurando a templete engening

const nunjucks = require("nunjucks")
nunjucks.configure("./", {
    express : server,
    noCache : true
})


//Configurar apresentação da página
server.get("/", function(req, res){


    db.query("SELECT * FROM donors", function(err, result){
        if(err) return res.send("Erro de banco de dados")

        
        const donors = result.rows
    return res.render('index.html', {donors} )
    })
    
  

})

server.post("/", function(req, res){
    //pegar dados do formulário
    const name = req.body.name
    const email = req.body.email
    const blood = req.body.blood



if(name =="" || email == "" || blood == "" ) {
return res.send('Todos os campos são obrigatórios.')
}

    //Adicionar valores no banco de dados
    

    const query = `
    INSERT INTO donors ("name", "email", "blood")
     VALUES($1, $2, $3)`

    const values = [name, email, blood]
    db.query(query, values, function(err){
        if(err) return res.send('Erro no banco de dados')
    })


    return res.redirect("/")

})

// Ligar o servidor e permitir acesso na porta 3000
server.listen(3000, function(){
    console.log('Iniciei o servidor!')
})
