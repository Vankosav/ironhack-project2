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
    console.log('trying to push')
    const name = user.name;
    console.log(name)
    res.render("profile/create-profile", { name, isLoggedIn: req.isLoggedIn });
  } catch (error) {
    console.log(error);
    res.send("Error");
  }
});

// POST /profile/create-profile
router.post("/create-profile", isLoggedIn, async (req, res) => {
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
console.log(profile);
res.redirect( "/profile/kitchen-overview", {isLoggedIn: req.isLoggedIn}, {profile}); // Redirect to kitchen-state.hbs
  } catch (error) {
    console.error(error);
    res.send("Error");
  }
});


 //HOW CAN I SHOW ON THIS PAGE THE USERNAME FROM ONCE THE PROFILE IS BEING CREATED SO IT SAYS YOUR RECIPES, USERNAME NOT NAME 
 router.get('/your-recipes', isLoggedIn, async (req, res) => {
  try {
    const name = req.session.currentUser.name; // Retrieve the username from the currentUser object
    const recipes = await Recipe.find(); 
    res.render('profile/new-recipe.hbs', { recipes, isLoggedIn: req.isLoggedIn, name }); 
  } catch (err) {
    console.log(err);
    res.status(500).send('Internal Server Error');
  } 
});

 router.post("/your-recipes", isLoggedIn, async (req, res) => {
  const name = req.session.currentUser.name;
  try {
    
    const newRecipe = await Recipe.create(req.body); 
    console.log("Recipe created:", newRecipe, name);
    res.redirect(`/profile/your-recipes?isLoggedIn=true&name=${name}`);
  } catch (err) {
    console.log("Recipe couldn't be created:", err);
    res.send("Error");
  }
});


router.get("/your-recipes/details/:id", isLoggedIn, async (req, res) => {
  const name = req.session.currentUser.name;
    try {
      
      const recipeId = req.params.id;
      const recipe = await Recipe.findById(recipeId);
      console.log(name);
      res.render("profile/recipe-details.hbs", { recipe, isLoggedIn: req.isLoggedIn, name});
    } catch (err) {
      console.log(err);
      res.status(500).send('Internal Server Error');
    }
  });


  router.get("/your-recipes/edit-recipe/:id", isLoggedIn, async (req, res) => {
    const name = req.session.currentUser.name;
    const recipeId = req.params.id;
    try {
      const recipe = await Recipe.findById(recipeId);
      if (!recipe) {
        // Recipe not found, handle the error appropriately
        return res.status(404).render("error/404");
      }
  
      // Render the edit recipe form template with the recipe data
      res.render("profile/edit-recipe", { recipe, isLoggedIn: req.isLoggedIn, name });
    } catch (error) {
      console.error("Failed to fetch recipe:", error);
      res.status(500).send("Failed to fetch recipe");
    }
  });
  

  router.post("/your-recipes/edit-recipe/:id", isLoggedIn, async (req, res) => {
    //const name = req.session.currentUser.name; where to put this one?
    const recipeId = req.params.id;
    const updatedRecipe = req.body;
  
    try {
      const recipe = await Recipe.findByIdAndUpdate(recipeId, updatedRecipe, {
        new: true,
      });
      if (!recipe) {
        // Recipe not found, handle the error appropriately
        return res.status(404).render("error/404");
      }
  
      // Render a success message or redirect to the recipe details page
     
      res.redirect(`/profile/your-recipes/details/${recipe._id}`);
    } catch (error) {
      console.error("Failed to update recipe:", error);
      res.status(500).send("Failed to update recipe");
    }
  });
  
  
  

router.get("/your-recipes/delete/:id", isLoggedIn, async (req, res) => {
  const name = req.session.currentUser.name;
   try { const recipe = req.params.id;
    await Recipe.findByIdAndDelete(recipe)
        res.render("profile/recipe-deleted.hbs", { recipe, isLoggedIn: req.isLoggedIn, name });
      } catch (err) {
        console.log(err);
        res.status(500).send('Internal Server Error');
      }
      });




// GET /profile/kitchen
router.get("/kitchen-overview", isLoggedIn, (req, res) => {
  const name = req.session.currentUser.name;
  console.log(name);
  res.render("profile/kitchen-overview.hbs", { isLoggedIn: req.isLoggedIn, name });
});

// POST ROUTE FOR THE GETRECIPEBYINGREDIENTS function
router.post("/kitchen-overview", isLoggedIn, async (req, res) => {
  
  try {
    const name = req.session.currentUser.name;
    const ingredientsArray = req.body.ingredient; 
    console.log('INGREDIENTS: ', ingredientsArray );
    const recipes = await getRecipeByIngredients(ingredientsArray); 
    console.log(name);
     res.render("profile/kitchen-details.hbs", { recipes, isLoggedIn: req.isLoggedIn, name  });
  } catch (error) {
    console.error(error);
    res.send("Error");
  }
});
// we get the array of ingredients from the body of our form


// GET /profile/recipes
router.get("/kitchen-details", isLoggedIn, (req, res) => {
  const name = req.session.currentUser.name;
  console.log(name);
  res.render("profile/kitchen-details.hbs", { isLoggedIn: req.isLoggedIn, name });
});

// GET /profile/recipe-list-details
router.get("/kitchen-recipes", isLoggedIn, async (req, res) => {
  const recipeId = req.query.recipeId;
  const name = req.session.currentUser.name;
  try {
    const recipeInformation = await getRecipeInformation(recipeId);
    console.log(name);
    res.render("profile/kitchen-recipes.hbs", { recipeInformation, isLoggedIn: req.isLoggedIn, name });
  } catch (error) {
    console.error(error);
    res.send("Error");
  }
});

router.get("/community-recipes", isLoggedIn, async (req, res) => {
  const name = req.session.currentUser.name;
  try {
    const recipes = await Recipe.find(); 
    console.log(name);
    res.render("profile/community-recipes.hbs", { recipes, isLoggedIn: req.isLoggedIn, name });
  } catch (err) {
    console.log(err);
    res.status(500).send('Internal Server Error');
  } 
});
  

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