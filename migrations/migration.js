const db = require('../models/db');

//Create Database Table and populating default datas
const queryCreateProduct = `CREATE TABLE IF NOT EXISTS roosters (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name varchar(255),
    description varchar(255),
    image varchar(255),
    price FLOAT,
    created_at TIMESTAMP,
    updated_at TIMESTAMP
)`;

db.connect.run(queryCreateProduct, (err) => {
    if(err) {
        console.error(err.message);
    }
    console.log('roosters Table created Successfuly');
});

const queryCreateUser = `CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username varchar(255),
    email varchar(255),
    password varchar(255),
    is_admin integer,
    created_at TIMESTAMP,
    updated_at TIMESTAMP
)`;

db.connect.run(queryCreateUser, (err) => {
    if(err) {
        console.error(err.message);
    }
    console.log('User Table created Successfuly');
});

const queryCreateCart = `CREATE TABLE IF NOT EXISTS cart (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    rooster_id INTEGER
)`;

db.connect.run(queryCreateCart, (err) => {
    if(err) {
        console.error(err.message);
    }
    console.log('Cart Table created Successfuly');
});

