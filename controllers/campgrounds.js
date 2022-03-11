const { cloudinary } = require('../cloudinary');

const Campground = require("../models/campground");
const { getGeoData } = require('../utils/geomap');

const index = async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render("campgrounds/index", { campgrounds });
};

const renderNewForm = (req, res) => {
    res.render("campgrounds/new");
};

const createCampground = async (req, res, next) => {
    const geoDataGeometry = await getGeoData(req.body.campground.location);

    const campground = new Campground(req.body.campground);
    campground.images = req.files.map((f) => ({ url: f.path, filename: f.filename }));
    campground.author = req.user._id;
    campground.geometry = geoDataGeometry;

    await campground.save();
    console.log(campground);

    req.flash("success", "Successfully made a new campground!");
    res.redirect(`/campgrounds/${campground._id}`);
};

const showCampground = async (req, res) => {
    const campground = await Campground.findById(req.params.id)
        .populate({
            path: "reviews",
            populate: {
                path: "author"
            }
        })
        .populate("author");
    // Not yet populated, so author is user_id.
    if (!campground) {
        req.flash("error", "Cannot find that campground!");
        return res.redirect("/campgrounds");
    }
    // parameter of populate() is name of the property (reviews), not the nmae of the model (Review)
    req.flash("success", "Successfully updated campground!");
    res.render("campgrounds/show", { campground });
};

const renderEditForm = async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    if (!campground) {
        req.flash("error", "Cannot find that campground!");
        return res.redirect("/campgrounds");
    }
    // console.log('campground:', campground);
    res.render("campgrounds/edit", { campground });
};

const updateCampground = async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(
        id,
        { ...req.body.campground },
        { new: true }
    );
    const images = req.files.map((f) => ({ url: f.path, filename: f.filename }));
    // ...images not [...images]
    campground.images.push(...images);
    console.log(campground.images);
    await campground.save();

    if (req.body.deleteImages) {
        for (let filename of req.body.deleteImages) {
            if (filename) await cloudinary.uploader.destroy(filename);
        }
        // $pull means pull out of the array
        await campground.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } });
    }

    req.flash("success", "Successfully updated campground");
    res.redirect(`/campgrounds/${campground._id}`);
};

const deleteCampgroud = async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);

    req.flash("success", "Successfully deleted a campground!");
    res.redirect("/campgrounds");
};

module.exports = {
    index,
    renderNewForm,
    createCampground,
    showCampground,
    renderEditForm,
    updateCampground,
    deleteCampgroud
};
