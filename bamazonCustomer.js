//setting up the mysql connection to the database
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

// greets user and shows selection of products from database
function welcomeStats() {
  connection.query("SELECT * FROM products", function(err, products) {
    if (err) throw err;
    console.log(`Welcome to BAMAZON! Here's what we have for you today.\n`);
    //prints the item id, name, and price
    products.forEach(function(product, i) {
      console.log(
        `id #${products[i].item_id}: ${products[i].product_name}, $${products[i].price.toFixed(2)}`
      );
    });
    console.log(`\n`);
    itemAndQuantity();
  });
}

//provides prompts to ask user for id and quantity and updates db accordingly
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
        //filters through the results to find the product id that matches the user's input
        const result = products.filter(product => parseInt(product.item_id) === parseInt(answer.id));
        //calculates the total price by multiplying quantity by price of product selected
        let totalPrice = (parseInt(answer.quantity) * parseInt(result[0].price).toFixed(2));
        //if the user quantity is greater than the database, we state we do not have enough
        if (parseInt(answer.quantity) > parseInt(result[0].stock_quantity)) {
            console.log(`Hey, sorry. We don't have enough for you. Maybe next time.`)
        } else {
            //otherwise we calculate the stock remaining and put it through updateStock to update db
            let quantityRemaining = (parseInt(result[0].stock_quantity) - parseInt(answer.quantity));
            updateStock(parseInt(answer.id), quantityRemaining)
            console.log(`\nThank you for shopping at BAMAZON! \nYou have been charged $${totalPrice} for the ${result[0].product_name}(s).\n`)
        }
        connection.end();
      });
  });
}
//takes the results from itemAndQuantity and updates stock in mysql database
function updateStock(id, quantity) {
    connection.query(
        `UPDATE products SET stock_quantity = ${quantity} WHERE item_id = ${id}`,
    function(err, res) {
          console.log(res.affectedRows + " product stock updated!\n");
        })
    };
