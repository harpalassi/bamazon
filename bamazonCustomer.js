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

// function to greet user and show selection of products from database
function welcomeStats() {
  connection.query("SELECT * FROM products", function(err, products) {
    if (err) throw err;
    console.log(`Welcome to BAMAZON! Here's what we have for you today.\n`);
    products.forEach(function(product, i) {
      console.log(
        `id #${products[i].item_id}: ${products[i].product_name}, $${products[i].price.toFixed(2)}`
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
        let userItem = parseInt(answer.id - 1);
        let totalPrice = (parseInt(answer.quantity) * parseInt(products[userItem].price)).toFixed(2);
        if (answer.quantity > products[userItem].stock_quantity) {
            console.log(`Hey, sorry. We don't have enough for you. Maybe next time.`)
        } else {
        let quantityRemaining = (parseInt(products[userItem].stock_quantity) - parseInt(answer.quantity));
        updateStock((userItem + 1), quantityRemaining)
        console.log(`\nThank you for shopping at Bamazon! \nYou have been charged $${totalPrice} for the ${products[userItem].product_name}(s).\n`);
        }
        connection.end();
      });
  });
}

function updateStock(id, quantity) {
    connection.query(
        `UPDATE products SET stock_quantity = ${quantity} WHERE item_id = ${id}`,
    function(err, res) {
          console.log(res.affectedRows + " product stock updated!\n");
        })
    };
