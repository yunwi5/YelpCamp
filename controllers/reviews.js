const Campground = require('../models/campground');
const Review = require('../models/review');


module.exports.createReview = async (req, res) => {
    const { review: reviewInput } = req.body;
    const { id } = req.params;

    console.log('reviewInput', reviewInput);

    const campground = await Campground.findById(id)
    const review = new Review(reviewInput)
    review.author = req.user._id;
    campground.reviews.push(review)

    const p1 = review.save()
    const p2 = campground.save()
    await Promise.all([p1, p2])

    req.flash('success', 'Created new review!')
    res.redirect(`/campgrounds/${campground._id}`)
}

module.exports.deleteReview = async (req, res) => {
    const { id, review_id } = req.params;
    const p1 = Campground.findByIdAndUpdate(id, { $pull: { reviews: review_id } });
    const p2 = Review.findByIdAndDelete(review_id)
    await Promise.all([p1, p2])

    req.flash('success', 'Successfully deleted your review!')
    res.redirect(`/campgrounds/${id}`)
}