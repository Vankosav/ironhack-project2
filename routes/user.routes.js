const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const saltRounds = 10;
const User = require("../models/User.model");
const Profile = require("../models/Profile.model")

const isLoggedOut = require("../middleware/isLoggedOut");
const isLoggedIn = require("../middleware/isLoggedIn");
const mongoose = require("mongoose");




// GET /auth/signup
router.get("/signup", isLoggedOut, (req, res, next) => {
  res.render("user/signup");
});

// POST /auth/signup WATCH JUNE 15 CLASS for this
router.post("/signup", isLoggedOut, async (req, res, next) => {
  const { name, email, password } = req.body;

  // Check that username, email, and password are provided
  if (!name || !email || !password) {
    res.status(400).render("user/signup", {
      errorMessage:
        "All fields are mandatory. Please provide your name, email and password.",
    });

    return;
  }

  if (password.length < 6) {
    return res.status(400).render("user/signup", {
      errorMessage: "Your password needs to be at least 6 characters long.",
    });
  }

  try {
    const existingUser = await User.findOne({ $or: [{ name }, { email }] });
    
    if (existingUser) {
      res.status(400).render("user/signup", {
        errorMessage: "The user already exists, please Login.",
      });
      return;
    }
  } catch (error) {
    next(error);
    return;
  }

  bcrypt
    .genSalt(saltRounds)
    .then((salt) => bcrypt.hash(password, salt))
    .then((hashedPassword) => {
      // Create a user and save it in the database
      return User.create({ name, email, password: hashedPassword });
    })
    .then((user) => {
      req.session.currentUser = user.toObject();
      res.redirect("/profile/create-profile");
    })
    .catch((error) => {
      if (error instanceof mongoose.Error.ValidationError) {
        res.status(500).render("user/signup", { errorMessage: error.message });
      } else if (error.code === 11000) {
        console.log(error.message)
        res.status(500).render("user/signup", {
          errorMessage:
            "Email needs to be unique. Provide a valid email.",
        });
      } else {
        next(error);
      }
    });
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
         
      
          if (req.session.currentUser.profile) {
            console.log(req.session.currentUser);
           res.redirect("/profile/kitchen-overview");
         } else {
           console.log(req.session.currentUser.profile);
           // if user has a profile redirecto /kitchen-overview
           // if not to create-profile
           res.redirect(`/profile/create-profile?name=${user.name}`);
         }
       })

       .catch((err) => next(err)); // In this case, we send error handling to the error handling middleware.
   })
   .catch((err) => next(err));
});





module.exports = router;
