const express = require('express');
const router = express.Router();
const errors = require('../exception');
const {
    authenticateJWT,
    getInfoUserJWT,
    adminRoleValidation,
    hashPaswword
} = require('../auth/authServer');
const {
    createUser,
    updateUser,
    getUserById,
    getUsers
} = require('../users');

router.get('/all', authenticateJWT, adminRoleValidation, async (req, res) => {
    try {
        const result = await getUsers();
        res.status(200).json(result);
    } catch (error) {
        
        res.status(400).json({
            Message: error.sqlMessage
        });
    }
});
router.get('/', authenticateJWT, async (req, res) => {
    try {
        const username = getInfoUserJWT(req.headers.authorization);
        const result = await getUserById(username.name);
        if (result.length===0) return  res.status(404).json({error:'No existe el usuario'});
        res.status(200).json(result);
    } catch (error) {
        console.log(error);
        res.status(400).json({
            Message: error.sqlMessage
        });
    }
});
router.post('/', async (req, res) => {
    try {
        const {
            username,
            fullname,
            email,
            phone,
            password,
            address
        } = req.body;
        const pass=await hashPaswword(password);
        const result =await createUser(username, fullname, email, phone, pass, address);
        if (result.code>0) return res.status(409).json(result.message);
        res.status(201).json({
            OK: 'Se creó correctamente'
        });
    } catch (error) {
        res.status(400).json({
            Message: error.sqlMessage
        });
    }
});
router.put('/', authenticateJWT, async (req, res) => {
    try {
        const {
            fullname,
            email,
            phone,
            address
        } = req.body;
        const username = getInfoUserJWT(req.headers.authorization);
        await updateUser(username.name, fullname, email, phone,  address)
        res.status(200).json({
            OK: 'Se modificó correctamente'
        });
    } catch (error) {
        res.status(400).json({
            Message: error.sqlMessage
        });
    }
});
module.exports = router;