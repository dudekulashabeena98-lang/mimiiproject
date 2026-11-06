
const express = require("express");
const mysql = require("mysql2");
const path = require("path");

const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static folder
app.use(express.static(path.join(__dirname, "public")));

// MySQL Database Connection
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "root",
    database: "product_db"
});

// Connect to MySQL
db.connect((err) => {
    if (err) {
        console.log("MySQL Connection Failed: " + err.message);
        return;
    }

    console.log("MySQL Connected Successfully");
});

// Home Page
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});


// 1. INSERT PRODUCT
app.post("/products", (req, res) => {

    const {
        product_name,
        category,
        price,
        quantity,
        reorder_level
    } = req.body;

    if (!product_name || !category || price === undefined ||
        quantity === undefined || reorder_level === undefined ||
        !Number.isFinite(Number(price)) || Number(price) < 0 ||
        !Number.isInteger(Number(quantity)) || Number(quantity) < 0 ||
        !Number.isInteger(Number(reorder_level)) || Number(reorder_level) < 0) {

        return res.status(400).json({
            message: "Please enter valid product details"
        });
    }

    const sql = `
        INSERT INTO products
        (product_name, category, price, quantity, reorder_level)
        VALUES (?, ?, ?, ?, ?)
    `;

    db.query(sql, [
        product_name.trim(),
        category.trim(),
        Number(price),
        Number(quantity),
        Number(reorder_level)
    ], (err, result) => {

        if (err) {
            return res.status(500).json({ message: err.message });
        }

        res.status(201).json({
            message: "Product inserted successfully",
            product_id: result.insertId
        });
    });
});


// 2. LIST PRODUCTS
app.get("/products", (req, res) => {

    const sql = "SELECT * FROM products ORDER BY product_id";

    db.query(sql, (err, result) => {

        if (err) {
            return res.status(500).json({ message: err.message });
        }

        res.json(result);
    });
});


// 3. UPDATE PRODUCT
app.put("/products/:id", (req, res) => {

    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
        return res.status(400).json({
            message: "Invalid Product ID"
        });
    }

    const {
        product_name,
        category,
        price,
        quantity,
        reorder_level
    } = req.body;

    if (!product_name || !category || price === undefined ||
        quantity === undefined || reorder_level === undefined ||
        !Number.isFinite(Number(price)) || Number(price) < 0 ||
        !Number.isInteger(Number(quantity)) || Number(quantity) < 0 ||
        !Number.isInteger(Number(reorder_level)) || Number(reorder_level) < 0) {

        return res.status(400).json({
            message: "Please enter valid product details"
        });
    }

    const sql = `
        UPDATE products
        SET product_name = ?,
            category = ?,
            price = ?,
            quantity = ?,
            reorder_level = ?
        WHERE product_id = ?
    `;

    db.query(sql, [
        product_name.trim(),
        category.trim(),
        Number(price),
        Number(quantity),
        Number(reorder_level),
        id
    ], (err, result) => {

        if (err) {
            return res.status(500).json({ message: err.message });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: "Product ID not found"
            });
        }

        res.json({
            message: "Product updated successfully"
        });
    });
});


// 4. DELETE PRODUCT
app.delete("/products/:id", (req, res) => {

    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
        return res.status(400).json({
            message: "Invalid Product ID"
        });
    }

    const sql = "DELETE FROM products WHERE product_id = ?";

    db.query(sql, [id], (err, result) => {

        if (err) {
            return res.status(500).json({ message: err.message });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: "Product ID not found"
            });
        }

        res.json({
            message: "Product deleted successfully"
        });
    });
});


// START SERVER
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
