const express = require('express')
const path = require('path')
const mongoose = require('mongoose')
const ejsMate = require('ejs-mate') // For templating boilerplate code for ejs files
const methodOverride = require('method-override')
const session = require('express-session')
const flash = require('connect-flash')
const passport = require('passport')
const LocalStrategy = require('passport-local')

const ExpressError = require('./utils/ExpressError')
const campgroundsRoutes = require('./routes/campgrounds')
const reivewsRoutes = require('./routes/reviews')
const usersRoutes = require('./routes/users')
const User = require('./models/user')

mongoose.connect('mongodb://localhost:27017/yelp-camp', {
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

const sessionConfig = {
    secret: 'thisshouldbeabettersecret',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}
app.use(session(sessionConfig))
app.use(flash())

// PASSPORT
app.use(passport.initialize());
// This should be after session
app.use(passport.session())
passport.use(new LocalStrategy(User.authenticate()))

passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

// Middleware for flashing message to the user without passing them everytime manually.
app.use((req, res, next) => {
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
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

// middleware error handling
app.use((err, req, res, next) => {
    const { status = 500 } = err
    if (!err.message) err.message = 'Something went wrong!'
    res.status(status).render('error', { err })
})

app.listen(5000, () => {
    console.log('Serving on port 5000')
})
