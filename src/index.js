"use strict";
const express = require('express'),
      app = express();

//Cors
const cors=require('cors');
//dotEnv
require('dotenv').config();

const port=process.env.PORT;

//Router
const authRouter= require('./routes/auth');
const usersRouter= require('./routes/users');
const productsRouter= require('./routes/products');
const ordersRouter= require('./routes/orders');




/********MIDDLEWARE********/
app.use(cors());
app.use(express.json());




const log=(req, res, next)=>{
    const {method, path, query, body}=req
    console.log(`${method} - ${path} - ${JSON.stringify(query)} - ${JSON.stringify(body)}`);
    next();
};
app.use(log)

app.use('/auth',authRouter);
app.use('/users',usersRouter);
app.use('/products',productsRouter);
app.use('/orders',ordersRouter);

app.use((err,req, res, next)=>{
    if(!err)
        return next();
    else
        return res.status(500).json({status: 'Error', mensaje:'Se ha producido un error inesperado.'});
});

app.listen(port, () => {
    console.log(`Servidor en ejecucion en el puerto: ${port}`);
});