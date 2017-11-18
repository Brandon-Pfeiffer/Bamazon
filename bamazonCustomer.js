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
	console.log("Connection successful!");

	displayProducts();
});

function displayProducts() {
	var table = new Table({
		head: ["id item", "product name", "price"] 
	});
	connection.query("SELECT * FROM Products", function(err, res) {
		for (var i = 0; i < res.length; i++) {
			table.push([res[i].id_item+" || "+res[i].product_name+" || "+res[i].price+"\n"]);
		}
	console.log(table.toString());	
	});
};
