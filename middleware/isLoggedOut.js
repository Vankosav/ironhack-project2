module.exports = (req, res, next) => {
  // if an already logged in user tries to access the login page it
  // redirects the user to the home page
  if (req.session.currentUser) {
    req.isLoggedIn = false;
  }
  else req.isLoggedIn = true;
  next();
};
