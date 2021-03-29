require('dotenv').config();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const {
    isExitUser
} = require('../users');

const authenticateJWT = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (authHeader === undefined) {
        res.sendStatus(401);
    } else {
        const token = authGenerateToken(authHeader);
        const verify = authVerifyJWT(token);
        if (verify === 403) return res.sendStatus(403);
        req.user = verify;
        next();
    }
    return;
};

const authGenerateToken = (auth) => {
    return auth.split(' ')[1];
};

const authVerifyJWT = (token) => {
    let v_return;
    jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
        (err) ? v_return = 403: v_return = user;
    });
    return v_return;
};

const accessToken = (auth) => {
    return jwt.sign(auth, process.env.TOKEN_SECRET, { expiresIn: process.env.EXPIRE_TOKEN });
};

const adminRoleValidation = (req, res, next) => {
    const result = getInfoUserJWT(req.headers.authorization);
    const existUser = isExitUser(result.name, result.rol);
    existUser.then(e => {
            if (result.rol !== 'admin' || e.existe === 0) {
                res.sendStatus(401);
            } else {
                next();
            }
        })
        .catch(err => res.sendStatus(401));

};

const getInfoUserJWT = (token) => {
    return authVerifyJWT(authGenerateToken(token));
};

const hashPaswword = async (pass) => {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(pass, salt);
    return hash;
};


module.exports = {
    authenticateJWT,
    accessToken,
    getInfoUserJWT,
    adminRoleValidation,
    hashPaswword
};