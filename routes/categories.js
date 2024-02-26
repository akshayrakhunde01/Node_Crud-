
const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Get all categories
router.get('/', (req, res) => {
    db.query('SELECT * FROM categories', (err, results) => {
        if (err) throw err;
        res.render('categories', { categories: results });
    });
});

// Add a new category
router.post('/', (req, res) => {
    const { name } = req.body;
    db.query('INSERT INTO categories (name) VALUES (?)', [name], (err, result) => {
        if (err) throw err;
        res.redirect('/categories');
    });
});

// Updte category
router.put('/:id', (req, res) => {
    const { id } = req.params;
    const { name } = req.body;
    db.query('UPDATE categories SET name = ? WHERE id = ?', [name, id], (err, result) => {
        if (err) throw err;
        res.redirect('/categories');
    });
});
//  editing category
router.get('/:id/edit', (req, res) => {
    const categoryId = req.params.id;
    
    // Ftch the category with  specific id from the database
    db.query('SELECT * FROM categories WHERE id = ?', [categoryId], (err, results) => {
        if (err) throw err;

        // Check if the category exists
        if (results.length === 0) {
            // Category not found, handle the error accordingly (e.g., show a 404 page)
            res.status(404).send('Category not found');
        } else {
            // Category found, render the edit form with the category data
            res.render('editCategory', { category: results[0] });
        }
    });
});

// Delete  catgry
router.delete('/:id', (req, res) => {
    const { id } = req.params; // Extract the ID parameter from the request URL
    db.query('DELETE FROM categories WHERE id = ?', [id], (err, result) => { // Execute a DELETE query to delete the category with the specified ID
        if (err) throw err; // Handle any errors that occur during the database operation
        res.redirect('/categories'); // Redirect the user back to the categories page after successful deletion
    });
});


module.exports = router;
