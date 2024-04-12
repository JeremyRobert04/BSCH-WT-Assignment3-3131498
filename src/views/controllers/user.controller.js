/**
 * Methods to interact with the User model
 */
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

// Get all users
const getUsers = async () => {
  try {
    // Find many from user model in database*
    const users = await prisma.user.findMany({
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
        _count: {
          // count the number of posts and number of comments for each user
          select: { Posts: true, Comments: true },
        },
      },
    });

    return users;
  } catch (err) {
    throw new Error(err.message);
  }
};

// Get the request user information
const getMyData = (req) => {
  return req.user;
};

// Get a user by its ID
const getUserById = async (userId) => {
  try {
    const user = await prisma.user
    .findUnique({
      where: {
        UserId: userId,
      },
      select: {
        UserId: true,
        FirstName: true,
        LastName: true,
        EmailAddress: true,
        _count: {
          select: { Posts: true, Comments: true },
        },
      },
    });

    if (user == null)
      throw new Error(`Unable to find the user with id: ${userId}`);

    return user;
  } catch (err) {
    throw new Error(err.message);
  }
};

// Delete the request user
const deleteMyAccount = async (req) => {
  try {
    await prisma.user
    .delete({
      where: {
        UserId: req.user.UserId,
      },
    })
    return "Your account has been deleted.";
  } catch (err) {
    throw new Error(err.message);
  }
};

module.exports = {
  getUsers,
  getMyData,
  getUserById,
  deleteMyAccount,
};
