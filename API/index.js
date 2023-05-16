const axios = require("axios");

async function getRecipeByIngredients(ingredientsArray) {
    console.log('INGREDIENTS: ', ingredientsArray.toString())
  const options = {
    method: "GET",
    url: "https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/findByIngredients",
    params: {
      ingredients: ingredientsArray.toString(),
      number: "5",
      ignorePantry: "true",
      ranking: "1",
    },
    headers: {
      "X-RapidAPI-Key": process.env.API_KEY,
      "X-RapidAPI-Host": "spoonacular-recipe-food-nutrition-v1.p.rapidapi.com",
    },
  };

  try {
    const response = await axios.request(options);
    return response.data;
  } catch (error) {
    console.error(error);
  }
}


async function getRecipeInformation(id) {
    //console.log('INGREDIENTS: ', ingredientsArray.toString())
  const options = {
    method: "GET",
    url: `https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/${id}/information`,
    params: {
      includeNutrition: true,
    },
    headers: {
      "X-RapidAPI-Key": process.env.API_KEY,
      "X-RapidAPI-Host": "spoonacular-recipe-food-nutrition-v1.p.rapidapi.com",
    },
  };

  try {
    const response = await axios.request(options);
    console.log(response.data)
    return response.data;
  } catch (error) {
    console.error(error);
  }
}

// getRecipeByIngredients(['spinach', 'onion']);

// export getRecipeByInfredients function so we can use it in other files
module.exports = {getRecipeByIngredients, getRecipeInformation};