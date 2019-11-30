const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

mongoose.connect('mongodb+srv://root:root@node-rest-kw9fc.mongodb.net/test?retryWrites=true&w=majority',
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => console.log('Banco de Dados Conectado'))
    .catch(err => {
        console.log(`Erro de conexão do Banco de Dados: ${err.message}`);
    });

require("./src/controllers/authController")(app);

app.listen(3001);

