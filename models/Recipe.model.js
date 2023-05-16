const { Schema, model } = require("mongoose");

// TODO: Please make sure you edit the User model to whatever makes sense in this case
const recipeSchema = new Schema(
  {
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
    instructions: [
        {
          stepNumber: {
            type: Number,
            required: true,
          },
          text: {
            type: String,
            required: true,
          },
        },
      ],
    dishType: {
        type: String,
        enum: ["breakfast", "main_course", "soup", "snack", "drink", "dessert", "other"]
    },
    diet: {
      type: String,
      enum: ["vegan", "vegetarian", "plant-based", "gluten-free", "omnivore"],
      required: true,
    },
    cuisine: {
        type: String,
        required: true
      },
    duration: {
        type: Number,
        required: true,
    },
    level: {
      type: String, 
      enum: ["Easy", "Medium", "Pro"]
    },
  },
 
);

const Recipe = model("Recipe", recipeSchema);

module.exports = Recipe;