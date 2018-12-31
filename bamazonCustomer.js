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

  function afterConnection() {
    connection.query("SELECT * FROM products", function(err, res) {
      if (err) throw err;
      console.log(res);
      connection.end();
    });
  }

  function welcomeStats() {
    connection.query("SELECT * FROM products", function(err, products) {
        if (err) throw err;
        console.log(`Welcome to Bamazon! Here's what we have for you today.\n`)
        products.forEach(function(product, i) {
        console.log(`id #${products[i].item_id}: ${products[i].product_name}, $${products[i].price}`)
        });
        console.log(`\n`);
        connection.end();
      });
  }