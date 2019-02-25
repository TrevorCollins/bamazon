var inquirer = require("inquirer");
var mysql = require("mysql");

var connection = mysql.createConnection({
    host: "localhost",

    port: 3306,

    user: "root",

    password: "H3y!z3us",
    database: "bamazon_DB"
});

connection.connect(function (err) {
    if (err) throw err;
    console.log("Hello, Mr. Manager!")
    start();
});

function start() {
    inquirer.prompt({
        name: "action",
        type: "list",
        message: "What would you like to do?",
        choices: ["View Items for Sale", "View Low Inventory", "Add to Inventory", "Add New Product", "Exit"]
    }).then(function (answer) {
        switch (answer.action) {
            case "View Items for Sale":
                viewItems();
                break;

            case "View Low Inventory":
                lowInventory();
                break;

            case "Add to Inventory":
                addInventory();
                break;

            case "Add New Product":
                addProduct();
                break;

            case "Exit":
                connection.end();
                break;
        };
    });
};

function viewItems() {
    connection.query("SELECT * FROM products", function (err, res) {
        for (var i = 0; i < res.length; i++) {
            console.log("--------------------------------------------------------------------");
            console.log("ID:        " + res[i].item_id);
            console.log("Name:      " + res[i].product_name);
            console.log("Price:     $" + res[i].price);
            console.log("Inventory: " + res[i].stock_quantity);
            console.log("--------------------------------------------------------------------");
        };
        start();
    });
};

function lowInventory() {
    connection.query("SELECT * FROM products WHERE stock_quantity<5", function (err, res) {
        for (var i = 0; i < res.length; i++) {
            console.log("--------------------------------------------------------------------");
            console.log("ID:        " + res[i].item_id);
            console.log("Name:      " + res[i].product_name);
            console.log("Price:     $" + res[i].price);
            console.log("Inventory: " + res[i].stock_quantity);
            console.log("--------------------------------------------------------------------");
        };
        start();
    });
};

function addInventory() {
    connection.query("SELECT * FROM products", function (err, res) {
        for (var i = 0; i < res.length; i++) {
            console.log("--------------------------------------------------------------------");
            console.log("ID:        " + res[i].item_id);
            console.log("Name:      " + res[i].product_name);
            console.log("Inventory: " + res[i].stock_quantity);
            console.log("--------------------------------------------------------------------");
        };
        inquirer.prompt({
            name: "item",
            type: "input",
            message: "What is the ID of the item you would like to add more of?",
            validate: function (value) {
                if ((isNaN(value) === false) && (value <= res.length)) {
                    return true;
                }
                return false;
            }
        }).then(function (answer) {
            var id = parseInt((answer.item) - 1);
            console.log("There are " + res[id].stock_quantity + " of this item.");
            inquirer.prompt({
                name: "quantity",
                type: "input",
                message: "How many more would you like to add?",
                validate: function (value) {
                    if (isNaN(value) === false) {
                        return true;
                    }
                    return false;
                }
            }).then(function (answer) {
                var quantity = parseInt(answer.quantity);
                connection.query("UPDATE products SET ? WHERE ?", [
                    {
                        stock_quantity: res[id].stock_quantity + quantity
                    }, {
                        item_id: res[id].item_id
                    }
                ], function (error) {
                    if (error) throw err;
                    console.log("Item inventory updated");
                    start();
                });
            });
        });
    });
};

function addProduct() {
    inquirer.prompt([
        {
            name: "name",
            type: "input",
            message: "What is the name of the product you would like to add?"
        }, {
            name: "department",
            type: "input",
            message: "What department does it belong in?"
        }, {
            name: "price",
            type: "input",
            message: "How much should it cost?",
            validate: function (value) {
                if (isNaN(value) === false) {
                    return true;
                }
                return false;
            }
        }, {
            name: "quantity",
            type: "input",
            message: "How many do you have?",
            validate: function (value) {
                if (isNaN(value) === false) {
                    return true;
                }
                return false;
            }
        }]).then(function(answer) {
            var name = answer.name;
            var department = answer.department;
            var price = answer.price;
            var quantity = answer.quantity;

            connection.query("INSERT INTO products SET ?", {
                product_name: name,
                department_name: department,
                price: price,
                stock_quantity: quantity
            }, function() {
                console.log("Item added to your store.");
                start();
            });
        });
};