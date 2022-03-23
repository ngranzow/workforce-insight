require('dotenv').config();
const mysql = require('mysql2');
const inquier = require('inquirer');
const cTable = require('console.table');
const db = require('./db/connection');

// connects to the database and then starts mainMenu function
db.connect (err => {
    if (err) throw err;
    console.log('Database connected.');
    mainMenu();
});

// function that runs initial prompt
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
        // call functions from what the user selected
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

// function to view all departments, roles, OR employees
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

    // query that runs one of the sql input from the if statements
    db.query(sql, (err, res) => {
        if (err) throw err;
        console.table(res);
    
        // returns to beginning function
        mainMenu();
    });
};

// function to add department
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

        // query that adds a department based on user input
        db.query(sql, [depAnswer.depName], (err, res) => {
            if (err) throw err;
            console.log(`Added ${depAnswer.depName} to departments!`);

            // shows department table
            viewAll('DEPARTMENT');
        });
    });
};

// function to add a role
addRol = () => {
    const roles = []

    // query that selects all departments
    db.query('SELECT * FROM department', (err, res) => {
        if (err) throw err;

        res.forEach(rol => {
            let rolObj = {
                name: rol.name,
                value: rol.id
            }
            roles.push(rolObj);
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
            message: 'What is the salary of the new role?',
            validate: newSalary => {
                if (isNaN(newSalary)) {
                    console.log(' Please enter the salary.');
                    return false;
                } else {
                    return true;
                }
            }
        },
        {
            type: 'list',
            name: 'roles',
            choices: roles,
            message: 'Which department is this role in?'
        }
    ])
    .then(rolAnswer => {
        const params = [rolAnswer.newRole, rolAnswer.newSalary, rolAnswer.roles];
        const sql = `INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)`;

        // query that adds role based on user input and selection
        db.query(sql, params, (err, res) => {
            if (err) throw err;
            console.log(`Added ${rolAnswer.newRole} to roles!`)

            // shows role table
            viewAll('ROLE');
        });
    });
};

// function to add an employee
addEmp = () => {
    const roles = [];
    const employees = [
        {
            name: 'None',
            value: null
        }
    ];

    // query that selects all roles
    db.query('SELECT * FROM role', (err, res) => {
        if (err) throw err;
        
        res.forEach(({ title, id }) => {
            roles.push({
                name: title,
                value: id
            });
        });
    });

    // query that selects all employees
    db.query('SELECT * FROM employee', (err, res) => {
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
            message: 'What is the new employee\'s first name?',
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
            message: 'What is the new employee\'s last name?',
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
            type: 'list',
            name: 'roleId',
            message: 'What is the new employee\'s role?',
            choices: roles,
        },
        {
            type: 'list',
            name: 'managerId',
            message: 'Who is the new employee\'s manager?',
            choices: employees,
        }
    ])
    .then(empAnswer => {
        const params = [empAnswer.firstName, empAnswer.lastName, empAnswer.roleId, empAnswer.managerId];
        const sql = `INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)`;

        // query that adds employee information based on user input and selections
        db.query(sql, params, (err, res) => {
            if (err) throw err;
            console.log(`Added ${empAnswer.firstName} ${empAnswer.lastName} to employees!`)

            // shows employee table
            viewAll('EMPLOYEE');
        });
    });
};

// function to update employee's role
upEmp = () => {
    const employees = [];
    const roles = [];

    // query that selects all employees
    db.query('SELECT * FROM employee', (err, res) => {
        if (err) throw err;
        
        
        res.forEach(({ first_name, last_name, id }) => {
            employees.push({
                name: first_name + " " + last_name,
                value: id
            });
        });
        
        // query that selects all roles
        db.query('SELECT * FROM role', (err, res) => {
            if (err) throw err;
            
            res.forEach(({ title, id }) => {
                roles.push({
                    name: title,
                    value: id
                });
            });

            inquier.prompt([
                {
                  type: 'list',
                  name: 'id',
                  message: 'Whose role would you like to update?',
                  choices: employees
                },
                {
                  type: 'list',
                  name: 'role_id',
                  message: 'What is the employee\'s new role?',
                  choices: roles
                }
            ])
            .then(upRoleAns => {
                const params = [upRoleAns.role_id, upRoleAns.id]
                const sql = `UPDATE employee SET role_id = ? WHERE id = ?`;
        
                // query that updates an employee's role based on user selected role id and employee id
                db.query(sql, params, (err, res) => {
                    if (err) throw err;
                    console.log(`Updated employee\'s role!`)
                    
                    // shows employee table
                    viewAll('EMPLOYEE');
                })
            })
            .catch(err => {
                console.error(err);
            });
        });
    });
}

// function to update employee's manager
upMan = () => {
    const employees = [];
    // allows user to select null value instead of an employee
    const manager = [
        {
            name: 'None',
            value: null
        }
    ];

    // query to select all employees
    db.query('SELECT * FROM employee', (err, res) => {
        if (err) throw err;
        
        res.forEach(({ first_name, last_name, id }) => {
            employees.push({
                name: first_name + " " + last_name,
                value: id
            });
        });

        res.forEach(({ first_name, last_name, id }) => {
            manager.push({
                name: first_name + " " + last_name,
                value: id
            });
        });

        inquier.prompt([
            {
              type: 'list',
              name: 'empId',
              message: 'Whose manager would you like to update?',
              choices: employees
            },
            {
              type: 'list',
              name: 'manId',
              message: 'Who is the employee\'s new manager?',
              choices: manager
            }
        ])
        .then(upManAns => {
            const params = [upManAns.manId, upManAns.empId]
            const sql = `UPDATE employee SET manager_id = ?  WHERE id = ?`;
    
            // query to update employee manager based on user selected employee id
            db.query(sql, params, (err, res) => {
                if (err) throw err;
                console.log(`Updated employee\'s manager!`)
                
                // shows emplpoyee table
                viewAll('EMPLOYEE');
            })
        })
        .catch(err => {
            console.error(err);
        });
    });
}

