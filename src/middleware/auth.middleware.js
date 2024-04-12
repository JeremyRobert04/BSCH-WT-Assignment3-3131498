// Check if the user is authenticated
module.exports.isAuth = (req, res, next) => {
  if (req.isAuthenticated()) {
    next();
  } else {
    res.status(401).json({ error: "You are not logged in" });
  }
};

// Check if the user has the role OWNER
module.exports.isOwner = (req, res, next) => {
  if (req.isAuthenticated()) {
    if (req.user.Role.RoleName == "OWNER") next();
    else {
      req.session.messages = ["You are not allowed to access this ressource."];
      return res.redirect("/");
    }
  } else {
    req.session.messages = ["You are not logged in."];
    return res.redirect("/");
  }
};
