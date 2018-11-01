var express = require('express');
var fs = require('fs'); // para borrar 
var app = express();
//Rutas
app.get('/:tipo/:img', (req, res, next) => {
    
    var tipo = req.params.tipo;
    var img = req.params.img;
    var respo;
    var path = `./uploads/${ tipo }/${ img }`;

    fs.exists(path, existe => {
        if (!existe) {
            path = './assets/no-img.jpg';
        }
        res.sendfile(path);
    });
});
//exportando todo el app
module.exports = app;