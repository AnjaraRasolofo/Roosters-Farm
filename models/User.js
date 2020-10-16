const db = require('./db');

const findAll = (result) => {
    const query = `SELECT *
                    FROM users;`       
    db.connect.all(query, [], (err, rows) => {
        if(err) {
            console.error(err.message);
        }
        result(rows);
    })
} 

const findAndPaginate = (limit, offset, result) => {
    const query = `SELECT *
                    FROM users
                    LIMIT ${limit}, ${offset};`       
    db.connect.all(query, [], (err, rows) => {
        if(err) {
            console.error(err.message);
        }
        result(rows);
    })
} 

const findById = (id, result) => {
    const query = `SELECT *
                    FROM users
                    WHERE id = ?`;
    db.connect.get(query, [id], (err, row) => {
        if(err) {
            console.error(err.message);
        }
        result(row);
    })
} 

const findByEmail = (email,result) => {
    const query = `SELECT id,username, email, password, is_admin 
                    FROM users
                    WHERE email = ?`;
    db.connect.get(query, [email], (err, row) => {
        if(err) {
            console.error(err.message);
        }
        result(row);
    })
} 

const create = (params, success) => {
    const {username, email, password} = params;
    const query = `INSERT INTO users(username, email, password, is_admin, created_at, updated_at) 
                    VALUES (?,?,?,?,?,?)`;
    const newRow = [username, email, password, 0, new Date(), new Date()];
    db.connect.run(query, newRow, (err) => {   
        if(err) {
            console.log(err);
        }
        success(true);
    });
}

const updatePassword = (id, params, success) => {
    const query = `UPDATE users 
                    SET password = ?, updated_at = ? 
                    WHERE id = ?`;
    const editRow = [params.password, new Date(), id];
    db.connect.run(query, editRow, function (err) {   
        if(err) {
            console.error(err);
        }
        success(true);
    }); 
}


const updateRole = (id, success) => {

    const query = `UPDATE products 
                    SET is_admin = ?, updated_at = ? 
                    WHERE id = ?`;
    const editRow = [1, new Date(), id];
    db.connect.run(query, editRow, function (err) {   
        if(err) {
            console.error(err);
        }
        success(true);
    }); 
}

const remove = (id, success) => {
    const query = 'DELETE FROM users WHERE id=?';
    db.connect.run(query, id, (err, row) => {
        if(err) {
            console.error(err.message);
        }
        success(true);
    });
}

module.exports = {
    findAll,
    findAndPaginate,
    findById,
    findByEmail,
    create,
    updatePassword,
    updateRole,
    remove
}