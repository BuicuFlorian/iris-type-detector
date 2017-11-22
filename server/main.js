'use strict';

const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const morgan = require('morgan');
const path = require('path');
const port = process.env.PORT || 8080;

/**
 * Get all data of the body (POST) parameters
 * Parse application/json 
 */
app.use(bodyParser.json());

/**
 *  Parse application/x-www-form-urlencoded
 */
app.use(bodyParser.urlencoded({ extended: true }));

/**
 * Set the static files location
 */
app.use(express.static(path.join(__dirname, '../client')));
app.use(express.static(path.join(__dirname, './uploads')));

/**
 * Use morgan middleware to log HTTP requests
 */
app.use(morgan('dev'));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/client/index.html'));
});

const imagesRoutes = require('./routes/images.routes.js');
app.use('/api', imagesRoutes);

/**
 *  Start app at http://localhost:8080
 */
app.listen(port, () => {
    console.log(`Magic happens at: http://localhost:${port}`);
});