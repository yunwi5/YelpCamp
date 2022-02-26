const express = require('express')
const router = express.Router()

const catchAsync = require('../utils/catchAsync')
const ExpressError = require('../utils/ExpressError')
const Campground = require('../models/campground')
const { campgroundSchema } = require('../schemas')


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

router.get(
    '/',
    catchAsync(async (req, res) => {
        const campgrounds = await Campground.find({})
        res.render('campgrounds/index', { campgrounds })
    }),
)

router.get('/new', (req, res) => {
    res.render('campgrounds/new')
})

router.post(
    '/',
    validateCampground,
    catchAsync(async (req, res, next) => {
        const campground = new Campground(req.body.campground)
        await campground.save()

        req.flash('success', 'Successfully made a new campground!')
        res.redirect(`/campgrounds/${campground._id}`)
    }),
)

router.get(
    '/:id',
    catchAsync(async (req, res) => {
        const { id } = req.params
        // parameter of populate() is name of the property (reviews), not the nmae of the model (Review)
        const campground = await Campground.findById(id).populate('reviews')
        if (!campground) {
            req.flash('error', 'Cannot find that campground!')
            return res.redirect('/campgrounds')
        }
        res.render('campgrounds/show', { campground })
    }),
)

// Edit GET route
router.get(
    '/:id/edit',
    catchAsync(async (req, res) => {
        const campground = await Campground.findById(req.params.id)
        if (!campground) {
            req.flash('error', 'Cannot find that campground!')
            return res.redirect('/campgrounds')
        }
        res.render('campgrounds/edit', { campground })
    }),
)

// Edit POST route
router.put(
    '/:id',
    validateCampground,
    catchAsync(async (req, res) => {
        const { id } = req.params
        const campground = req.body.campground
        const updatedCampground = await Campground.findByIdAndUpdate(
            id,
            { ...campground },
            { new: true },
        )
        req.flash('success', 'Successfully updated campground')
        res.redirect(`/campgrounds/${updatedCampground._id}`)
    }),
)

// DELETE
router.delete('/:id', async (req, res) => {
    const { id } = req.params
    await Campground.findByIdAndDelete(id)

    req.flash('success', 'Successfully deleted a campground!')
    res.redirect('/campgrounds')
})

module.exports = router;