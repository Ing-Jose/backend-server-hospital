//para trabajar con mongoose
var mongoose = require('mongoose');
//utilizando  el pluging intalado npm install --save mongoose-unique-validator
var uniqueValidator = require('mongoose-unique-validator');

var Schema = mongoose.Schema;
/**
 * para controlar los roles, creamos un objeto
 * con los unicos roles aceptables, Si no esta 
 * en la lista mandamos un mesaje de error
 */
var rolesValidos = {
    values: ['ADMIN_ROLE','USER_ROLE'],
    message:'{VALUE} no es un rol permitido'
}
//definiendo el usuario schema (nombre de la coleccion en singular seguido de schema)
/**new Schema() funcion que recibe un objeto de javascript 
 * con la configuracion de lo que vamos aguardar en el schema
*/
var usuarioSchema = new Schema({
    nombre: { type: String, required: [ true, 'El nombre es necesario' ]},
    email: { type: String, unique: true, required: [true, 'El correo es necesario']},
    password: { type: String, required: [true, 'La contaseña es necesario'] },
    img: { type: String, required: false},
    rol: { type: String, required: true, default: 'USER_ROLE', enum: rolesValidos},
});
/** exportando el archivo para poder utilizar el schema,
 * mongoose.model('Nombre como se utilizara por fuera',nombre del schema);
*/
usuarioSchema.plugin(uniqueValidator,{message:'El {PATH} debe ser único'});
module.exports = mongoose.model('Usuario',usuarioSchema);