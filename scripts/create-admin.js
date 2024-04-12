/**
 * This file is a short script to create a new admin user in the database
 */

const bcrypt = require("bcrypt");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const readline = require("readline").createInterface({
  input: process.stdin,
  output: process.stdout,
});

/**
 * Function to get input from user
 * @param {*} textToDisplay String: the text that will be displayed in the console to ask the user
 * @returns string: the user input
 */
const askUser = async (textToDisplay) => {
  return new Promise((resolve) => {
    readline.question(textToDisplay, (input) => {
      resolve(input);
    });
  });
};

const main = async () => {
  var data = {
    FirstName: await askUser("Enter your first name: "),
    LastName: await askUser("Enter your last name: "),
    EmailAddress: await askUser("Enter your email address: "),
    PasswordHash: await bcrypt.hash(await askUser("Enter your password: "), 10),
    RoleId: null,
  };

  // Create a new role "USER" if not exists or do nothing
  await prisma.role
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

  // Create a new role "OWNER" if not exists or do nothing
  await prisma.role
    .upsert({
      where: {
        RoleName: "OWNER",
      },
      update: {},
      create: {
        RoleName: "OWNER",
      },
    })
    .then((role) => {
      data.RoleId = role.RoleId;
    })
    .catch((err) => {
      console.error(err);
    });

  // Create a new user with role "ADMIN" with the data from the inputs
  await prisma.user
    .create({
      data: data,
    })
    .then(() => {
      console.log("A new owner has been successfully created.");
    })
    .catch((err) => {
      console.error("An error happened while creating admin: ", err.message);
    });

  readline.close();
};

// call the main function
main().catch((err) => {
  console.error(err);
});
