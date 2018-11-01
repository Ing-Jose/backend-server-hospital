var express = require('express');
var app = express();
/** Importamos los modelos para poder buscar*/
var Hospital = require('../models/hospital');
var Medico = require('../models/medico');
var Usuario = require('../models/usuario');

//Rutas
/** ======================================================
 *  Busqueda espeficica
 * =====================================================*/
app.get('/coleccion/:tabla/:busqueda', (req, res)=>{
    var busqueda = req.params.busqueda;
    var tabla = req.params.tabla;
    var expreReg = new RegExp(busqueda, 'i')//crando una exprecion regular, la 'i' para que sea incencible a la mayuscula y minusc
    var promesa;

    switch (tabla) {
        case 'usuarios':
            promesa=buscarusuarios(busqueda, expreReg);
            break;
    
        case 'medicos':
            promesa=buscarMedicos(busqueda, expreReg);
            break;
    
        case 'hospitales':
            promesa=buscarHospitales(busqueda, expreReg);
            break;
    
        default:
            return res.status(400).json({
                ok: false,
                mensaje: 'Los tipos de busqueda sólo son usuario, medicos y hospitales',
                error: {message: 'Tipo de tabla/coleccion no válido'}
            });        
    }
    //si todo esta correcto
    promesa.then(data=>{
        res.status(200).json({
            ok: true,
            [tabla]:data
        });   
    });
});

/** ======================================================
 *  Busqueda general
 * =====================================================*/
app.get('/todo/:busqueda', (req, res, next) => {
    var busqueda = req.params.busqueda;
    var expreReg = new RegExp( busqueda,'i' )//crando una exprecion regular, la 'i' para que sea incencible a la mayuscula y minusc
    
    Promise.all([
            buscarHospitales(busqueda, expreReg), 
            buscarMedicos(busqueda, expreReg), 
            buscarusuarios(busqueda, expreReg)  
        ])
        .then(respuestas => {
            res.status(200).json({
                ok: true,
                hospitales: respuestas[0],
                medicos: respuestas[1],
                usuarios: respuestas[2]
            });
        })
   

});

function buscarHospitales(busqueda, expReg) {
    return new Promise((resolve, reject) =>{
        Hospital.find({ nombre: expReg })
        .populate('usuario', 'nombre email')
        .exec((err, hospitales) => {
            
            if (err) {
                reject('Error al cargar Hospitales', err);
            }else{
                resolve(hospitales);
            }
        });
    });
}
function buscarMedicos(busqueda, expReg) {
    return new Promise((resolve, reject) =>{
        Medico.find({ nombre: expReg })
            .populate('usuario', 'nombre email')
            .populate('hospital')
            .exec( (err, medicos) => {
                if (err) {
                    reject('Error al cargar Medicos', err);
                }else{
                    resolve(medicos);
                }
            });
    });
}
function buscarusuarios(busqueda, expReg) {
    return new Promise((resolve, reject) =>{
        Usuario.find({},'nombre email rol')
            .or([{ 'nombre': expReg }, { 'email': expReg }])
            .exec((err, usuarios)=>{
                if (err) {
                    reject('Error al cargar Usuario', err);
                }else{
                    resolve(usuarios);
                }
            })
        });
    
}
//exportando todo el app
module.exports = app;