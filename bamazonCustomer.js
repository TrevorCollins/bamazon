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
    start();
});

function start() {
    connection.query("SELECT * FROM products", function (err, res) {
        console.log("**************************************************************");
        console.log(" ");
        for (var i = 0; i < res.length; i++) {
            var id = res[i].item_id;
            var name = res[i].product_name;
            var price = res[i].price;

            console.log(id + ": " + name + " -- $" + price);
            console.log(" ");
        };
        console.log("**************************************************************");
        console.log("");

        inquirer.prompt([
            {
                name: "item",
                type: "input",
                message: "What is the item ID of the item you would like to bid on?",
                validate: function (value) {
                    if ((isNaN(value) === false) && (value <= res.length)) {
                        return true;
                    }
                    return false;
                }
            }, {
                name: "quantity",
                type: "input",
                message: "How many would you like to buy?",
                validate: function (value) {
                    if ((isNaN(value) === false)) {
                        return true;
                    }
                    return false;
                }
            }]).then(function (answer) {
                var id = parseInt(answer.item);
                var quantity = parseInt(answer.quantity);

                var product = res[id - 1];

                if (product.stock_quantity > quantity) {
                    console.log("Calculating your cost...");
                    update(product, quantity);
                } else {
                    console.log("Unfortunately, we only have " + product.stock_quantity);
                    notEnough(product);
                };
            });
    });
};

function update(product, quantity) {
    connection.query("UPDATE products SET ? WHERE ?",
    [
        {
            stock_quantity: product.stock_quantity - quantity
        }, {
            item_id: product.item_id
        }
    ], function(error) {
        if (error) throw err;
        console.log("There are now " + product.stock_quantity + " left!");
        console.log("Your cost is $" + (product.price * quantity));
        start();
      });
};

function notEnough(item) {
    var product = item;
    inquirer.prompt([{
        name: "nextMove",
        type: "list",
        message: "Would you like to change the quantity of your order, or end this transaction?",
        choices: ["Change quantity", "End transaction"]
    }]).then(function (answer) {
        if (answer.nextMove === "End transaction") {
            connection.end();
        } else if (answer.nextMove === "Change quantity") {
            inquirer.prompt({
                name: "quantity",
                type: "input",
                message: "How many would you like to buy now?",
                validate: function (value) {
                    if ((isNaN(value) === false)) {
                        return true;
                    }
                    return false;
                }
            }).then(function(answer) {
                var quantity = parseInt(answer.quantity);
                console.log(product.stock_quantity);

                if(quantity > product.stock_quantity) {
                    console.log("We still don't have enough!");
                    notEnough();
                } else {
                    update(product, quantity);
                };
            });
        };
    });
};