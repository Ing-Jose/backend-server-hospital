var express = require('express');
//despues de instalar la libreria 
var fileUpload = require('express-fileupload');
var fs = require('fs'); // para borrar 

//Importando los modelos 
var Usuario = require('../models/usuario');
var Medico = require('../models/medico');
var Hospital = require('../models/hospital');

var app = express();
app.use(fileUpload());//middleware
//Rutas
app.put('/:tipo/:id', (req, res, next) => {
    
    //losrecib por el url y los asigno a variables
    var tipo = req.params.tipo;
    var id = req.params.id;

    //tipos validos de coleciones
    var tipoValidos = ['hospitales', 'medicos', 'usuarios'];
    if (tipoValidos.indexOf(tipo)<0) { // paso un tipo no valido
        return res.status(400).json({
            ok: false,
            mensaje: 'Tipo de colección no es válida',
            errors: { message: 'Tipo de colección no es válida'}
        });
    }

    if (!req.files) { //si no viene archivo en el req
        return res.status(400).json({
            ok: false,
            mensaje: 'No selecciono nada',
            errors: {message: 'Debe seleccionar una imagen'}
        });
    }
    //validando que el rchivo sea una imagen
    var archivo = req.files.imagen;
    var nombreCortado = archivo.name.split('.');//para tomar la extencion del archivo .jpg .jpge etc
    var extensionArchivo = nombreCortado[nombreCortado.length - 1];
    
    // solo estas extenciones aceptamos
    var extensionesValidadas = ['png','jpg','gif','jpeg'];

    if (extensionesValidadas.indexOf( extensionArchivo) < 0) { //si retorna -1 no encontro la extencion en el arreglo
        return res.status(400).json({
            ok: false,
            mensaje: 'Extension no válida',
            errors: { message: 'Las extensiones validadas son '+extensionesValidadas.join(', ') }
        });
    }
    
    //creando un nombre personalizado (ID del usuario - numero aleatorio)
    var nombreArchivo = `${id}-${new Date().getMilliseconds()}.${extensionArchivo}`;

    //mover el archivo
    var path = `./uploads/${tipo}/${nombreArchivo}`;
    archivo.mv( path, err => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al mover archivo',
                errors: err
            });
        }

        subiPorTipo(tipo, id, nombreArchivo, res)

        
    });
    
});


/**funcion que nos permite saber de acuerdo
 * el tipo en la db a quien se le debe subir
 */
function subiPorTipo(tipo,id,nombreArchivo,res) {
    //validacion para usuario
    switch (tipo) {
        case 'usuarios':
            Usuario.findById(id, (err, usuario) => {
                //en caso que id no exista
                if (!usuario) {
                    return res.status(400).json({
                        ok: false,
                        mensaje: 'Usiario no existe',
                        errors: { message: 'TUsiario no existe' }
                    }); 
                }
                //tomando el path viejo en caso que lo tenga
                var pathViejo = './uploads/usuarios/'+usuario.img;
                //si existe el pathViejo lo elimina 
                if (fs.existsSync(pathViejo)) {
                    fs.unlink(pathViejo);
                }
                usuario.img = nombreArchivo;
                //guardando
                usuario.save((err,usuarioactualizado)=>{
                    usuarioactualizado.password=':)'
                    return res.status(200).json({
                        ok: true,
                        mensaje: 'Imagen de usuario actualizada',
                        usuarioactualizado: usuarioactualizado
                    });
                });

            });
            break;
        case 'medicos':
            Medico.findById(id, (err, medico) => {
                //en caso que id no exista
                if (!medico) {
                    return res.status(400).json({
                        ok: false,
                        mensaje: 'Medico no existe',
                        errors: { message: 'Medico no existe' }
                    });
                }
                //tomando el path viejo en caso que lo tenga
                var pathViejo = './uploads/medicos/'+medico.img;
                //si existe el pathViejo lo elimina 
                if (fs.existsSync(pathViejo)) {
                    fs.unlink(pathViejo);
                }
                medico.img = nombreArchivo;
                //guardando
                medico.save((err,medicoActualizado)=>{
                    
                    return res.status(200).json({
                        ok: true,
                        mensaje: 'Imagen de medico actualizada',
                        medicoActualizado: medicoActualizado
                    });
                });

            });
            break;
        case 'hospitales':
            Hospital.findById(id, (err, hospital) => {
                //en caso que id no exista
                if (!hospital) {
                    return res.status(400).json({
                        ok: false,
                        mensaje: 'Hospital no existe',
                        errors: { message: 'Hospital no existe' }
                    });
                }
                //tomando el path viejo en caso que lo tenga
                var pathViejo = './uploads/hospitales/'+hospital.img;
                //si existe el pathViejo lo elimina 
                if (fs.existsSync(pathViejo)) {
                    fs.unlink(pathViejo);
                }
                hospital.img = nombreArchivo;
                //guardando
                hospital.save((err,hospitalActualizado)=>{
                    
                    return res.status(200).json({
                        ok: true,
                        mensaje: 'Imagen de hospital actualizada',
                        hospitalActualizado: hospitalActualizado
                    });
                });

            });
            break;
    
        default:
            return res.status(400).json({
                ok: false,
                mensaje: 'Los tipos para aculizar imagen sólo son usuarios, medicos y hospitales',
                errors: { message: 'Tipo de tabla/coleccion no válido' }
            }); 
    }
}
//exportando todo el app
module.exports = app;