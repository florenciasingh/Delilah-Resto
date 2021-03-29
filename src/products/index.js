const pool = require('../db/database');
const errors=require('../exception');

const queryAll = 'SELECT * FROM PRODUCTS';
const queryById = 'SELECT * FROM PRODUCTS where productid= ?';
const updProduct = 'UPDATE PRODUCTS SET ? WHERE productid= ?';
const insProduct = 'INSERT INTO PRODUCTS SET ? ';
const delProduct = 'DELETE FROM PRODUCTS WHERE productid=?';
const nextProductId = `SELECT IFNULL(CONCAT('PRO',LPAD(MAX(MID(productid,4,7))+1,7,'0')),'PRO0000001') productid FROM products`;

const getNextProductId = async () => {
    try {
        return await pool.poolConnection.query(nextProductId);
    } catch (error) {
        console.log(error);
        return errorsDB(error);
    }
};
const getProducts = async () => {
    try {
        return await pool.poolConnection.query(queryAll);
    } catch (error) {
        console.log(error);
        return errorsDB(error);
    }
};
const getProductById = async (productid) => {
    try {
        return await pool.poolConnection.query(queryById, productid);
    } catch (error) {
        console.log(error);
        return errorsDB(error);
    }
};
const updateProduct = async (data, id) => {
    try {
        const result= await pool.poolConnection.query(updProduct, [data, id]);
        if (result.affectedRows===0) return errors(404,'PUT','No se modificó el producto','');
        //errors
        return errors(200,'PUT','Se modificó el producto correctamente','');
    } catch (error) {
        console.log(error);
        return errorsDB(error);
    }
};
const createProduct = async (data) => {
    try {
        const productid = await getNextProductId();
        console.log(JSON.parse(JSON.stringify(productid[0].productid)));
        const insProd = {
            productid: JSON.parse(JSON.stringify(productid[0].productid)),
            name: data.name,
            photourl: data.photourl,
            unitprice: data.unitprice,
            favorites: data.favorites
        }

        return await pool.poolConnection.query(insProduct, [insProd]);
    } catch (error) {
        console.log(error);
        return errorsDB(error);
    }
};
const deleteProduct = async (productid) => {
    try {
        const result= await pool.poolConnection.query(delProduct, productid);
        if (result.affectedRows===0) return errors(404,'DEL','No se eliminó el producto','');
        //errors
        return errors(200,'DEL','Se eliminó el producto correctamente','');
    } catch (error) {
        console.log(error);
        return errorsDB(error);
    }
};
module.exports = {
    getProducts,
    getProductById,
    updateProduct,
    createProduct,
    deleteProduct
};