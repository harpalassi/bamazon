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
          connection.end();
        }
        if (answer.options === "View Low Inventory") {
          lowInventory();
          connection.end();
        }
        if (answer.options === "Add to Inventory") {
            viewForSale();
            setTimeout(addToInventory, 500);
        }
        if (answer.options === "Add New Product") {
            createProduct();
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
          let id = answer.id;
          let quantity = parseInt(answer.quantity);
          updateStock(id, quantity)
        });
    });
  }


function updateStock(id, quantity) {
    connection.query(
        `UPDATE products SET stock_quantity = stock_quantity + ${quantity} WHERE item_id = ${id}`,
    function(err, res) {
            if (err) throw err;
            if (res.affectedRows) {
                viewForSale();
                setTimeout(function () {console.log(`Stock has been successfully added for ${res.affectedRows} product.\n`)}, 500);
                connection.end();
            }
        })
    };

function createProduct() {
    inquirer
        .prompt([
          {
            name: "name",
            type: "input",
            message: "Enter the name of the product:"
          },
          {
            name: "department",
            type: "input",
            message: "Enter the department name for the product:"
          },
          {
            name: "price",
            type: "input",
            message: "Enter the price for the product:"
          },
          {
            name: "quantity",
            type: "input",
            message: "Enter the stock quantity:"
          }
        ])
        .then(function(answer) {
            // console.log(answer.name, answer.department, answer.price, answer.quantity)
            connection.query(
                "INSERT INTO products SET ?",
                {
                  product_name: answer.name,
                  department_name: answer.department,
                  price: answer.price,
                  stock_quantity: answer.quantity
                },
                function(err, res) {
                  newLine();
                  console.log(res.affectedRows + " new product inserted!");
                  if (res.affectedRows) {
                      viewForSale();
                      connection.end();
                  }
                }
            )})
        };

        