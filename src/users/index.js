const pool = require('../db/database');
const errors = require('../exception');
const errorsDB = require('../db/errDB');
const bcrypt = require('bcryptjs');

const insUser = 'INSERT INTO USERS SET ? ';
const authRole = 'SELECT role, password FROM users where username= ?';
const updUserQuery = 'UPDATE USERS SET ? WHERE username= ?';
const queryById = 'SELECT  username,fullname,email,phone,password,address FROM USERS WHERE username= ?';
const queryUsersAll = 'SELECT  username,fullname,email,phone,password,address FROM USERS';
const authExistUser = 'select count(1) existe from users where username=? and role=?';

const createUser = async (username, fullname, email, phone, password, address) => {
    try {
        const role = 'basico';
        const newUser = {
            username,
            fullname,
            email,
            phone,
            password,
            address,
            role
        };
        const result = await pool.poolConnection.query(insUser, [newUser]);
        return result;
    } catch (error) {
        console.log(error);
        return errorsDB(error); //errors(500,'authenticateRol',error,'');
    }
};

const updateUser = async (username, fullname, email, phone, address) => {

    try {
        const updUser = {
            fullname,
            email,
            phone,
            address
        };

        const result = await pool.poolConnection.query(updUserQuery, [updUser, username]);
        if (result.affectedRows === 0) return errors(404, 'PUT', 'No se modificó el usuario', '');
        //errors
        return errors(200, 'PUT', 'Se modificó el usuario correctamente', '');
    } catch (error) {
        console.log(error);
        return errorsDB(error);
    }
};

const getUserById = async (username) => {
    return await pool.poolConnection.query(queryById, username);
}
const isExitUser = async (username, role) => {
    try {
        const result = await pool.poolConnection.query(authExistUser, [username, role]);
        return result[0];
    } catch (error) {
        console.log(error);
        return errorsDB(error);
    }

}

const authenticateRol = async (username, passreq) => {
    try {
        const results = await pool.poolConnection.query(authRole, [username]);
        if (results.length === 0) return errors(401, 'authenticateRol', 'Usuario/Contraseña incorrecto', '');
        const pass = results[0].password;
        const auth = await bcrypt.compare(passreq, pass);//await validateAuthenticate(passreq, pass);

        if (auth === false) return errors(401, 'authenticateRol', 'Usuario/Contraseña incorrecto', '');

        return errors(0, 'authenticateRol', 'OK', results[0].role);
    } catch (error) {
        console.log(error);
        return errors(500, 'authenticateRol', error, '');
    }
};

const getUsers = async () => {
    return await pool.poolConnection.query(queryUsersAll);
};

module.exports = {
    createUser,
    authenticateRol,
    updateUser,
    getUserById,
    getUsers,
    isExitUser
};