// function to view employees by department
viewEByD = () => {
    const departments = [];
    
    db.query('SELECT * FROM department', (err, res) => {
        if (err) throw err;

        res.forEach(dep => {
            let depObj = {
                name: dep.name,
                value: dep.id
            }
            departments.push(depObj);
        });
        
        inquier.prompt([
            {
              type: 'list',
              name: 'depId',
              message: 'Which departmen\'s employees would you like to view?',
              choices: departments
            }
        ])
        .then(viewDep => {
            const params = [viewDep.depId];
            const sql = `SELECT employee.first_name, employee.last_name, role.title FROM employee INNER JOIN role ON role.id = employee.role_id INNER JOIN department ON department.id = role.department_id WHERE department_id = ?`;
            
            // query to show employees and their roles based on user selected department id
            db.query(sql, params, (err, rows) => {
                if (err) throw err;

                // shows table of selected department employees
                console.table(rows);

                // returns to beginning function
                mainMenu();
            })
        })
    });          
}

// function to delete department
delDep = () => {
    // warning that lets the user know if they delete a department it will delete all assoctiated roles and employees
    inquier.prompt([
        {
            type: 'list',
            name: 'warning',
            message: 'WARNING!!! By deleting a DEPARTMENT you will also delete all associated ROLES and EMPLOYEES! Do you want to continue?',
            choices: ['NO', 'YES']
        }
    ])
    .then(answer => {
        if(answer.warning === 'NO') {
            mainMenu();
        } else {
            const departments = [];

            // query to select all departments
            db.query('SELECT * FROM department', (err, res) => {
                if (err) throw err;

                res.forEach(dep => {
                    let depObj = {
                        name: dep.name,
                        value: dep.id
                    }
                    departments.push(depObj);
                })

                inquier.prompt([
                    {
                        type: 'list',
                        name: 'depId',
                        message: 'Which department would you like to delete?',
                        choices: departments
                    }
                ])
                .then(delDepAns => {
                    const sql = `DELETE FROM department WHERE id = ?`;

                    // query that deletes department based on user selecte department id
                    db.query(sql, [delDepAns.depId], (err, res) => {
                        if (err) throw err;

                        // shows department table
                        viewAll('DEPARTMENT');
                    });
                })
                .catch(err => {
                    console.error(err);
                });
            });
        }
    })
}

// function to delete role
delRol = () => {
    // warning letter user know if they continue to delete role they will also delete associated employees
    inquier.prompt([
        {
            type: 'list',
            name: 'warning',
            message: 'WARNING!!! By deleting a ROLE you will also delete all associated EMPLOYEES! Do you want to continue?',
            choices: ['NO', 'YES']
        }
    ])
    .then(answer => {
        if(answer.warning === 'NO') {
            mainMenu();
        } else {
            const roles = [];

            // query to select all from role
            db.query('SELECT * FROM role', (err, res) => {
                if (err) throw err;

                res.forEach(({ title, id }) => {
                    let rolObj = {
                        name: title,
                        value: id
                    }
                    roles.push(rolObj);
                })

                inquier.prompt([
                    {
                        type: 'list',
                        name: 'rolId',
                        message: 'Which role would you like to delete?',
                        choices: roles
                    }
                ])
                .then(delRolAns => {
                    const sql = `DELETE FROM role WHERE id = ?`;

                    // query to delete role based on user selected role id
                    db.query(sql, [delRolAns.rolId], (err, res) => {
                        if (err) throw err;
                
                        // shows role table
                        viewAll('ROLE');
                    });
                })
                .catch(err => {
                    console.error(err);
                });
            });
        }
    })
}

// function to delete employee
delEmp = () => {
    const employees = [];

    // query to select all employees
    db.query('SELECT * FROM employee', (err, res) => {
        if (err) throw err;

        res.forEach(({ first_name, last_name, id }) => {
            let empObj = {
                name: first_name + " " + last_name,
                value: id
            }
            employees.push(empObj);
        })

        inquier.prompt([
            {
                type: 'list',
                name: 'empId',
                message: 'Which employee would you like to delete?',
                choices: employees
            }
        ])
        .then(delEmpAns => {
            const sql = `DELETE FROM employee WHERE id = ?`;

            // query to delete employee based on user selected employee id
            db.query(sql, [delEmpAns.empId], (err, res) => {
                if (err) throw err;

                // shows employee table
                viewAll('EMPLOYEE');
            });
        })
        .catch(err => {
            console.error(err);
        });
    });
}

// function to view budget by department
viewBud = () => {
    const departments = [];

    // query to select all from department
    db.query("SELECT * FROM department", (err, res) => {
        if (err) throw err;
    
        res.forEach(({ name, id }) => {
            departments.push(
                {
                    name: name,
                    value: id
                }
            );
        });

        inquier.prompt([
            {
                type: 'list',
                name: 'depId',
                message: 'Which department\'s budget would you like to see?',
                choices: departments
            }
        ])
        .then(budAns => {
            const query = `SELECT department.name, SUM(salary) AS budget FROM
                            employee LEFT JOIN role
                            ON employee.role_id = role.id
                            LEFT JOIN department
                            ON role.department_id = department.id
                            WHERE department.id = ?`;
            
            // query to create department budget based on user selected department                
            db.query(query, [budAns.depId], (err, res) => {
                if (err) throw err;

                // creates budget table
                console.table(res);

                // returns to beginning function
                mainMenu();
            });
        })
        .catch(err => {
            console.error(err);
        });
    });
};