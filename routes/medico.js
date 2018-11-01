var express = require('express');

var mdAutenticacion = require('../middlewares/autenticacion'); 

var app = express();

//importando el modelo de medico
var Medico = require('../models/medico');

//Rutas
/** ======================================================
 *  Obtener todos los medicos
 * =====================================================*/
app.get('/', (req, res,) => {
    var desde = req.query.desde || 0;
    desde = Number(desde);
    //usuando el modelo de usuario
    /** mostrando no todos los campos de medico */
    Medico.find({})
        .populate('usuario','nombre email') //para taar la informacion de la coleccion de medico pero solo el nombre y email
        .populate('hospital','nombre')
        .skip(desde) // desde donde comenzara inglremento de 5 en 5
        .limit(5) //limitar cantidad a mostrar
        .exec(( err, medicos ) => {
            // en caso que la consulta tenga algun error
            if (err) { 
                // con el return cuando se dispara la funcion hasta aca queda el procedimiento
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error al cargar los medicos',
                    errors: err
                });
            }
            Medico.count({}, (err, conteo) => {
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
                    medicos: medicos
                });
            });
        });
    
});


/** ======================================================
 *  Actualizar un medico
 * =====================================================*/
app.put('/:id', mdAutenticacion.verificaToken, (req, res) => {
    var id = req.params.id;
    var body = req.body; //extrayendo el body
    //buscando al medico
    Medico.findById(id, (err, medico) => {
        // en caso que la consulta tenga algun error
        if (err) {
            // con el return cuando se dispara la funcion hasta aca queda el procedimiento
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar medico',
                errors: err
            });
        }
        // en caso que no encontremos ningun usuario con ese id
        if (!medico) {
            // con el return cuando se dispara la funcion hasta aca queda el procedimiento
            return res.status(400).json({
                ok: false,
                mensaje: 'El Medico con el id ' + id + ' No existe',
                errors: { message: 'No existe un medico con ese ID' }
            });
        }
        //encontro el Medico ya existe trabajamos con el pasando los parametros
        medico.nombre = body.nombre;
        medico.usuario = req.usuario._id;
        medico.hospital = body.hospital;

        // guardando
        medico.save((err, medicoGuardado) => {
            // en caso que la consulta tenga algun error
            if (err) {
                // con el return cuando se dispara la funcion hasta aca queda el procedimiento
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar medico',
                    errors: err
                });
            }
            res.status(200).json({
                ok: true,
                medico: medicoGuardado
            });
        });
    });
    // res.status(200).json({
    //     ok: true,
    //     medico: 'medicoGuardado',
    //     body: body
    // });
});


/** ======================================================
 *  Crear medico
 * =====================================================*/
app.post('/',mdAutenticacion.verificaToken,( req, res ) => {

    var body = req.body; //extrayendo el body
   
    //Creando el objeto de tipo usuario
    var medico = new Medico({
        nombre: body.nombre,
        usuario: req.usuario._id,
        hospital: body.hospital, 
    });
    //guardando el medico
    medico.save((err, usuarioGuardado) => {
        //en caso que la consulta tenga algun error
        if (err) {
            //con el return cuando se dispara la funcion hasta aca queda el procedimiento
            return res.status(400).json({
                ok: false,
                mensaje: 'Error crear medico',
                errors: err
            });
        }
        //arreglo de todos los usuarios
        res.status(201).json({
            ok: true,
            usuario: usuarioGuardado
        });
    });
    
});

/** ======================================================
 *  Eliminar un medico
 * =====================================================*/
app.delete('/:id', mdAutenticacion.verificaToken,(req, res)=>{
    var id = req.params.id;
    Medico.findByIdAndRemove(id,(err,medicoBorrado)=>{
        //en caso que la consulta tenga algun error
        if (err) {
            //con el return cuando se dispara la funcion hasta aca queda el procedimiento
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al borrar medico',
                errors: err
            });
        }
        //en caso que la consulta tenga algun error
        if (!medicoBorrado) {
            //con el return cuando se dispara la funcion hasta aca queda el procedimiento
            return res.status(400).json({
                ok: false,
                mensaje: 'No existe el medico a borrar con ese id',
                errors: { message: 'No existe un medico con ese ID'}
            });
        }
        res.status(200).json({
            ok: true,
            medico: medicoBorrado
        });

    });
});
//exportando todo el app
module.exports = app;