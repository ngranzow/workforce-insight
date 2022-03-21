INSERT INTO department (name)
VALUES 
('Engineering'),
('Sales'),
('Legal'),
('HR');

INSERT INTO role (title, salary, department_id)
VALUES
('Lead Engineer', 150000, 1),
('Software Engineer', 103000, 1),
('Junior Engineer', 68000, 1),
('Sales Lead', 100000, 2),
('Sales Rep', 70000, 2),
('Lawyer', 200000, 3),
('Legal Assistant', 100000, 3),
('HR Manager', 75000, 4),
('HR Coordinator', 55000, 4);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES
('Lou', 'Reed', 1, null),
('Cleo', 'Moore', 4, null),
('Bob', 'Loblaw', 6, null),
('Tom', 'Colicchio', 8, null),
('Steve', 'Miller', 2, 1),
('Debbie', 'Harry', 2, 1),
('Marky', 'Mark', 3, 1),
('Michael', 'Dudikoff', 5, 2),
('Tim', 'Thomerson', 5, 2),
('Peter', 'Potamus', 7, 3),
('Gail', 'Simmons', 9, 4);