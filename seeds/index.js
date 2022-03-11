if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

// Stand alone program.
const mongoose = require("mongoose");

const Campground = require("../models/campground");
const cities = require("./cities");
const { places, descriptors } = require("./seedHelpers");
const { getRandomImages } = require('./randomImages');

const dbUrl = process.env.DB_URL || "mongodb://localhost:27017/yelp-camp"
mongoose.connect(dbUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const sample = (array) => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
    await Campground.deleteMany({});
    for (let i = 0; i < 150; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 30) * 10;
        const location = `${cities[random1000].city}, ${cities[random1000].city}`;
        const randomImages = getRandomImages();

        const camp = new Campground({
            author: "622b41c954b461e372fd50b7",
            location,
            title: `${sample(descriptors)} ${sample(places)}`,
            description:
                "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Enim id officiis possimus, iusto deleniti asperiores dignissimos consequatur saepe labore nam natus animi, quisquam nisi voluptates temporibus. Numquam mollitia ratione deleniti?",
            price,
            geometry: {
                type: "Point",
                coordinates: [cities[random1000].longitude, cities[random1000].latitude]
            },
            images: randomImages
        });
        await camp.save();
    }
};

seedDB().then(() => mongoose.connection.close());
