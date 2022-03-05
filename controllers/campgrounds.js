const Campground = require('../models/campground');

const index = async (req, res) => {
    const campgrounds = await Campground.find({})
    res.render('campgrounds/index', { campgrounds })
}

const renderNewForm = (req, res) => {
    res.render('campgrounds/new')
}

const createCampground = async (req, res, next) => {
    const campground = new Campground(req.body.campground)
    campground.author = req.user._id;
    await campground.save()

    req.flash('success', 'Successfully made a new campground!')
    res.redirect(`/campgrounds/${campground._id}`)
}

const showCampground = async (req, res) => {
    const campground = await Campground.findById(req.params.id)
        .populate({
            path: 'reviews',
            populate: {
                path: 'author'
            }
        }).populate('author');
    // Not yet populated, so author is user_id.
    if (!campground) {
        req.flash('error', 'Cannot find that campground!')
        return res.redirect('/campgrounds')
    }
    // parameter of populate() is name of the property (reviews), not the nmae of the model (Review)
    req.flash('success', 'Successfully updated campground!')
    res.render('campgrounds/show', { campground })
}

const renderEditForm = async (req, res) => {
    const campground = await Campground.findById(req.params.id)
    if (!campground) {
        req.flash('error', 'Cannot find that campground!')
        return res.redirect('/campgrounds')
    }
    res.render('campgrounds/edit', { campground })
}

const updateCampground = async (req, res) => {
    const { id } = req.params;
    const updatedCampground = await Campground.findByIdAndUpdate(
        id,
        { ...req.body.campground },
        { new: true },
    )
    req.flash('success', 'Successfully updated campground')
    res.redirect(`/campgrounds/${updatedCampground._id}`)
}

const deleteCampgroud = async (req, res) => {
    const { id } = req.params
    await Campground.findByIdAndDelete(id)

    req.flash('success', 'Successfully deleted a campground!')
    res.redirect('/campgrounds')
}

module.exports = {
    index,
    renderNewForm,
    createCampground,
    showCampground,
    renderEditForm, 
    updateCampground,
    deleteCampgroud
}