const User = require("../models/user");

module.exports.renderRegisterForm = (req, res) => {
  res.render("users/register");
};
module.exports.registerUser = async (req, res, next) => {
  try {
    const { email, username, password } = req.body;
    const user = new User({ email, username });
    const registeredUser = await User.register(user, password);
    req.login(registeredUser, (err) => {
      if (err) return next(err);
      req.flash("success", "Welcome to Yelp Camp!");
      console.log("Campground ID: ", id);
      res.redirect("/campgrounds");
    });
  } catch (e) {
    req.flash("error", e.message);
    res.redirect("register");
  }
};
module.exports.renderLoginForm = (req, res) => {
  //console.log(req.body);
  res.render("users/login");
};
module.exports.loginUser = (req, res, next) => {
  req.flash("success", "welcome back");
  const redirectUrl = res.locals.returnTo || "/campgrounds";
  delete req.session.returnTo; // this is to delete the url from the sesion
  res.redirect(redirectUrl);
};
module.exports.logoutUser = (req, res) => {
  req.logOut(function (err) {
    if (err) {
      return next(err);
    }
    req.flash("success", "Goodbye!");
    //console.log("Campground ID: ", id);
    res.redirect("/campgrounds");
  });
};
