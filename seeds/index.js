const mongoose = require("mongoose");

const Campground = require("../models/campground");
const cities = require("./cities");
const { places, descriptors } = require("./seedHelpers");

mongoose.connect("mongodb://localhost:27017/yelp-camp", {
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

        const camp = new Campground({
            author: "6221eebec8e8afe7c6f27942",
            location,
            title: `${sample(descriptors)} ${sample(places)}`,
            description:
                "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Enim id officiis possimus, iusto deleniti asperiores dignissimos consequatur saepe labore nam natus animi, quisquam nisi voluptates temporibus. Numquam mollitia ratione deleniti?",
            price,
            geometry: {
                type: "Point",
                coordinates: [cities[random1000].longitude, cities[random1000].latitude]
            },
            images: [
                {
                    url:
                        "https://res.cloudinary.com/diglbnk1i/image/upload/v1646577070/YelpCamp/dvamxvdwirgc60jzlp6z.jpg",
                    filename: "YelpCamp/dvamxvdwirgc60jzlp6z"
                },
                {
                    url:
                        "https://res.cloudinary.com/diglbnk1i/image/upload/v1646577072/YelpCamp/wczxowmewtqqhu91jjwo.jpg",
                    filename: "YelpCamp/wczxowmewtqqhu91jjwo"
                },
                {
                    url:
                        "https://res.cloudinary.com/diglbnk1i/image/upload/v1646577075/YelpCamp/fh6aywzvthlzjz5cu0ih.jpg",
                    filename: "YelpCamp/fh6aywzvthlzjz5cu0ih"
                }
            ]
        });
        await camp.save();
    }
};

seedDB().then(() => mongoose.connection.close());
