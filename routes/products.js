const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Get all products
router.get('/', (req, res) => {
    db.query('SELECT * FROM products', (err, products) => {
        if (err) throw err;
        db.query('SELECT * FROM categories', (err, categories) => {
            if (err) throw err;
            res.render('products', { products: products, categories: categories });
        });
    });
});


// Add a new product
router.post('/', (req, res) => {
    const { name, category_id } = req.body;
    db.query('INSERT INTO products (name, category_id) VALUES (?, ?)', [name, category_id], (err, result) => {
        if (err) throw err;
        res.redirect('/products');
    });
});

// Update a product
router.get('/:id/edit', (req, res) => {
    const productId = req.params.id;

    // Fetch the product with the specified ID from the database
    db.query('SELECT * FROM products WHERE id = ?', [productId], (err, productResult) => {
        if (err) {
            // Handle the error
            console.error(err);
            res.status(500).send('Internal Server Error');
            return;
        }

        // Fetch all categories from the database
        db.query('SELECT * FROM categories', (err, categoryResult) => {
            if (err) {
                // Handle the error
                console.error(err);
                res.status(500).send('Internal Server Error');
                return;
            }

            // Render the edit product form with the product and categories data
            res.render('editProduct', { product: productResult[0], categories: categoryResult });
        });
    });
});

router.put('/:id', (req, res) => {
    const productId = req.params.id;
    const { name, category_id } = req.body;
    db.query('UPDATE products SET name = ?, category_id = ? WHERE id = ?', [name, category_id, productId], (err, result) => {
        if (err) {
            console.error("Error updating product:", err);
            res.status(500).send("Error updating product");
        } else {
            console.log("Product updated successfully");
            res.redirect('/products');
        }
    });
});

// Delete a product
router.delete('/:id', (req, res) => {
    // Extract the product ID from the request parameters
    const { id } = req.params;
    // Delete the product from the database
    db.query('DELETE FROM products WHERE id = ?', [id], (err, result) => {
        if (err) throw err;
        // Redirect the user back to the products page after successful deletion
        res.redirect('/products');
    });
});

module.exports = router;
