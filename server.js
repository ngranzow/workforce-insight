require('dotenv').config();
const mysql = require('mysql2');
const inquier = require('inquirer');
const cTable = require('console.table');
const db = require('./db/connection');

const PORT = process.env.PORT || 3001;

connection.connect (err => {
    if (err) throw err;
    console.log('Database connected.');
    mainMenu();
});

