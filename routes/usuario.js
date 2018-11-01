var express = require('express');
/** luego de instalar la libreria
 * npm install bcryptjs para trabajar con datos encriptado
 */
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken'); //para generar token, despues instalarla la libreria npm install jsonwebtoken --save

// var SEED = require('../config/config').SEED; //importando la variable 
var mdAutenticacion = require('../middlewares/autenticacion'); 

var app = express();

//importando el modelo de usuario
var Usuario = require('../models/usuario');

//Rutas
/** ======================================================
 *  Obtener todos los usuarios
 * =====================================================*/
app.get('/', (req, res,) => {
    var desde = req.query.desde || 0;
    desde=Number(desde);
    //usuando el modelo de usuario
    /** mostrando no todos los campos de usuario*/
    Usuario.find({},'nombre email img rol')
        .skip(desde) // desde donde comenzara inglremento de 5 en 5
        .limit(5) //limitar cantidad a mostrar
        .exec(( err, usuarios ) => {
            //en caso que la consulta tenga algun error
            if (err) { 
                //con el return cuando se dispara la funcion hasta aca queda el procedimiento
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error cargando usuario',
                    errors: err
                });
            }
            Usuario.count({},(err,conteo) => {
                if (err) {
                    //con el return cuando se dispara la funcion hasta aca queda el procedimiento
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error al contar usuario',
                        errors: err
                    });
                }
                //sino sucede ningun error
                //arreglo de todos los usuarios
                res.status(200).json({
                    ok: true,
                    total: conteo,
                    usuarios: usuarios
                });
            });
            
        });
    
});




/** ======================================================
 *  Actualizar un usuarios
 * =====================================================*/
app.put('/:id', mdAutenticacion.verificaToken,(req, res) => {
    var id = req.params.id;
    var body = req.body; //extrayendo el body
    //buscando al usuario
    Usuario.findById(id, (err, usuario) => {
        //en caso que la consulta tenga algun error
        if (err) {
            //con el return cuando se dispara la funcion hasta aca queda el procedimiento
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar usuario',
                errors: err
            });
        }
        // en caso que no encontremos ningun usuario con ese id
        if (!usuario) {
            //con el return cuando se dispara la funcion hasta aca queda el procedimiento
            return res.status(400).json({
                ok: false,
                mensaje: 'El usuario con el id ' + id + ' No existe',
                errors: { message: 'No existe un usuario con ese ID' }
            });
        }
        //encontro el usario ya existe trabajamos con el pasando los parametros
        usuario.nombre = body.nombre;
        usuario.email = body.email;
        usuario.rol = body.rol;
        /**no cambiaremos ni la imagen ni la contraseña */
        // usuario.password = bcrypt.hashSync(body.password, 10),
        // usuario.img = body.img,

        //guardando
        usuario.save((err, usuarioGuardado) => {
            //en caso que la consulta tenga algun error
            if (err) {
                //con el return cuando se dispara la funcion hasta aca queda el procedimiento
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar usuario',
                    errors: err
                });
            }
            //para no mostrar la contraseña
            usuarioGuardado.password = ':)';
            res.status(200).json({
                ok: true,
                usuario: usuarioGuardado
            });
        });
    });
});
/** ======================================================
 *  Crear todos los usuarios
 * =====================================================*/
app.post('/',mdAutenticacion.verificaToken,( req, res ) => {

    var body = req.body; //extrayendo el body
   
    //Creando el objeto de tipo usuario
    var usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password,10),
        img: body.img,
        rol: body.rol, 
    });
    //guardando el usuario
    usuario.save((err, usuarioGuardado) => {
        //en caso que la consulta tenga algun error
        if (err) {
            //con el return cuando se dispara la funcion hasta aca queda el procedimiento
            return res.status(400).json({
                ok: false,
                mensaje: 'Error crear usuario',
                errors: err
            });
        }
        usuarioGuardado.password=':)';
        //arreglo de todos los usuarios
        res.status(201).json({
            ok: true,
            usuario: usuarioGuardado,
            // usuarioToken: req.usuario
        });
    });
    
});

/** ======================================================
 *  Eliminar un usuarios
 * =====================================================*/
app.delete('/:id', mdAutenticacion.verificaToken,(req, res)=>{
    var id = req.params.id;
    Usuario.findByIdAndRemove(id,(err,usuarioBorrado)=>{
        //en caso que la consulta tenga algun error
        if (err) {
            //con el return cuando se dispara la funcion hasta aca queda el procedimiento
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al borrar usuario',
                errors: err
            });
        }
        //en caso que la consulta tenga algun error
        if (!usuarioBorrado) {
            //con el return cuando se dispara la funcion hasta aca queda el procedimiento
            return res.status(400).json({
                ok: false,
                mensaje: 'No existe el usuario  a borrar con ese id',
                errors: { message: 'No existe un usuario con ese ID'}
            });
        }
        res.status(200).json({
            ok: true,
            usuario: usuarioBorrado
        });

    });
});
//exportando todo el app
module.exports = app;