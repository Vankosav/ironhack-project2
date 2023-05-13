const { Schema, model } = require("mongoose");

const profileSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  username: {
    type: String,
    required: true,
  },
  diet: {
    type: String,
    required: true,
  },
  country: {
    type: String,
    required: true,
  },
});

const Profile = model("Profile", profileSchema);

module.exports = Profile;
