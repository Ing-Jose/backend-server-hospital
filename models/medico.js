var mongoose = require('mongoose');//para trabajar con mongoose

//utilizando  el pluging intalado npm install --save mongoose-unique-validator
var uniqueValidator = require('mongoose-unique-validator');

var Schema = mongoose.Schema;

//definiendo el usuario schema (nombre de la coleccion en singular seguido de schema)
/**new Schema() funcion que recibe un objeto de javascript 
 * con la configuracion de lo que vamos aguardar en el schema
*/
var medicoSchema = new Schema({
    nombre: { type: String, required: [ true, 'El nombre es necesario' ]},
    img: { type: String, required: false},
    usuario: { type: Schema.Types.ObjectId, ref: 'Usuario',required:true },
    hospital: { type: Schema.Types.ObjectId, ref: 'Hospital',required:[true,'El Hospital es un campo obligatorio'] },
}, { collection: 'medicos' });
/** exportando el archivo para poder utilizar el schema,
 * mongoose.model('Nombre como se utilizara por fuera',nombre del schema);
*/
// medicoSchema.plugin(uniqueValidator,{message:'El {PATH} debe ser único'});
module.exports = mongoose.model('Medico',medicoSchema);