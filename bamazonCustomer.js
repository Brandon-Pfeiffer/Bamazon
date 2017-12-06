var mysql = require("mysql");
var inquirer = require("inquirer");
var Table = require("cli-table");
var prompt = require("prompt");

var connection = mysql.createConnection({
	host: "localhost",
	port: 3306,
	user: "root",
	password: "",
	database: "bamazon"
});

connection.connect(function(err){
	if (err) throw err;

	displayProducts();
});

function displayProducts() {
	var table = new Table({
		head: ["ID", "Product Name", "Price"],
		colWidths: [5, 25, 10]
	});
	connection.query("SELECT * FROM Products", function(err, res) {
		for (var i = 0; i < res.length; i++) {
			table.push(
				[res[i].item_id, res[i].product_name, res[i].price]
			);
		}
	console.log(table.toString());	

	buyProducts();
	});
};

function buyProducts() {
		prompt.start();

		prompt.get([{
			name: "ID",
			message: "Whats the item ID of your product?",
			type: "integer",
			required: true 
		}, {
			name: "quantity",
			message: "How many would you like?",
			type: "integer",
			required: true
		}], function(err, answers){
			connection.query("SELECT * FROM Products WHERE item_id=?", [answers.ID], function(err, res) {
						var i = 0;
						if((res[i].stock_quantity - answers.quantity) > 0){
								var updatedQuantity = res[i].stock_quantity - answers.quantity;
								connection.query("UPDATE Products SET stock_quantity=? WHERE item_id=?", [updatedQuantity, answers.ID], function(err, result) {});
								var total = answers.quantity * res[i].price;
								console.log("That'll be : $" + total.toFixed(2));
								buyMore();
						
						} else {
							console.log("Sorry, we are out of stock of " + res[i].product_name + ". Check back later!")
							buyMore();
						}
				});
		});
}

function buyMore() {
	prompt.start();

	prompt.get([{
		name: "again",
		message: "Would you like to buy another item? (choose y or n)",
		required: true
	}], function(err, answers) {
			if (answers.again == "y" || answers.again == "Y"){
					buyProducts()
			} else  {
					console.log("Have a good day.");
					process.exit();
			}
	})
}



