const { campgroundSchema, reviewSchema } = require('./schemas')
const Campground = require('./models/campground')
const Review = require('./models/review')
const ExpressError = require('./utils/ExpressError')

const isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        // Redirect user back.
        req.session.returnTo = req.originalUrl; // not req.url, which is a relative url.
        req.flash('error', "You need to sign in first.")
        return res.redirect('/login');
    }
    next();
}

// Selective middleware (not for all routes)
const validateCampground = (req, res, next) => {
    const { error } = campgroundSchema.validate(req.body)
    if (error) {
        const msg = error.details.map(el => el.message).join(', ')
        // Move to error middleware handler
        throw new ExpressError(msg, 400)
    } else {
        // Make sure to move to next() step, endpoint in this case when the campground obj is valid.
        next()
    }
}

const validateAuthor = async (req, res, next) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    if (!req.user || !campground.author.equals(req.user._id)) {
        req.flash('error', "You do not have permission to do that!")
        return res.redirect(`/campgrounds/${req.params.id}`)
    }
    next();
}

const validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body)
    if (error) {
        const msg = error.details.map(el => el.message).join(', ')
        throw new ExpressError(msg, 400)
    } else {
        // Make sure to move to next() step, endpoint in this case when the campground obj is valid.
        next()
    }
}

const validateReviewAuthor = async (req, res, next) => {
    const { id, review_id } = req.params;
    const review = await Review.findById(review_id);
    // Before population
    if (!review.author.equals(req.user._id)) {
        req.flash('error', "Sorry, you don't have permission to do that");
        return res.redirect(`/campgrounds/${id}`);
    }
    next();
}

module.exports = {
    isLoggedIn,
    validateCampground,
    validateAuthor,
    validateReview,
    validateReviewAuthor
}