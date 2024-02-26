// Import required modules
const express = require('express');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');





// Create an Express application
const app = express();
app.use(methodOverride('_method'));
// Set the port number
const port = 3000;

// Middleware setup to parse request bodies
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Set the view engine to use EJS templates
app.set('view engine', 'ejs');

// Import and use routes
const categoriesRouter = require('./routes/categories');
const productsRouter = require('./routes/products');
app.use('/categories', categoriesRouter);
app.use('/products', productsRouter);

// Additional route for the root URL
app.get('/', (req, res) => {
    res.send("Use /categories & /products");
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
