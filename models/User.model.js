const { Schema, model } = require("mongoose");

// TODO: Please make sure you edit the User model to whatever makes sense in this case
const userSchema = new Schema(
  {
  name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
     profile: {
      type: Schema.Types.ObjectId,
      ref: "Profile",
    },
    // ADD A RECIPE ARRAY like the profile but it's an array
    recipes: [{
      type: Schema.Types.ObjectId,
      ref: 'Recipe',
    }],
  },
  {
    // this second object adds extra properties: `createdAt` and `updatedAt`
    timestamps: true,
  }
);

const User = model("User", userSchema);

module.exports = User;
