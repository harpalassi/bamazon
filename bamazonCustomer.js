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
        const result = products.filter(product => parseInt(product.item_id) === parseInt(answer.id));
        console.log(result[0].item_id);
        let totalPrice = (parseInt(answer.quantity) * parseInt(result[0].price).toFixed(2));
        console.log(totalPrice);
        if (parseInt(answer.quantity) > parseInt(result[0].stock_quantity)) {
            console.log(`Hey, sorry. We don't have enough for you. Maybe next time.`)
        } else {
            let quantityRemaining = (parseInt(result[0].stock_quantity) - parseInt(answer.quantity));
            updateStock(parseInt(answer.id), quantityRemaining)
            console.log(`\nThank you for shopping at BAMAZON! \nYou have been charged $${totalPrice} for the ${result[0].product_name}(s).\n`)
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
