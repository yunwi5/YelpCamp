if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

const express = require('express')
const path = require('path')
const mongoose = require('mongoose')
const ejsMate = require('ejs-mate') // For templating boilerplate code for ejs files
const methodOverride = require('method-override')
const session = require('express-session')
const flash = require('connect-flash')
const passport = require('passport')
const LocalStrategy = require('passport-local')
const mongoSanitize = require('express-mongo-sanitize')
const helmet = require("helmet");

const MongoDBStore = require('connect-mongo')(session);

const ExpressError = require('./utils/ExpressError')
const campgroundsRoutes = require('./routes/campgrounds')
const reivewsRoutes = require('./routes/reviews')
const usersRoutes = require('./routes/users')
const User = require('./models/user')

// const dbUrl = "mongodb://localhost:27017/yelp-camp";
const dbUrl = process.env.DB_URL || "mongodb://localhost:27017/yelp-camp";
mongoose.connect(dbUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})

const db = mongoose.connection
db.on('error', console.error.bind(console, 'connection error:'))
db.once('open', () => {
    console.log('Database connected')
})

const app = express()

// Don't forget these!
app.engine('ejs', ejsMate)
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'))
app.use(express.static(path.join(__dirname, 'public')))
app.use(mongoSanitize({
    replaceWith: '_'
}));

const secret = process.env.SECRET || "thisshouldbeabettersecret!";

// Use mongodb to store our session, not in the memory
// More efficient way to store session.
const store = new MongoDBStore({
    url: dbUrl,
    secret,
    touchAfter: 24 * 60 * 60
})

store.on("error", function (e) {
    console.log('Session store error', e);
})

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
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}
app.use(session(sessionConfig))
app.use(flash())
// app.use(helmet({
//     referrerPolicy: { policy: "no-referrer" },
//     contentSecurityPolicy: false,
// }))

// PASSPORT
app.use(passport.initialize())
// This should be after session
app.use(passport.session())
passport.use(new LocalStrategy(User.authenticate()))

passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

// Middleware for flashing message to the user without passing them everytime manually.
app.use((req, res, next) => {
    // console.log(req.session);
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    // From Passport js
    res.locals.currentUser = req.user;
    // Always call next() to go next step, for evey middleware.
    next();
})

app.use('/campgrounds', campgroundsRoutes);
app.use('/campgrounds/:id/reviews', reivewsRoutes);
app.use('/', usersRoutes);

app.get('/', (req, res) => {
    res.render('home')
})

// not async
app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404))
})

// middleware error handling route
app.use((err, req, res, next) => {
    const { status = 500 } = err
    if (!err.message) err.message = 'Something went wrong!'
    res.status(status).render('error', { err })
})

// process.env.PORT will be set up automatically by Heroku on the deployment server.
const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`Serving on port ${port}`);
})
