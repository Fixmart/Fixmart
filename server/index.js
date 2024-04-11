const express = require('express');
const connectDB = require('./config/db.js');
const Customer = require('./modals/customer.js');
const Product  = require('./modals/products.js');
const Order  = require('./modals/orders.js');
const Collection  = require('./modals/collections.js');

connectDB();
const app = express();
const port = 3001; // or any port you prefer

// Middleware to parse JSON bodies
app.use(express.json());

// Sample route
app.get('/', (req, res) => {
  res.send('Hello, world!');
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
