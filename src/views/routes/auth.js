const express = require("express");
const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;

const prisma = new PrismaClient();

passport.serializeUser((user, done) => {
  done(null, user.UserId);
});

// deserialize User to get the required informations
passport.deserializeUser(async (userId, done) => {
  await prisma.user
    .findUnique({
      where: { UserId: userId },
      select: {
        UserId: true,
        FirstName: true,
        LastName: true,
        EmailAddress: true,
        Role: {
          select: {
            RoleId: true,
            RoleName: true,
          },
        },
        Posts: true,
        Comments: true,
        created_at: true,
      },
    })
    .then((user) => {
      done(null, user);
    })
    .catch((err) => {
      done(err);
    });
});

// define local strategy to authenticate user using email/password validation
passport.use(
  new LocalStrategy(
    { usernameField: "emailAddress" },
    async (emailAddress, password, done) => {
      try {
        const user = await prisma.user.findUnique({
          where: {
            EmailAddress: emailAddress,
          },
        });

        if (!user) {
          return done(null, false, {
            message: "This email address does not match any record",
          });
        }

        // compare passwords
        if (!(await bcrypt.compare(password, user.PasswordHash))) {
          return done(null, false, { message: "Invalid password" });
        }

        return done(null, user);
      } catch (error) {
        return done(error);
      }
    }
  )
);

const router = express.Router();

// Login page
router.get("/login", async (req, res) => {
  var locals = {
    pageTitle: "Travel Guider - Login",
    pageDescription: "Travel Guider login page",
  };
  res.render("Login", { locals });
});

// Form: login a user
router.post(
  "/login",
  passport.authenticate("local", {
    successReturnToOrRedirect: "/",
    failureRedirect: "/login",
    failureMessage: true,
  })
);

// Register Page
router.get("/register", async (req, res) => {
  var locals = {
    pageTitle: "Travel Guider - Register",
    pageDescription: "Travel Guider register page",
  };

  res.render("Register", { locals });
});

// Form: create a new user
router.post("/register", async (req, res) => {
  try {
    const { firstname, lastname, emailAddress, password } = req.body;

    const fieldErrorMessages = {
      firstname: "First name is missing.",
      lastname: "Last name is missing.",
      emailAddress: "Email address is missing.",
      password: "Password is missing.",
    };

    const missingFields = [];

    // check if any of the fields is missing and append an error message
    if (!firstname) missingFields.push("firstname");
    if (!lastname) missingFields.push("lastname");
    if (!emailAddress) missingFields.push("emailAddress");
    if (!password) missingFields.push("password");

    if (missingFields.length > 0) {
      const errorMessage = missingFields.map(
        (field) => fieldErrorMessages[field]
      );

      req.session.messages = errorMessage;
      return res.redirect("/register");
    }

    // check if a user with this emailAddress already exists
    const existingUser = await prisma.user.findUnique({
      where: { EmailAddress: emailAddress },
    });

    if (existingUser) {
      req.session.messages = [
        "An account with this email address already exists.",
      ];
      return res.redirect("/register");
    }

    // If role "USER" does not exists, create it or do nothing
    const userRole = await prisma.role
      .upsert({
        where: {
          RoleName: "USER",
        },
        update: {},
        create: {
          RoleName: "USER",
        },
      })
      .catch((err) => {
        console.error(err);
      });

    // Hash the user password to not store it clear in database
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = await prisma.user.create({
      data: {
        FirstName: firstname,
        LastName: lastname,
        EmailAddress: emailAddress,
        RoleId: userRole.RoleId,
        PasswordHash: hashedPassword,
      },
      select: {
        UserId: true,
        FirstName: true,
        LastName: true,
        EmailAddress: true,
        RoleId: true,
        Role: true,
        Posts: true,
        Comments: true,
        created_at: true,
      },
    });

    req.login(newUser, (err) => {
      if (err) {
        return next(err);
      }
      return res.redirect("/");
    });

  } catch (error) {
    req.session.messages = ["An error occured during user creation."];
    return res.redirect("/register");
  }
});

// logout the user
router.post("/logout", (req, res) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
});

module.exports = router;
