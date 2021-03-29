'use strict';
require('dotenv').config();
//Convierte callback a promesas
const { promisify }=require('util');

const mysqlDB=require('mysql');
const  errorsDB =require('./errDB');

const dbConfig = {
    host: process.env.DBHOST,
    user: process.env.DBUSER,
    password:  process.env.DBPASS,
    database: process.env.DBNAME
  };

const poolConnection=mysqlDB.createPool(dbConfig);

poolConnection.getConnection((err, connection)=>{
  if (err) return errorsDB(err);
  if(connection) connection.release();
  console.log('Base de datos conectada');
  return;
});

//Convierte a promesa pool query, esto permite usar async/await o promesas
poolConnection.query=promisify(poolConnection.query);


module.exports={ poolConnection };