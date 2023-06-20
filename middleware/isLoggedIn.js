module.exports = (req, res, next) => {
  // Exclude login and signup routes from redirection
  if (req.path === '/user/login' || req.path === '/user/signup') {
    return next();
  }

  // Check if the user is logged in when trying to access other pages
  if (!req.session.currentUser && !req.session.currentProfile) {
    return res.redirect("/user/login");
  } else {
    req.isLoggedIn = true;
  }

  next();
};