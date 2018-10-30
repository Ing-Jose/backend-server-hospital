var express = require('express');

var mdAutenticacion = require('../middlewares/autenticacion');

var app = express();

//importando el modelo de hospital
var Hospital = require('../models/hospital');

//Rutas
/** ======================================================
 *  Obtener todos los hospitales
 * =====================================================*/
app.get('/', (req, res, ) => {
    //usuando el modelo de hospital
    /** mostrando no todos los campos de */
    Hospital.find({}).exec((err, hospitales) => {
        //en caso que la consulta tenga algun error
        if (err) {
            //con el return cuando se dispara la funcion hasta aca queda el procedimiento
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al cargar hospitales',
                errors: err
            });
        }
        //sino sucede ningun error
        //arreglo de todos los hospitales
        res.status(200).json({
            ok: true,
            hospitales: hospitales
        });
    });
});

/** ======================================================
 *  Actualizar un hospital
 * =====================================================*/
app.put('/:id', mdAutenticacion.verificaToken, (req, res) => {
    var id = req.params.id;
    var body = req.body; //extrayendo el body
    //buscando al hospital
    Hospital.findById(id, (err, hospital) => {
        // en caso que la consulta tenga algun error
        if (err) {
            // con el return cuando se dispara la funcion hasta aca queda el procedimiento
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar Hospital',
                errors: err
            });
        }
        // en caso que no encontremos ningun usuario con ese id
        if (!hospital) {
            // con el return cuando se dispara la funcion hasta aca queda el procedimiento
            return res.status(400).json({
                ok: false,
                mensaje: 'El Hospital con el id ' + id + ' No existe',
                errors: { message: 'No existe un Hospital con ese ID' }
            });
        }
        //encontro el Hospital ya existe trabajamos con el pasando los parametros
        hospital.nombre = body.nombre;
        hospital.usuario = req.usuario._id;
        
        // guardando
        hospital.save((err, hospitalGuardado) => {
            // en caso que la consulta tenga algun error
            if (err) {
                // con el return cuando se dispara la funcion hasta aca queda el procedimiento
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar hospital',
                    errors: err
                });
            }
            res.status(200).json({
                ok: true,
                hospital: hospitalGuardado
            });
        });
    });
});

/** ======================================================
 *  Crear un Hospital
 * =====================================================*/
app.post('/', mdAutenticacion.verificaToken, (req, res) => {

    var body = req.body; //extrayendo el body

    // Creando el objeto de tipo hospital
    var hospital = new Hospital({
        nombre: body.nombre,
        usuario:req.usuario._id
    });
    // guardando el hospital
    hospital.save((err, hospitalGuardado) => {
        // en caso que la consulta tenga algun error
        if (err) {
            // con el return cuando se dispara la funcion hasta aca queda el procedimiento
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al crear hospital',
                errors: err
            });
        }
        res.status(201).json({
            ok: true,
            hospital: hospitalGuardado
        });
    });

});

/** ======================================================
 *  Eliminar un hospital
 * =====================================================*/
app.delete('/:id', mdAutenticacion.verificaToken, (req, res) => {
    var id = req.params.id;
    Hospital.findByIdAndRemove(id, (err, hospitalBorrado) => {
        // en caso que la consulta tenga algun error
        if (err) {
            // con el return cuando se dispara la funcion hasta aca queda el procedimiento
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al borrar hospital',
                errors: err
            });
        }
        // en caso que la consulta tenga algun error
        if (!hospitalBorrado) {
            // con el return cuando se dispara la funcion hasta aca queda el procedimiento
            return res.status(400).json({
                ok: false,
                mensaje: 'No existe el hospital a borrar con ese id',
                errors: { message: 'No existe un hospital con ese ID' }
            });
        }
        res.status(200).json({
            ok: true,
            hospital: hospitalBorrado
        });

    });
});
//exportando todo el app
module.exports = app;