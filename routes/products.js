const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Geting all products

router.get('/', (req, res) => {
    const pageSize = 10; // Number of products per page
    const page = parseInt(req.query.page) || 1; // Current page number, default is 1
    const offset = (page - 1) * pageSize; // Calculate offset based on page number

    // Query to fetch products with pagination
    const query = `
        SELECT * FROM products
        ORDER BY id
        LIMIT ?, ?
    `;

    db.query(query, [offset, pageSize], (err, products) => {
        if (err) {
            console.error("Error retrieving products:", err);
            res.status(500).send("Internal Server Error");
            return;
        }

        // Fetch how mny number of request
        db.query('SELECT COUNT(*) AS total FROM products', (err, result) => {
            if (err) {
                console.error("Error counting products:", err);
                res.status(500).send("Internal Server Error");
                return;
            }

            const totalCount = result[0].total;
            const totalPages = Math.ceil(totalCount / pageSize);

            // fetchh categories
            db.query('SELECT * FROM categories', (err, categories) => {
                if (err) {
                    console.error("Error retrieving categories:", err);
                    res.status(500).send("Internal Server Error");
                    return;
                }

                // Render the products view with products, categories, and pagination data
                res.render('products', {
                    products: products,
                    categories: categories,
                    totalPages: totalPages,
                    currentPage: page
                });
            });
        });
    });
});



// Add new product
router.post('/', (req, res) => {
    const { name, category_id } = req.body;
    db.query('INSERT INTO products (name, category_id) VALUES (?, ?)', [name, category_id], (err, result) => {
        if (err) throw err;
        res.redirect('/products');
    });
});

// Update  product
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

        // Ftch al catgries from the database
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

// Delet product
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
