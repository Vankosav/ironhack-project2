const router = require("express").Router();

const User = require("../models/User.model");
const Profile = require("../models/Profile.model");


// we need to require our getRecipeByIngredients function here
const {getRecipeByIngredients, getRecipeInformation} = require("../API/index")

const Recipe = require("../models/Recipe.model");

const isLoggedOut = require("../middleware/isLoggedOut");
const isLoggedIn = require("../middleware/isLoggedIn");

// require middleware login

// GET /profile/create-profile
router.get("/create-profile", isLoggedIn, async (req, res) => {

   try {
    const user = await User.findById(req.session.currentUser._id);
    console.log(user)
    const username = user.username;
    console.log(username)
    res.render("profile/create-profile", { username });
  } catch (error) {
    next(error);
  }
});

router.get("user/login", isLoggedIn, (req, res) => {
  res.render("profile/create-profile");
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
        try {
          const recipeId = req.params.id;
          const recipe = await Recipe.findById(recipeId);
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

// GET /profile/kitchen
router.get("/kitchen-overview", isLoggedIn, (req, res) => {
  res.render("profile/kitchen-overview.hbs");
});

// POST /profile/create-profile
router.post("/create-profile", async (req, res) => {
  try {
    const { username, diet, country } = req.body;

    // Create a new profile with the fixed username
    const profile = new Profile({
      user: req.session.currentUser._id,
      username,
      diet,
      country,
    });

    await profile.save();
 console.log("Redirecting to kitchen");

    res.redirect("/profile/kitchen-overview"); // Redirect to kitchen-state.hbs
  } catch (error) {
    next(error);
  }
});

// POST ROUTE FOR THE GETRECIPEBYINGREDIENTS function
router.post("/kitchen-overview", async (req, res) => {
  try {
    const ingredientsArray = req.body.ingredient; 
    console.log('INGREDIENTS: ', ingredientsArray );
    const recipes = await getRecipeByIngredients(ingredientsArray); 
    console.log(recipes);
     res.render("profile/kitchen-details.hbs", { recipes });
  } catch (error) {
    console.error(error);
    res.send("Error");
  }
});
// we get the array of ingredients from the body of our form


// GET /profile/recipes
router.get("/kitchen-details", isLoggedIn, (req, res) => {
  res.render("profile/kitchen-details.hbs");
});

// GET /profile/recipe-list-details
router.get("/kitchen-recipes", isLoggedIn, async (req, res) => {
  const recipeId = req.query.recipeId;
  try {
    const recipeInformation = await getRecipeInformation(recipeId);
    res.render("profile/kitchen-recipes.hbs", { recipeInformation });
  } catch (error) {
    console.error(error);
    res.send("Error");
  }
});

module.exports = router;