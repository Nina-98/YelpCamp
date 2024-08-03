const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const Campground = require('../models/campground');
const cities = require('./cities');
const {places, descriptors} = require('./seedHelpers');

mongoose.connect('mongodb://localhost:27017/yelp-camp');

const db=mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () =>{
    console.log("Database connected");
});

const sample = (array) => {
    return array[Math.floor(Math.random() * array.length)];
}

const seedDB = async () =>{
    await Campground.deleteMany({});
    for(let i=0; i<50; i++){
        const random1000 = Math.floor(Math.random() * 20) + 10;
        const price = Math.floor(Math.random() * 1000);
        const newCamps = new Campground({
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            image: 'https://farm4.staticflickr.com/3795/10131087094_c1c0a1c859.jpg',
            description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Natus, ab atque distinctio dolores eligendi omnis corporis similique, sunt labore molestias obcaecati consequuntur nisi ea aperiam quod. Eveniet sed rerum alias.',
            price
        })
        await newCamps.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
})

