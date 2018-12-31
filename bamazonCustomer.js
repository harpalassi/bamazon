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
  welcomeStats();
});

// function afterConnection() {
//   connection.query("SELECT * FROM products", function(err, res) {
//     if (err) throw err;
//     console.log(res);
//     connection.end();
//   });
// }

// function to greet user and show selection of products from database
function welcomeStats() {
  connection.query("SELECT * FROM products", function(err, products) {
    if (err) throw err;
    console.log(`Welcome to Bamazon! Here's what we have for you today.\n`);
    products.forEach(function(product, i) {
      console.log(
        `id #${products[i].item_id}: ${products[i].product_name}, $${
          products[i].price
        }`
      );
    });
    console.log(`\n`);
    itemAndQuantity();
  });
}

function itemAndQuantity() {
connection.query("SELECT * FROM products", function(err, products) {
        if (err) throw err;
  inquirer
    .prompt([
      {
        name: "id",
        type: "input",
        message: "Enter the id# for the product you would like to purchase."
      },
      {
        name: "quantity",
        type: "input",
        message: "How many would you like to purchase?"
      }
    ])
    .then(function(answer) {
      console.log(answer.id, answer.quantity);

    });
})
}
