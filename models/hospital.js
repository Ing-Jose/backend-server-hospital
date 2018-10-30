var mongoose = require('mongoose');//para trabajar con mongoose

// var uniqueValidator = require('mongoose-unique-validator');//utilizando  el pluging intalado npm install --save mongoose-unique-validator

var Schema = mongoose.Schema;

//definiendo el hospital schema (nombre de la coleccion en singular seguido de schema)
/**new Schema() funcion que recibe un objeto de javascript 
 * con la configuracion de lo que vamos aguardar en el schema
*/
/** 
 * Schema.Types.ObjectId
 * esto es utilizado para indicarle a mongoose, que este campo
 * es una relacion con otra coleccion y la referencia es unico
 * al final este campo nos dira que usuario creo el registro,
 * se guardar solo el id
 */
var hospitalSchema = new Schema({
    nombre: { type: String, required: [true, 'El nombre es necesario'] },
    img: { type: String, required: false },
    usuario: { type: Schema.Types.ObjectId, ref: 'Usuario' }
}, { collection: 'hospitales' });

/** exportando el archivo para poder utilizar el schema,
 * mongoose.model('Nombre como se utilizara por fuera',nombre del schema);
*/
// hospitalSchema.plugin(uniqueValidator, { message: 'El {PATH} debe ser único' });
module.exports = mongoose.model('Hospital', hospitalSchema);