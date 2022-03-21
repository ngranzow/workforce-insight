require('dotenv').config();
const mysql = require('mysql2');
const inquier = require('inquirer');
const cTable = require('console.table');
const db = require('./db/connection');

db.connect (err => {
    if (err) throw err;
    console.log('Database connected.');
    mainMenu();
});

const mainMenu = () => {
    inquier.prompt([
        {
            type: 'list',
            name: 'menu',
            message: 'What would you like to do?',
            choices: ['View all departments', 
            'View all roles', 
            'View all employees', 
            'Add a department', 
            'Add a role', 
            'Add an employee', 
            'Update an employee role',
            'Update an employee manager',
            'View employees by department',
            'Delete a department',
            'Delete a role',
            'Delete an employee',
            'View department budgets',
            'Do nothing']
        }
    ])
    .then((menuAnswers) => {
        switch (menuAnswers.menu) {
            case 'View all departments':
                viewAll('EMPLOYEE');
                break;
            case 'View all roles':
                viewAll('ROLE');
                break;
            case 'View all employees':
                viewAll('EMPLOYEE');
                break;
            case 'Add a department':
                addDep();
                break;
            case 'Add a role':
                addRol();
                break;
            case 'Add an employee':
                addEmp();
                break;
            case 'Update an employee role':
                upEmp();
                break;
            case 'Update an employee manager':
                upMan();
                break;
            case 'View employees by department':
                viewEByD();
                break;
            case 'Delete a department':
                delDep();
                break;
            case 'Delete a role':
                delRol();
                break;
            case 'Delete an employee':
                delEmp();
                break;
            case 'View department budgets':
                viewBud();
                break;
            case 'Do nothing':
                db.end()
        };
    })
    .catch(err => {
        console.error(err);
    });
};

