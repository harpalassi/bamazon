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

function newLine() {
    console.log(`\n`);
}

function viewOptions() {
  connection.query("SELECT * FROM products", function(err, products) {
    if (err) throw err;
    inquirer
      .prompt({
        name: "options",
        type: "list",
        message:
          "Welcome to BAMAZON Manager! Please select an option to proceed.",
        choices: [
          "View Products for Sale",
          "View Low Inventory",
          "Add to Inventory",
          "Add New Product"
        ]
      })
      .then(function(answer) {
        if (answer.options === "View Products for Sale") {
          newLine();
          products.forEach(function(product, i) {
            console.log(
              `id #${products[i].item_id}: ${products[i].product_name}, $${products[i].price.toFixed(2)}, Quantity: ${products[i].stock_quantity}`
            );
          });
          newLine();
        }
        connection.end();
      });
  });
}

