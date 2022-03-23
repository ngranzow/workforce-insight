# Workforce Insight
[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg)](https://opensource.org/licenses/ISC)

## Description 
Workforce Insight is an employee tracker application that allows business to create and manage departments, roles, and employees as well as see thir budgets.
 
## Table of Contents
* [Installation](#installation)
* [Usage](#usage)
* [License](#license)
* [Contributing](#contributing)
* [Questions](#questions)

## Installation 
To install, first clone the repository from GitHub and then install Node. Install inquirer, dotenv, mysql2, and console.table by running `npm i` in your command line.

You will then need to create a .env file within the root folder. The file will need to include: DB_USER=(your username), DB_PW=(your password), and DB_NAME=employee_db

To set up the database:
* Run `mysql -u username -p`
* Enter your password
* `source db/schema.sql`
* `source db/seeds.sql`
* `quit`


## Usage 
Run `npm start` in your command line and select the from the displayed prompts.
You can also view a video walkthrough [here](https://youtu.be/Vv80hR2HvZU).

## License 
To read the ISC license click [here](https://opensource.org/licenses/ISC)

## Contributing 
Please read the [installation](#installation) section.

## Questions
If you have any questions please contact email me [here](mailto:nate.granzow@gmail.com). You can also view more of my projects [here](https://github.com/ngranzow/).