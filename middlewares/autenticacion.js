var jwt = require('jsonwebtoken'); //para generar token, despues instalarla la libreria npm install jsonwebtoken --save

var SEED = require('../config/config').SEED; //importando la variable 

exports.verificaToken = function(req,res,next){
    var token = req.query.token; //recibiendo el token por url
    /** verify() el primer parametro es el toke que recibe de 
     * la aplicacion, siguiente parametro el seed, el tercer 
     * parametro el collback, contiene un error y informacion 
     * del usuario*/
    jwt.verify(token, SEED, (err, decoded) => {
        //en caso que la consulta tenga algun error
        if (err) {
            //con el return cuando se dispara la funcion hasta aca queda el procedimiento
            return res.status(401).json({
                ok: false,
                mensaje: 'Token incorrepto',
                errors: err
            });
        }
        /** poner el usuario autenticado en cualquier peticion donde se 
         * utilece esta funcion 
        */
        req.usuario = decoded.usuario;
        next(); //para que continue si el token es correcto
        
        // res.status(400).json({
        //     ok: false,
        //     mensaje: 'Token incorrepto',
        //     decoded: decoded
        // });
    });
}
/** ======================================================
 *  middleware verificar token, de aca en adelante las rutas
 * tiene que pasar por esta condicion, necesitan el token
 * =====================================================*/
