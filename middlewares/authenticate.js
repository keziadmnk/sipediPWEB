const authenticate = (req, res, next) => {
  // Check if the user is authenticated
  if (req.isAuthenticated()) {
    return next(); // User is authenticated, proceed to the next middleware or route handler
  }
  
  // If not authenticated, redirect to the login page
  res.redirect('/login');
}

module.exports = authenticate;