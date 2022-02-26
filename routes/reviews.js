const express = require('express')
const router = express.Router({ mergeParams: true })

const catchAsync = require('../utils/catchAsync')
const ExpressError = require('../utils/ExpressError')
const Campground = require('../models/campground')
const Review = require('../models/review')
const { reviewSchema } = require('../schemas') // Joi schema

const validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body)
    if (error) {
        const msg = error.details.map(el => el.message).join(', ')
        throw new ExpressError(msg, 400)
    } else {
        next()
    }
}

router.post('/', validateReview, catchAsync(async (req, res) => {
    const { review: reviewInput } = req.body;
    const { id } = req.params;

    const campground = await Campground.findById(id)
    const review = new Review(reviewInput)
    campground.reviews.push(review)

    const p1 = review.save()
    const p2 = campground.save()
    await Promise.all([p1, p2])

    req.flash('success', 'Created new review!')
    res.redirect(`/campgrounds/${campground._id}`)
}))


router.delete('/:review_id', catchAsync(async (req, res) => {
    const { id, review_id } = req.params;
    const p1 = Campground.findByIdAndUpdate(id, { $pull: { reviews: review_id } });
    const p2 = Review.findByIdAndDelete(review_id)
    await Promise.all([p1, p2])

    req.flash('success', 'Successfully deleted your review!')
    res.redirect(`/campgrounds/${id}`)
}))

module.exports = router;
