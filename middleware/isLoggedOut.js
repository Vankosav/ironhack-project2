module.exports = (req, res, next) => {
  if (req.session.currentUser || req.session.currentProfile) {
    // If the user is already logged in, redirect to a different page
    req.isLoggedIn = false;
  }
  else req.isLoggedIn = true;

  next();
};