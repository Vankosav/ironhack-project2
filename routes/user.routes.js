const express = require("express");
const router = express.Router();

// ℹ️ Handles password encryption
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");

// How many rounds should bcrypt run the salt (default - 10 rounds)
const saltRounds = 10;

// Require the User model in order to interact with the database
const User = require("../models/User.model");
const Profile = require("../models/Profile.model")
const Recipe = require("../models/Recipe.model");

// Require necessary (isLoggedOut and isLiggedIn) middleware in order to control access to specific routes
const isLoggedOut = require("../middleware/isLoggedOut");
const isLoggedIn = require("../middleware/isLoggedIn");

// GET /auth/signup
router.get("/signup", isLoggedOut, (req, res, next) => {
  res.render("user/signup");
});

// POST /auth/signup WATCH JUNE 15 CLASS for this
router.post("/signup", async (req, res, next) => {
  const { name, email, password } = req.body;

  // Check that username, email, and password are provided
  if (!name || !email || !password) {
    return res.render("user/signup", {
      errorMessage:
        "All fields are mandatory. Please provide your name, email, and password.",
    });
  }

  if (password.length < 6) {
    return res.status(400).render("user/signup", {
      errorMessage: "Your password needs to be at least 6 characters long.",
    });
  }

  try {
    const existingUser = await User.findOne({ $or: [{ name }, { email }] });
    if (existingUser) {
      return res.status(400).render("user/signup", {
        errorMessage: "The email already exists. Please login.",
      });
    }

    // Create a new user - start by hashing the password
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const newUser = await User.create({ name, email, password: hashedPassword });

    // Add the user to the session
    req.session.currentUser = newUser.toObject();

    // Redirect the user to the profile creation page
    return res.redirect(`/profile/create-profile?isLoggedIn=true&name=${newUser.name}`);
  } catch (error) {
    next(error);
  }
});


// GET /auth/login
router.get("/login", isLoggedOut, (req, res) => {
  res.render("user/login");
});


// POST /auth/login
router.post("/login", isLoggedOut, (req, res, next) => {
  const {email, password } = req.body;

  // Check that email, and password are provided
  if (email === "" || password === "") {
    res.status(400).render("user/login", {
      errorMessage:
        "All fields are mandatory. Please provide name, email and password.",
    });

    return;
  }

  // Here we use the same logic as above
  // - either length based parameters or we check the strength of a password
  if (password.length < 6) {
    return res.status(400).render("user/login", {
      errorMessage: "Your password needs to be at least 6 characters long.",
    });
  }

  // Search the database for a user with the email submitted in the form
  User.findOne({ email })
    .then((user) => {
      // If the user isn't found, send an error message that user provided wrong credentials
      if (!user) {
        res
          .status(400)
          .render("user/login", { errorMessage: "Wrong credentials." });
        return;
      }

      // If user is found based on the username, check if the in putted password matches the one saved in the database
      bcrypt
        .compare(password, user.password)
        .then((isSamePassword) => {
          if (!isSamePassword) {
            res
              .status(400)
              .render("user/login", { errorMessage: "Wrong credentials." });
            return;
          }
          console.log('USER: ', user);
          // Add the user object to the session object
          req.session.currentUser = user.toObject();
          // Remove the password field
          delete req.session.currentUser.password;
         
      
          // HERE WE NEED TO CHECK FOR A PROFILE RELATED TO THIS USER
          Profile.findOne({user: user._id})
          .then((profile)=>{
            console.log('THIS IS THE PROFILE: ', profile);
            if(profile){
              const newProfile = 
              Profile.create({ username, diet, country })
  .then((newProfile) => {
    req.session.currentProfile = newProfile.toObject();
    res.redirect("/profile/kitchen-overview");
  })
  .catch((err) => next(err));

              // Add the user to the session
              req.session.currentProfile = newProfile.toObject();
              res.redirect(`/profile/kitchen-overview?isLoggedIn=${req.isLoggedIn}&username=${user.name}`);


            }
            else{
              res.redirect(`/profile/create-profile?isLoggedIn=${req.isLoggedIn}&username=${user.name}`);
            }
          })
        })

        .catch((err) => next(err)); 
    })
    .catch((err) => next(err));
});

// GET /auth/logout
router.get("/logout", isLoggedIn, (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      res.status(500).render("user/logout", { errorMessage: err.message, isLoggedIn: req.isLoggedIn });
      return;
    }

    res.redirect("/");
  });
});

module.exports = router;
