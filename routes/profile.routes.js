const router = require("express").Router();

const User = require("../models/User.model");

const Recipe = require("../models/Recipe.model");

const isLoggedOut = require("../middleware/isLoggedOut");
const isLoggedIn = require("../middleware/isLoggedIn");

// require middleware login

// GET /create-profile
router.get("/create-profile", isLoggedIn, (req, res) => {
  res.render("profile/create-profile");
});

router.get("user/login", isLoggedIn, (req, res) => {
  res.render("profile/create-profile");
});

router.get("/your-recipes", (req, res) => {
    res.render("profile/new-recipe.hbs");
});


router.post("/your-recipes", async (req, res) => {
   
    try {
         const newRecipe = await Recipe.create(req.body);
         console.log("Recipe created:", newRecipe);
         res.redirect("/recipes");
       }
       catch (err) {
         console.log("Recipe couldn't be created:", err);
         res.send("Error");
   }
 });



module.exports = router;