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




router.post("/your-recipes", async (req, res) => {
   
    try {
         const newRecipe = await Recipe.create(req.body);
         console.log("Recipe created:", newRecipe);
         res.redirect("/profile/your-recipes");
       }
       catch (err) {
         console.log("Recipe couldn't be created:", err);
         res.send("Error");
   }
 });

router.get('/your-recipes', async (req, res) => {
    try {
      const recipes = await Recipe.find(); 
      res.render('profile/new-recipe.hbs', { recipes }); 
    } catch (err) {
      console.log(err);
      res.status(500).send('Internal Server Error');
    } 
  });

  router.get("/your-recipes/details/:id", async (req, res) => {
    try { const recipe = req.params.id;
     await Recipe.findById(recipe)
         res.render("profile/recipe-details.hbs", { recipe });
       } catch (err) {
         console.log(err);
         res.status(500).send('Internal Server Error');
       }
       });

router.get("/your-recipes/delete/:id", async (req, res) => {
   try { const recipe = req.params.id;
    await Recipe.findByIdAndDelete(recipe)
        res.render("profile/recipe-deleted.hbs", { recipe });
      } catch (err) {
        console.log(err);
        res.status(500).send('Internal Server Error');
      }
      });

module.exports = router;