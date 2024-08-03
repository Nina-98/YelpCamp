const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const reviewShema = new Schema({
  body: String,
  rating: Number,
});

module.exports = mongoose.model("Review", reviewShema);
