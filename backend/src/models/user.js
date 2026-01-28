const cnn = require('../../db/connection');   // pool MySQL2
const bcrypt = require('bcrypt');

let user = {};

// ===============================
// GET ALL USERS
// ===============================
user.getAll = async (callback) => {
    let qry = `
        SELECT 
            id,
            name,
            email,
            created_at,
            updated_at,
            a_paterno,
            a_materno,
            direccion,
            foto,
            fono
        FROM users
        WHERE deleted_at IS NULL
    `;

    cnn.query(qry, (err, result) => {
        if (err) return callback(err, null);
        return callback(null, result);
    });
};

// ===============================
// GET USER BY ID
// ===============================
user.getById = async (id, callback) => {
    let qry = `
        SELECT 
            id,
            name,
            email,
            created_at,
            updated_at,
            a_paterno,
            a_materno,
            direccion,
            foto,
            fono
        FROM users
        WHERE id = ${cnn.escape(id)}
        AND deleted_at IS NULL
    `;

    cnn.query(qry, (err, result) => {
        if (err) return callback(err, null);
        return callback(null, result[0]);
    });
};

// ===============================
// CREATE USER
// ===============================
user.create = async (data, callback) => {
    try {
        const hash = await bcrypt.hash(data.password, 10);

        let qry = `
            INSERT INTO users (
                name,
                email,
                password,
                a_paterno,
                a_materno,
                direccion,
                fono,
                created_at
            ) VALUES (
                ${cnn.escape(data.name)},
                ${cnn.escape(data.email)},
                ${cnn.escape(hash)},
                ${cnn.escape(data.a_paterno)},
                ${cnn.escape(data.a_materno)},
                ${cnn.escape(data.direccion)},
                ${cnn.escape(data.fono)},
                NOW()
            )
        `;

        cnn.query(qry, (err, result) => {
            if (err) return callback(err, null);
            return callback(null, { id: result.insertId });
        });

    } catch (error) {
        return callback(error, null);
    }
};

// ===============================
// UPDATE USER
// ===============================
user.update = async (id, data, callback) => {
    let qry = `
        UPDATE users SET
            name = ${cnn.escape(data.name)},
            email = ${cnn.escape(data.email)},
            a_paterno = ${cnn.escape(data.a_paterno)},
            a_materno = ${cnn.escape(data.a_materno)},
            direccion = ${cnn.escape(data.direccion)},
            fono = ${cnn.escape(data.fono)},
            updated_at = NOW()
        WHERE id = ${cnn.escape(id)}
    `;

    cnn.query(qry, (err, result) => {
        if (err) return callback(err, null);
        return callback(null, { updated: true });
    });
};

// ===============================
// DELETE USER (LOGICAL)
// ===============================
user.delete = async (id, callback) => {
    let qry = `
        UPDATE users SET
            deleted_at = NOW()
        WHERE id = ${cnn.escape(id)}
    `;

    cnn.query(qry, (err, result) => {
        if (err) return callback(err, null);
        return callback(null, { deleted: true });
    });
};

module.exports = user;
