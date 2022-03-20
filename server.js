require('dotenv').config();
const mysql = require('mysql2');
const inquier = require('inquirer');
const cTable = require('console.table');

const connection = mysql.createConnection({
    host: 'localhost',
    port: 3006,
    user: process.env.DB_USER,
    password: process.env.DB_PW,
    database: 'employee_DB',
});

