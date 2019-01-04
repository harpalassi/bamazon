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
  viewOptions();
});

//creates new line in command line
function newLine() {
  console.log(`\n`);
}

//welcomes user to manager interface, provides options to choose from and fires function needed
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

//prints item id#, item name, price, and the quantity for each item in our database table
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

//selects items whose stock quantity is less than 5 and prints them to the console
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


//takes user inputs to add stock using inquirer and passes them to updateStock() 
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

//takes the results and updates the database with the new quantity and prints a success message
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

//takes user inputs to create a new product, inserts the details into the database
//and prints out updated inventory
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
                  setTimeout(function () {console.log(`${res.affectedRows} new product inserted!\n`)}, 500);
                  if (res.affectedRows) {
                      viewForSale();
                      connection.end();
                  }
                }
            )})
        };

        