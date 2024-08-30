require('dotenv').config();
const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const session = require('express-session');
const passport = require('passport');
const MongoStore = require('connect-mongo');
const methodOverride = require('method-override');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

//! Configure and enable session management using the express-session middleware
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
        mongoUrl: process.env.MongoURL
    })

}));

//! Initialize Passport
app.use(passport.initialize());
app.use(passport.session());


//! Database
const connectDB = require('./server/config/database')
connectDB();

//! Static HTML files
app.use(express.static('public'));

//! EJS template engine
app.use(expressLayouts);
app.set('layout', './layouts/main');
app.set('view engine', 'ejs');

//! Routes
app.use('/', require('./server/routes/routes'));
app.use('/', require('./server/routes/auth'));
app.use('/', require('./server/routes/dashboard'))

//! Handle 404
app.get('*', (req, res) => {
    res.status(404).send(`
        <html>
            <head>
                <title>404 Page Not Found</title>
            </head>
            <body style="text-align: center;">
                <h1>404 Page Not Found</h1>
                <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTTcKcoquPvJ-O9WfgEYiUF34hYhzaGcrtamQ&s" alt="404 Image" />
            </body>
        </html>
        `);
})

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
