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
          viewForSale();
        }
        if (answer.options === "View Low Inventory") {
          lowInventory();
        }
        if (answer.options === "Add to Inventory") {
            viewForSale();
            setTimeout(addToInventory, 500);
        }
      });
}

function viewForSale () {
    connection.query("SELECT * FROM products", function(err, products) {
        if (err) throw err;
        newLine();
        products.forEach(function(product, i) {
          console.log(
            `id #${products[i].item_id}: ${products[i].product_name}, $${products[i].price.toFixed(2)}, Quantity: ${products[i].stock_quantity}`
          );
        });
        newLine();
    })
}

function lowInventory() {
  connection.query("SELECT * FROM products WHERE stock_quantity < 5", function(err, products) {
    if (err) throw err;
    console.log("\nItems with a stock lower than 5:\n");
    products.forEach(function(product, i) {
      console.log(
        `id #${products[i].item_id}: ${products[i].product_name}, $${products[i].price.toFixed(2)}, Quantity: ${products[i].stock_quantity}`
      );
    });
    newLine();
  });
}



function addToInventory() {
    connection.query("SELECT * FROM products", function(err, products) {
      if (err) throw err;
      inquirer
        .prompt([
          {
            name: "id",
            type: "input",
            message: "Enter the id# for the product you would like to add stock."
          },
          {
            name: "quantity",
            type: "input",
            message: "How many would you like to add?"
          }
        ])
        .then(function(answer) {
          let userItem = parseInt(answer.id - 1);
          let id = products[userItem].item_id;
          let newQuantity = parseInt(products[userItem].stock_quantity) + parseInt(answer.quantity);
          updateStock(id, newQuantity)
          console.log(`\nStock for ${products[userItem].product_name} has been updated to ${newQuantity}.\n`);
          connection.end();
        });
    });
  }


function updateStock(id, quantity) {
    connection.query(
        `UPDATE products SET stock_quantity = ${quantity} WHERE item_id = ${id}`,
    function(err, res) {
        })
    };