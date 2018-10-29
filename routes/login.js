var express = require('express');
/** luego de instalar la libreria
 * npm install bcryptjs para trabajar con datos encriptado
 */
var bcrypt = require('bcryptjs'); //para comparar el que se ingresa con el recuperado
var jwt = require('jsonwebtoken'); //para generar token

var SEED = require('../config/config').SEED; //importando la variable 

var app = express(); //para trabajar con la DB

//importando el modelo de usuario
var Usuario = require('../models/usuario'); // para trabajar con la coleccion de usuario

app.post('/',(req, res)=>{
    //para recibir el correo y la contraseña
    var body = req.body; //extrayendo el body
    /** 
     * verificando si existe el usuario con esos datos
     * como el emial es unico, me debe retornar un unico user
    */

    Usuario.findOne({ email: body.email }, ( err, usuarioBD )=>{
        //en caso que la consulta tenga algun error
        if (err) {
            //con el return cuando se dispara la funcion hasta aca queda el procedimiento
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar usuario',
                errors: err
            });
        }

        //sino existe un suario con ese correo
        if (!usuarioBD) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Credenciales incorrectas - email',
                // errors: err
            });
        }

        //verifiacando la contraseña 
        if ( !bcrypt.compareSync(body.password,usuarioBD.password)) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Credenciales incorrectas - pass',
                // errors: err
            });
        }
        
        //quitando la contraseña 
        usuarioBD.password = ':)';

        //creando un token!!! intslamos la libreria npm install jsonwebtoken --save
        /** sign() recibe varios parametros el primero la data, el payload,
         * luego la semilla, para hacer unico al toke, luego la fecha de expiracion
         * del token, puede ser infinito 14400 equivalen a 4 horas
        */
        var token = jwt.sign({ usuario: usuarioBD }, SEED, {expiresIn:14400})

        res.status(200).json({
            ok: true,
            usuario: usuarioBD,
            token: token,
            id: usuarioBD._id
        });
    });
});


//exportando todo el app
module.exports = app;