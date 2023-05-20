const { Schema, model } = require("mongoose");

const recipeSchema = new Schema({
  author: {
    type: Schema.Types.ObjectId,
    ref: 'Profile',
  },
  title: {
    type: String,
    required: true,
    trim: true,
  },
  ingredients: {
    type: [String],
    required: true,
    trim: true,
  },
  instructions: {
    type: [String],
    required: true,
    trim: true,
  },
  dishType: {
    type: String,
    enum: ["Breakfast", "Main Course", "Soup", "Snack", "Drink", "Dessert", "Other"],
    required: true,
  },
  diet: {
    type: String,
    enum: ["Vegan", "Vegetarian", "Plant based", "Gluten free", "Omnivore"],
    required: true,
  },
  cuisine: {
    type: String,
    enum: ["African", "Asian", "European", "North American", "South American", "Oceanian"],
    required: true,
  },
  duration: {
    type: Number,
    required: true,
  },
  level: {
    type: String,
    enum: ["Easy", "Medium", "Pro"],
  },
});

const Recipe = model("Recipe", recipeSchema);

module.exports = Recipe;
