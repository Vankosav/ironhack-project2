const router = require("express").Router();

const User = require("../models/User.model");

const Recipe = require("../models/Recipe.model");


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