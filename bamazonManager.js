let mysql = require("mysql");
let inquirer = require("inquirer");
let connection = mysql.createConnection({
  host: "localhost",
  port: 8889,
  user: "root",
  password: "root",
  database: "bamazon"
});

connection.connect(function(err) {
  if (err) throw err;
  console.log("connected as id " + connection.threadId + "\n");
  viewOptions();
});

function viewOptions() {
    inquirer
      .prompt({
        name: "options",
        type: "list",
        message: "Welcome to BAMAZON Manager! Please select an option to proceed.",
        choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product"]
      })
      .then(function(answer) {
        // answer code here
      });
  }


