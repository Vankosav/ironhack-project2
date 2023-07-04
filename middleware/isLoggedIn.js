module.exports = (req, res, next) => {
  // checks if the user is logged in when trying to access a specific page
  if (!req.session.currentUser && !req.session.currentProfile) {
    // return res.redirect("/user/login");
    req.isLoggedIn = false;
  }
  else req.isLoggedIn = true;

  next();
};