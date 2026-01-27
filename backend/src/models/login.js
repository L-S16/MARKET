const cnn = require('../../db/connection');   // pool MySQL2
const tools = require('../shared/tools.js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const constantes = require('../../config/constants');
const constants = require('../../config/constants');

let login = {};

// ===============================
// LOGIN
// ===============================
login.login = async (credentials, callback) => {
    if (!cnn) {
        return callback({ mensaje: 'Conexión inactiva.', tipoMensaje: 'danger', id: -1 });
    }

    let qry = `
        SELECT 
            id,
            name,
            email,
            password,
            direccion,
            foto,
            fono
        FROM users
        WHERE email = ${cnn.escape(credentials.email)}
        AND deleted_at IS NULL
    `;

    cnn.query(qry, async (err, result) => {
        if (err) return callback(err, null);

        let row = result[0];
        if (!row) {
            return callback({ mensaje: 'Usuario inexistente.', tipoMensaje: 'danger', id: -1 });
        }

        let roles = await rolesUsuario(row.id);

        bcrypt.compare(credentials.password.toString(), row.password.toString(), async (err, ok) => {
            if (err || !ok) {
                return callback(
                    err ? err.message : { mensaje: 'Usuario y/o contraseña no válidos.', tipoMensaje: 'danger', id: -1 },
                    { access_token: null, user: null }
                );
            }

            delete row.password;
            row.remember = credentials.remember;

            const access_token = jwt.sign(
                { user: row, roles },
                constantes.secret,
                { issuer: credentials.host, expiresIn: constants.expiresTimeToken }
            );

            let refresh_token = null;

            if (credentials.remember) {
                refresh_token = jwt.sign(
                    { user: row, roles },
                    constantes.secretRefresh,
                    { issuer: credentials.host, expiresIn: constants.expiresTimeRefreshToken }
                );
            }

            try {
                await saveRememberToken(refresh_token, credentials.email);
                return callback(null, { access_token, refresh_token, user: row, roles });
            } catch (error) {
                return callback({
                    mensaje: 'Error al registrar token: ' + error.message,
                    tipoMensaje: 'danger'
                });
            }
        });
    });
};

// ===============================
// LOGOUT
// ===============================
login.logout = async (token, callback) => {
    try {
        const verifyResult = jwt.verify(token, constantes.secret);
        const email = verifyResult.user.email;

        if (!email) throw new Error('La sesión no pudo ser finalizada');

        await saveRememberToken(null, email);

        return callback(null, { mensaje: 'Sesión finalizada', tipoMensaje: 'success' });

    } catch (error) {
        return callback({
            mensaje: 'Error al cerrar sesión: ' + error.message,
            tipoMensaje: 'danger'
        });
    }
};

// ===============================
// REFRESH TOKEN
// ===============================
login.refreshToken = async (refreshToken, hos
