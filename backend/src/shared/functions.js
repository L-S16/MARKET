const connection = require('../../db/connection');

// ✅ Si connection exporta un pool o conexión directa:
const cnn = connection;

// ===============================
// Utils
// ===============================
function todayToString(){
    let fecha = new Date();
    return `${fecha.getFullYear()}/${(fecha.getMonth() + 1 < 10 ? '0' : '') + (fecha.getMonth() + 1)}/${(fecha.getDate() < 10 ? '0' : '') + fecha.getDate()}`;
}

// ===============================
// Roles por usuario
// ===============================
function rolesUsuario(idUser){
    if(cnn){
        let qry = `SELECT 
                    r.id, 
                    name, 
                    description, 
                    r.created_at, 
                    r.updated_at,
                    r.deleted_at 
                FROM 
                    role_user ru
                    INNER JOIN roles r ON ru.role_id = r.id
                WHERE 
                    ru.user_id = ${cnn.escape(idUser)}`;

        return new Promise((resolve) => {
            cnn.query(qry, (err, res) => {
                if(err){
                    console.error('rolesUsuario error:', err);
                    return resolve([]);
                }else{
                    return resolve(res);
                }
            });
        });
    }else{
        console.log('rolesUsuario','Conexión inactiva');
        return [];
    }
}

// ===============================
// Exports correctos
// ===============================
module.exports = {
    todayToString,
    rolesUsuario
};
