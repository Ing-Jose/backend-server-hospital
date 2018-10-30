// Importandos liibrerias 
var express = require('express');
var mongoose = require('mongoose');

//Inicialización de variables
var app = express();

//Importar rutas 
var appRoutes = require('./routes/app');
var usarioRoutes = require('./routes/usuario');
var loginRoutes = require('./routes/login');
var hospitalRoutes = require('./routes/hospital');
var medicoRoutes = require('./routes/medico');

//Conexion a la DB
mongoose.connection.openUri('mongodb://localhost:27017/hospitalDB', { useNewUrlParser: true },(err,res) => {
    if (err) throw err; //se detiene todo el proceso
    console.log('Base de datos \x1b[32m%s\x1b[0m', 'online')
});
mongoose.set('useCreateIndex', true);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//Rutas
app.use('/usuario',usarioRoutes);
app.use('/hospital',hospitalRoutes);
app.use('/medico',medicoRoutes);
app.use('/login',loginRoutes);
app.use('/',appRoutes);

/** para dar color a la palabra online \x1b[32m%s\x1b[0m */
//escuchar peticiones 
app.listen(3000, () => {
    console.log('Express server puerto 3000: \x1b[32m%s\x1b[0m', 'online')
});

