const mongoose = require('mongoose')
const Review = require('./review')
const Schema = mongoose.Schema

const ImageSchema = new Schema({
    url: String,
    filename: String
})

// This is not stored in the database.
ImageSchema.virtual('thumbnail').get(function () {
    return this.url.replace('/upload', '/upload/w_200');
})

const options = { toJSON: { virtuals: true } };

const CampGroundSchema = new Schema({
    title: String,
    images: [ImageSchema],
    price: Number,
    description: String,
    location: String,
    geometry: {
        type: {
            type: String,
            enum: ['Point'],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    reviews: [{ type: Schema.Types.ObjectId, ref: 'Review' }]
}, options);

// Virtual property
CampGroundSchema.virtual('properties').get(function () {
    return {
        link: `/campgrounds/${this._id}`,
        title: this.title,
        description: this.description.substring(0, 20) + '...'
    }
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
