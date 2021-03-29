const express = require('express');
const router = express.Router();
const {
    getProducts,
    getProductById,
    updateProduct,
    createProduct,
    deleteProduct
} = require('../products');
const {
    authenticateJWT,
    adminRoleValidation
} = require('../auth/authServer');

router.get('/', authenticateJWT, async (req, res) => {
    try {
        const result = await getProducts();
        if (result.length===0) return  res.status(404).json({error:'No existen productos'});
        res.status(200).json(result);
    } catch (error) {
        res.status(400).json({
            Message: error.sqlMessage
        });
    }
});
router.get('/:id', authenticateJWT, async (req, res) => {
    try {
        const result = await getProductById(req.params.id);
        res.status(200).json(result);
    } catch (error) {
        res.status(400).json({
            Message: error.sqlMessage
        });
    }
});
router.post('/', authenticateJWT, adminRoleValidation, async (req, res) => {
    try {
        const {
            name,
            photourl,
            unitprice,
            favorites
        } = req.body;
        const insProduct = {
            name: name,
            photourl: photourl,
            unitprice: unitprice,
            favorites: favorites
        }
         await createProduct(insProduct);
        res.status(201).json({OK: 'Se creó correctamente el producto'});
    } catch (error) {
        res.status(400).json({
            Message: error.sqlMessage
        });
    }
});
router.put('/:id', authenticateJWT, adminRoleValidation, async (req, res) => {
    try {
        const productid = req.params.id;
        const {
            name,
            photourl,
            unitprice,
            favorites
        } = req.body;
        const updProduct = {
            name,
            photourl,
            unitprice,
            favorites
        }
        const result = await updateProduct(updProduct, productid);
        res.status(result.code).json({resultado:result.message});
    } catch (error) {
        res.status(400).json({
            Message: error.sqlMessage
        });
    }
});
router.delete('/:id', authenticateJWT, adminRoleValidation, async (req, res) => {
    try {
        const productid = req.params.id;
        const result = await deleteProduct(productid);
        res.status(result.code).json({resultado:result.message});
    } catch (error) {
        res.status(400).json({
            Message: error.sqlMessage
        });
    }
});

module.exports = router;
