const mongoose = require('mongoose');
const session = require('express-session');
const MongoDBStore = require('connect-mongo')(session);

const dbUrl = process.env.DB_URL || 'mongodb://localhost:27017/yelp-camp';

// basic connection at the beginning
const connectDB = async () => {
    try {
        mongoose.connect(dbUrl, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
    } catch (err) {
        console.log(err.message);
        process.exit(1);
    }
};

// Use mongodb to store our session, not in the memory
// More efficient way to store session.
const secret = process.env.SECRET || 'thisshouldbeabettersecret!';

const store = new MongoDBStore({
    url: dbUrl,
    secret,
    touchAfter: 24 * 60 * 60,
});
store.on('error', function (e) {
    console.log('Session store error', e);
});

// Express session setup
const sessionConfig = {
    store,
    name: 'session',
    secret,
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true, // only accessible throuh http, not through JavaScript
        // secure: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7,
    },
};

module.exports = { connectDB, sessionConfig };
