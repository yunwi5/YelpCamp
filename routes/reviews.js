const express = require('express')
const router = express.Router({ mergeParams: true })

const catchAsync = require('../utils/catchAsync')
const { validateReview, isLoggedIn, validateReviewAuthor } = require('../middleware');
const controller = require('../controllers/reviews');

router.post('/', isLoggedIn, validateReview, catchAsync(controller.createReview))

router.delete('/:review_id', isLoggedIn, validateReviewAuthor, catchAsync(controller.deleteReview))

module.exports = router;
