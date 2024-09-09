const Campground = require("../models/campground");
const { cloudinary } = require("../cloudinary");
const maptilerClient = require("@maptiler/client");
maptilerClient.config.apiKey = process.env.MAPTILER_API_KEY;

module.exports.index = async (req, res) => {
  const campgrounds = await Campground.find({});
  //console.log(JSON.stringify(campgrounds, null, 2));
  res.render("campgrounds/index", { campgrounds });
};
module.exports.renderNewForm = (req, res) => {
  res.render("campgrounds/new");
};
module.exports.createCampground = async (req, res, next) => {
  const geoData = await maptilerClient.geocoding.forward(
    req.body.campground.location,
    { limit: 1 }
  );

  const MAX_IMAGES = 5;
  // if(!req.body.campground) throw new ExpressError('Invalid Campground Data', 400 );
  // Map the uploaded files to the images array
  const images = req.files.map((f) => ({
    url: f.path,
    filename: f.filename,
  }));

  // Check if the number of images exceeds the limit
  if (images.length > MAX_IMAGES) {
    req.flash("error", `You can only upload up to ${MAX_IMAGES} images.`);
    return res.redirect("/campgrounds/new"); // Redirect back to form if limit exceeded
  }
  // Create a new campground
  const newCampground = new Campground(req.body.campground);
  //   newCampground.images = req.files.map((f) => ({
  //     url: f.path,
  //     filename: f.filename,
  //   }));
  newCampground.geometry = geoData.features[0].geometry;
  newCampground.images = images;
  newCampground.author = req.user._id;
  await newCampground.save();
  //console.log(campground);
  req.flash("success", "Successfully made a new campground");
  res.redirect(`/campgrounds/${newCampground._id}`);
};
module.exports.showCampground = async (req, res) => {
  const { id } = req.params;
  //console.log("Campground ID in showCampground: ", id);
  const campground = await Campground.findById(id)
    .populate({
      path: "reviews",
      populate: {
        path: "author",
      },
    })
    .populate("author");
  //console.log(campground);
  if (!campground) {
    req.flash("error", "Cannot find that campground");
    console.log("Campground ID: ", id);
    return res.redirect("/campgrounds");
  }
  res.render("campgrounds/show", { campground });
};
module.exports.renderEditForm = async (req, res) => {
  const { id } = req.params;
  const campground = await Campground.findById(id);
  if (!campground) {
    req.flash("error", "Cannot find that campground");
    console.log("Campground ID: ", id);
    return res.redirect("/campgrounds");
  }
  res.render("campgrounds/edit", { campground });
};
module.exports.updateCamground = async (req, res) => {
  const { id } = req.params;
  const geoData = await maptilerClient.geocoding.forward(
    req.body.campground.location,
    { limit: 1 }
  );
  const campground = await Campground.findByIdAndUpdate(id, {
    ...req.body.campground,
  });
  campground.geometry = geoData.features[0].geometry;
  const imgs = req.files.map((f) => ({
    url: f.path,
    filename: f.filename,
  }));
  const totalImages = campground.images.length + imgs.length;
  const MAX_IMAGES = 5;
  if (totalImages > MAX_IMAGES) {
    const imagesLeft = MAX_IMAGES - campground.images.length;
    req.flash(
      "error",
      `You can only upload ${imagesLeft} more image(s). Please remove some if you want to upload more.`
    );
    return res.redirect(`/campgrounds/${id}/edit`); // Redirect back to edit form
  }
  campground.images.push(...imgs);
  await campground.save();
  if (req.body.deleteImages) {
    for (let filename of req.body.deleteImages) {
      await cloudinary.uploader.destroy(filename);
    }
    await campground.updateOne({
      $pull: { images: { filename: { $in: req.body.deleteImages } } },
    });
    //console.log(campground);
  }
  req.flash("success", "Successfully updated campground");
  res.redirect(`/campgrounds/${campground._id}`);
};
module.exports.deleteCampground = async (req, res) => {
  const { id } = req.params;
  await Campground.findByIdAndDelete(id);
  req.flash("success", "Successfully deleted campground!");
  console.log("Campground ID: ", id);
  res.redirect("/campgrounds");
};
