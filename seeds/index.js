const path = require("path");
const mongoose = require("mongoose");
const Campground = require("../models/campground");
const cities = require("./cities");
const { places, descriptors } = require("./seedHelpers");

mongoose.connect("mongodb://localhost:27017/yelp-camp");

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Database connected");
});

const sample = (array) => {
  return array[Math.floor(Math.random() * array.length)];
};

const seedDB = async () => {
  await Campground.deleteMany({});
  for (let i = 0; i < 50; i++) {
    const random1000 = Math.floor(Math.random() * 20) + 10;
    const price = Math.floor(Math.random() * 1000);
    const newCamps = new Campground({
      author: "66c4cc30ae425c6f0e678824",
      location: `${cities[random1000].city}, ${cities[random1000].state}`,
      title: `${sample(descriptors)} ${sample(places)}`,
      images: [
        {
          url: "https://res.cloudinary.com/dyoqxxjio/image/upload/v1725797740/YelpCamp/gvletfer1z7zogwspqtv.jpg",
          filename: "YelpCamp/gvletfer1z7zogwspqtv",
        },
      ],
      geometry: {
        type: "Point",
        coordinates: [-113.1331, 47.0202],
      },
      description:
        "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Natus, ab atque distinctio dolores eligendi omnis corporis similique, sunt labore molestias obcaecati consequuntur nisi ea aperiam quod. Eveniet sed rerum alias.",
      price,
    });
    await newCamps.save();
  }
};

seedDB().then(() => {
  mongoose.connection.close();
});
