// ===============================
// IMPORTS
// ===============================
const connection = require('../../db/connection.js');
const tools = require('../shared/tools.js');
const { regPerPage } = require('../shared/constants.js');
const rolesUsuario = require('../shared/functions.js');
const cnn = require('../../db/connection.js');
const bcrypt = require('bcrypt');

let user = {};

// ===============================
// GET ALL USERS (PAGINADO)
// ===============================
user.getAll = async (page = 1) => {
    try {
        const offset = (page - 1) * regPerPage;

        const sql = `
            SELECT id, nombre, email, rol, estado, created_at
            FROM usuarios
            LIMIT ? OFFSET ?
        `;

        const [rows] = await cnn.execute(sql, [regPerPage, offset]);
        return rows;
    } catch (error) {
        console.error('Error getAll users:', error);
        throw error;
    }
};

// ===============================
// GET USER BY ID
// ===============================
user.getById = async (id) => {
    try {
        const sql = `SELECT * FROM usuarios WHERE id = ?`;
        const [rows] = await cnn.execute(sql, [id]);
        return rows[0];
    } catch (error) {
        console.error('Error getById user:', error);
        throw error;
    }
};

// ===============================
// GET USER BY EMAIL
// ===============================
user.getByEmail = async (email) => {
    try {
        const sql = `SELECT * FROM usuarios WHERE email = ?`;
        const [rows] = await cnn.execute(sql, [email]);
        return rows[0];
    } catch (error) {
        console.error('Error getByEmail user:', error);
        throw error;
    }
};

// ===============================
// CREATE USER
// ===============================
user.create = async (data) => {
    try {
        const passwordHash = await bcrypt.hash(data.password, 10);

        const sql = `
            INSERT INTO usuarios (nombre, email, password, rol, estado)
            VALUES (?, ?, ?, ?, ?)
        `;

        const values = [
            data.nombre,
            data.email,
            passwordHash,
            data.rol || 'USER',
            data.estado || 1
        ];

        const [result] = await cnn.execute(sql, values);
        return { id: result.insertId, ...data };
    } catch (error) {
        console.error('Error create user:', error);
        throw error;
    }
};

// ===============================
// UPDATE USER
// ===============================
user.update = async (id, data) => {
    try {
        let sql = `UPDATE usuarios SET `;
        let fields = [];
        let values = [];

        if (data.nombre) {
            fields.push('nombre = ?');
            values.push(data.nombre);
        }

        if (data.email) {
            fields.push('email = ?');
            values.push(data.email);
        }

        if (data.rol) {
            fields.push('rol = ?');
            values.push(data.rol);
        }

        if (data.estado !== undefined) {
            fields.push('estado = ?');
            values.push(data.estado);
        }

        if (data.password) {
            const passwordHash = await bcrypt.hash(data.password, 10);
            fields.push('password = ?');
            values.push(passwordHash);
        }

        sql += fields.join(', ') + ` WHERE id = ?`;
        values.push(id);

        const [result] = await cnn.execute(sql, values);
        return result;
    } catch (error) {
        console.error('Error update user:', error);
        throw error;
    }
};

// ===============================
// DELETE USER
// ===============================
user.delete = async (id) => {
    try {
        const sql = `DELETE FROM usuarios WHERE id = ?`;
        const [result] = await cnn.execute(sql, [id]);
        return result;
    } catch (error) {
        console.error('Error delete user:', error);
        throw error;
    }
};

// ===============================
// LOGIN USER
// ===============================
user.login = async (email, password) => {
    try {
        const sql = `SELECT * FROM usuarios WHERE email = ?`;
        const [rows] = await cnn.execute(sql, [email]);

        if (rows.length === 0) return null;

        const usuario = rows[0];
        const match = await bcrypt.compare(password, usuario.password);

        if (!match) return null;

        // Eliminar password del objeto
        delete usuario.password;

        return usuario;
    } catch (error) {
        console.error('Error login user:', error);
        throw error;
    }
};

// ===============================
// EXPORT
// ===============================
module.exports = user;
