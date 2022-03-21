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
            'Exit']
        }
    ])
    .then((menuAnswers) => {
        switch (menuAnswers.menu) {
            case 'View all departments':
                viewAll('DEPARTMENT');
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
            case 'Exit':
                db.end()
        };
    })
    .catch(err => {
        console.error(err);
    });
};

const viewAll = (table) => {
    let sql;
    if (table === 'DEPARTMENT') {
        sql = `SELECT department.id AS id, department.name AS department FROM department`;
    } else if (table === 'ROLE') {
        sql = `SELECT role.id, role.title, department.name AS department
                FROM role
                INNER JOIN department ON role.department_id = department.id`;
    } else if (table === 'EMPLOYEE') {
        sql = `SELECT employee.id, 
                employee.first_name, 
                employee.last_name, 
                role.title, 
                department.name AS department,
                role.salary, 
                CONCAT (manager.first_name, " ", manager.last_name) AS manager
                FROM employee
                LEFT JOIN role ON employee.role_id = role.id
                LEFT JOIN department ON role.department_id = department.id
                LEFT JOIN employee manager ON employee.manager_id = manager.id`;
    }
    db.query(sql, (err, res) => {
        if (err) throw err;
        console.table(res);
    
        mainMenu();
    });
};

addDep = () => {
    inquier.prompt([
        {
            type: 'input',
            name: 'depName',
            message: 'What is the name of the department you would like to add?',
            validate: addDep => {
                if (addDep) {
                    return true;
                } else {
                    console.log(' Please enter department name.');
                    return false;
                }
            }
        }
    ])
    .then(depAnswer => {
        const sql = `INSERT INTO department (name) VALUES (?)`;
        db.query(sql, [depAnswer.depName], (err, res) => {
            if (err) throw err;
            console.log(`Added ${depAnswer.depName} to departments!`);

            viewAll('DEPARTMENT');
        });
    });
};

addRol = () => {
    const departments = []
    db.query('SELECT * FROM department', (err, res) => {
        if (err) throw err;

        res.forEach(dep => {
            let depObj = {
                name: dep.name,
                value: dep.id
            }
            departments.push(depObj);
        })
    })

    inquier.prompt([
        {
            type: 'input',
            name: 'newRole',
            message: 'What is the name of the new role?',
            validate: newRole => {
                if (newRole) {
                    return true;
                } else {
                    console.log(' Please enter name of role.');
                    return false;
                }
            }
        },
        {
            type: 'input', 
            name: 'newSalary',
            message: "What is the salary of the new role?",
            validate: newSalary => {
                if (!isNaN()) {
                    console.log(' Please enter the salary.');
                    return false;
                } else {
                    return true;
                }
            }
        },
        {
            type: "list",
            name: "departments",
            choices: departments,
            message: "which department is this role in?"
        }
    ])
    .then(rolAnswer => {
        const params = [rolAnswer.newRole, rolAnswer.newSalary, rolAnswer.departments];
        const sql = `INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)`;
        db.query(sql, params, (err, res) => {
            if (err) throw err;
            console.log(`Added ${rolAnswer.newRole} to roles!`)

            viewAll('ROLE');
        });
    });
};

addEmp = () => {
    const roles = [];
    const employees = [
        {
            name: 'None',
            value: null
        }
    ];

    db.query("SELECT * FROM role", (err, res) => {
        if (err) throw err;
        
        res.forEach(({ title, id }) => {
            roles.push({
                name: title,
                value: id
            });
        });
    });

    db.query("SELECT * FROM employee", (err, res) => {
        if (err) throw err;
        
        res.forEach(({ first_name, last_name, id }) => {
            employees.push({
                name: first_name + " " + last_name,
                value: id
            });
        });
    }); 

    inquier.prompt([
        {
            type: 'input',
            name: 'firstName',
            message: "What is the new employee's first name?",
            validate: firstName => {
              if (firstName) {
                  return true;
              } else {
                  console.log('Please enter a first name.');
                  return false;
              }
            }
        },
        {
            type: 'input',
            name: 'lastName',
            message: "What is the new employee's last name?",
            validate: lastName => {
              if (lastName) {
                  return true;
              } else {
                  console.log('Please enter a last name.');
                  return false;
              }
            }
        },
        {
            type: "list",
            name: "roleId",
            choices: roles,
            message: "What is the new employee's role?"
        },
        {
            type: "list",
            name: "managerId",
            choices: employees,
            message: "Who is the new employee's manager?"
        }
    ])
    .then(empAnswer => {
        const params = [empAnswer.firstName, empAnswer.lastName, empAnswer.roleId, empAnswer.managerId];
        const sql = `INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)`;
        db.query(sql, params, (err, res) => {
            if (err) throw err;
            console.log(`Added ${empAnswer.firstName} ${empAnswer.lastName} to employees!`)

            viewAll('EMPLOYEE');
        });
    });
};

upEmp = () => {

}

upMan = () => {}

viewEByD = () => {}

delDep = () => {}

delRol = () => {}

viewBud = () => {}