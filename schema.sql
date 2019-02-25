DROP DATABASE IF EXISTS bamazon_db;

CREATE DATABASE bamazon_db;

USE bamazon_db;

CREATE TABLE products (
	item_id INT AUTO_INCREMENT NOT NULL,
    product_name VARCHAR(150) NOT NULL,
    department_name VARCHAR(50),
    price INT,
    stock_quantity INT,
    PRIMARY KEY(item_id)
);

INSERT INTO products(product_name, department_name, price, stock_quantity) VALUES
	("'Yoshimi Battles the Pink Robots' - Flaming Lips (Vinyl)", "Vinyl", 24, 30),
    ("'Yoshimi Battles the Pink Robots' - Flaming Lips (CD)", "CDs", 14, 50),
    ("Audio-Technica AT-LP120 Turntable", "Record Players", 300, 5),
    ("Pro-Ject Debut RecordMaster - Walnut Turntable", "Record Players", 500, 2),
    ("Crosley Standing Turntable, Red Bermuda", "Record Players", 250, 10),
    ("'Heroes' - David Bowie (2017 Remaster)", "Vinyl", 50, 25),
    ("'Fragile' - YES (Vinyl)", "Vinyl", 30, 20),
    ("'Fever to Tell' - Yeah Yeah Yeahs (CD)", "CDs", 10, 70),
    ("Sia Mid Century Vinyl Record Cabinet, Brown", "Furniture", 130, 15),
    ("'Gorillaz' - Gorillaz (Vinyl)", "Vinyl", 22, 20);
    
SELECT * FROM products;