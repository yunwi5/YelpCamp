const mongoose = require('mongoose')
const Review = require('./review')
const Schema = mongoose.Schema

// Thumbnail img url example
// https://res.cloudinary.com/diglbnk1i/image/upload/w_300/v1646583736/YelpCamp/keqcxeiyk63lgtl26y0o.jpg

const ImageSchema = new Schema({
    url: String,
    filename: String
})

// This is not stored in the database.
ImageSchema.virtual('thumbnail').get(function () {
    return this.url.replace('/upload', '/upload/w_200');
})

const CampGroundSchema = new Schema({
    title: String,
    images: [ImageSchema],
    price: Number,
    description: String,
    location: String,
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    reviews: [{ type: Schema.Types.ObjectId, ref: 'Review' }],
})

CampGroundSchema.post('findOneAndDelete', async function (doc) {
    if (doc) {
        await Review.deleteMany({
            _id: {
                $in: doc.reviews
            }
        })
    }
})

module.exports = mongoose.model('Campground', CampGroundSchema)
