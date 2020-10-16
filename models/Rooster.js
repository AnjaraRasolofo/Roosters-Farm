const db = require('./db');

const count = (result) => {
    const query = `SELECT COUNT (*) as count
                    FROM roosters`;
    db.connect.get(query, [], (err, count) => {
        if(err) {
            console.error(err.message);
        }
        result(count);
    })
}

const findAll = (result) => {
    const query = `SELECT *
                    FROM roosters;`       
    db.connect.all(query, [], (err, rows) => {
        if(err) {
            console.error(err.message);
        }
        result(rows);
    })
} 

const findAndPaginate = (limit, offset, result) => {
    const query = `SELECT *
                    FROM roosters 
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
                    FROM roosters
                    WHERE id = ?`;
    db.connect.get(query, [id], (err, row) => {
        if(err) {
            console.error(err.message);
        }
        result(row);
    })
} 

const create = (params, file, success) => {
    const {name, description, price} = params;
    const query = `INSERT INTO roosters(name, description, image, price, created_at, updated_at) 
                    VALUES (?,?,?,?,?,?)`;
    const newRow = [name, description, file, price, new Date(), new Date()];
    db.connect.run(query, newRow, (err) => {   
        if(err) {
            console.log(err);
        }
        success(true);
    });
}

const update = (id, params, file, success) => {
    const {name, description, price} = params;
    const query = `UPDATE roosters 
                    SET name = ?, description = ?, image = ?, price = ?, updated_at = ? 
                    WHERE id = ?`;
    const editRow = [name, description, file, price, new Date(), id];
    db.connect.run(query, editRow, function (err) {   
        if(err) {
            console.error(err);
        }
        success(true);
    }); 
}

const remove = (id, success) => {
    const query = 'DELETE FROM roosters WHERE id=?';
    db.connect.run(query, id, (err, row) => {
        if(err) {
            console.error(err.message);
        }
        success(true);
    });
}

module.exports = {
    count,
    findAll,
    findAndPaginate,
    findById,
    create,
    update,
    remove
}