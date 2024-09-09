const mongoose = require("mongoose");
const Review = require("./review");
const { required } = require("joi");
const { coordinates } = require("@maptiler/client");
const Schema = mongoose.Schema;

const opts = { toJSON: { virtuals: true } };

const CampgroundSchema = new Schema(
  {
    title: String,
    // images: [{ url: String, filename: String }],
    images: {
      type: [
        {
          url: String,
          filename: String,
        },
      ],
      validate: [arrayLimit, "{PATH} exceeds the limit of 5 images"],
    },
    geometry: {
      type: {
        type: String,
        enum: ["Point"],
        required: true,
      },
      coordinates: {
        type: [Number],
        required: true,
      },
    },
    price: Number,
    description: String,
    location: String,
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    reviews: [
      {
        type: Schema.Types.ObjectId,
        ref: "Review",
      },
    ],
  },
  opts
);

CampgroundSchema.virtual("properties.popUpMarkup").get(function () {
  return `
  <strong><a href="/campgrounds/${this._id}">${this.title}</a></strong>
  <p>${this.description.substring(0, 60)}...</p>`;
});

function arrayLimit(val) {
  return val.length <= 5;
}

//middlewhare for deleting the reviews when the we delete a campground

CampgroundSchema.post("findOneAndDelete", async function (doc) {
  if (doc) {
    await Review.deleteMany({
      _id: {
        $in: doc.reviews,
      },
    });
  }
});

module.exports = mongoose.model("Campground", CampgroundSchema);
