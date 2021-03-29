const errors=require('../exception');

const errorsDB=(err)=>{
let message, code;
code=err.code;
switch (err.code) {
    case 'PROTOCOL_CONNECTION_LOST':
        message='Conexión de la base de datos fue cerrada';
        break;
    case 'ER_CON_COUNT_ERROR':
        message='La base de datos tiene muchas conexiones';
        break;
    case 'ECONNREFUSED':
        message='Conexión de la base de datos fue rechazada';
        break;
    case 'ER_DUP_ENTRY':
        message= {error:err.sqlMessage};
        break;
    default:
        message=err.sqlMessage;
        break;
};
console.log('errorsDB',message);
return errors(500,'DB',message,'');
};

module.exports=errorsDB;