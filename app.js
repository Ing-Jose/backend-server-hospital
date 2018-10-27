// Importandos liibrerias 
var express = require('express');
var mongoose = require('mongoose');

//Inicialización de variables
var app = express();

//Conexion a la DB
mongoose.connection.openUri('mongodb://localhost:27017/hospitalDB', { useNewUrlParser: true },(err,res) => {
    if (err) throw err; //se detiene todo el proceso
    console.log('Base de datos \x1b[32m%s\x1b[0m', 'online')
})


//Rutas
app.get('/', ( req, res, next ) =>{
    res.status(200).json({
        ok: true,
        mensaje: 'Petición realizada correctamente'
    })
});

/** para dar color a la palabra online \x1b[32m%s\x1b[0m */
//escuchar peticiones 
app.listen(3000, () => {
    console.log('Express server puerto 3000: \x1b[32m%s\x1b[0m', 'online')
});

