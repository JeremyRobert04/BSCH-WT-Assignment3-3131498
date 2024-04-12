const bodyParser = require("body-parser");
const express = require("express");
const expressLayout = require("express-ejs-layouts");
const cookieParser = require("cookie-parser");

const app = express();

// imports routes
const indexRoutes = require("../views/routes/index");
const authRoutes = require("../views/routes/auth");
const adminRoutes = require("../views/routes/admin");

const session = require("express-session");
const passport = require("passport"); // use to authenticate user
const { isOwner } = require("../middleware/auth.middleware");
const { getTags } = require("../views/controllers/tag.controller");
const path = require("path");

// Serve the /public directory so we can reference img only by doing /img/
app.use(express.static("public"));
app.use("/public/", express.static(path.resolve(__dirname, "../../public")));

// use to get req.body
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// use cookie and parse them so we can set and retrieve in req/res
app.use(cookieParser());
app.use(
  session({
    secret: "process.env.SECRET_SESSION",
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 60 * 24 },
  })
);

app.use(passport.initialize());
app.use(passport.session());

// Use Layout with Main.ejs file so header & footer are always the same
app.use(expressLayout);
app.set("layout", "./layouts/Main");
app.set("views", path.resolve(__dirname, "../../views"));
app.set("view engine", "ejs");

// Middleware to set generals variables for pages
app.use(async (req, res, next) => {
  var msgs = req.session.messages || [];
  var isAuth = req.isAuthenticated();
  var isAdmin = req.isAuthenticated() && req.user.Role.RoleName == "OWNER";
  var user = req.user;
  const tags = await getTags();

  res.locals.messages = msgs;
  res.locals.hasMessages = !!msgs.length;
  res.locals.isAuth = isAuth;
  res.locals.isAdmin = isAdmin;
  res.locals.user = user;
  res.locals.tags = tags;
  req.session.messages = [];

  next();
});

app.use("/", indexRoutes);
app.use("/", authRoutes);
app.use("/", isOwner, adminRoutes); // isOwner middleware so only ADMIN user can access theses routes

module.exports = app;
