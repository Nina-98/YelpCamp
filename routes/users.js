const express = require("express");
const router = express.Router();
const passport = require("passport");
const catchAsync = require("../utils/catchAsync");
const User = require("../models/user");
const { isLoggedIn, storeReturnTo } = require("../middleware");
const user = require("../controllers/users");

router
  .route("/register")
  .get(user.renderRegisterForm)
  .post(catchAsync(user.registerUser));

//router.get("/register", user.renderRegisterForm);

// router.post(
//   "/register",
//   catchAsync(async (req, res, next) => {
//     try {
//       const { email, username, password } = req.body;
//       const user = new User({ email, username });
//       const registeredUser = await User.register(user, password);
//       console.log(registeredUser);
//       req.flash("success", "Welcome to Yelp Camp!");
//       res.redirect("/campgrounds");
//     } catch (e) {
//       req.flash("error", e.message);
//       res.redirect("/register");
//     }
//   })
// );

//router.post("/register", catchAsync(user.registerUser));

router
  .route("/login")
  .get(user.renderLoginForm)
  .post(
    storeReturnTo,
    passport.authenticate("local", {
      failureFlash: true,
      failureRedirect: "/login",
    }),
    user.loginUser
  );

// router.get("/login", user.renderLoginForm);

// router.post(
//   "/login",
//   storeReturnTo,
//   passport.authenticate("local", {
//     failureFlash: true,
//     failureRedirect: "/login",
//   }),
//   user.loginUser
// );

router.get("/logout", user.logoutUser);

module.exports = router;
