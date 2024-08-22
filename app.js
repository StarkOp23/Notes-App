require('dotenv').config();
const express = require('express');
const expressLayouts = require('express-ejs-layouts');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


//! Static HTML files
app.use(express.static('public'));

//! EJS template engine
app.use(expressLayouts);
app.set('layout', './layouts/main');
app.set('view engine', 'ejs');

//! Routes
app.use('/', require('./server/routes/routes'))

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
