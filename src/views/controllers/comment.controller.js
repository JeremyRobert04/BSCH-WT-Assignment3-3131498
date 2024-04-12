/**
 * Methods to interact with comment model in database
 */
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const commentSerializer = {
  CommentId: true,
  Author: {
    select: {
      UserId: true,
      FirstName: true,
      LastName: true,
    },
  },
  Post: {
    select: {
      PostId: true,
      Title: true,
      Preview: true,
    },
  },
  Comment: true,
  created_at: true,
};

// Get all comments
const getComments = async () => {
  try {
    const comments = await prisma.comment.findMany({
      select: commentSerializer,
    });
    return comments;
  } catch (err) {
    throw new Error(err.message);
  }
};

// Get a specific comment by its ID
const getCommentById = async (commentId) => {
  try {
    const comment = await prisma.comment.findUnique({
      where: {
        CommentId: commentId,
      },
      select: commentSerializer,
    });
    if (comment == null) {
      throw new Error(`Error: no comment with id: ${commentId}`);
    }
    return comment;
  } catch (err) {
    throw new Error(err.message);
  }
};

// Get all comments that belongs to a specific Post
const getCommentsByPostId = async (postId) => {
  try {
    const comments = await prisma.comment.findMany({
      where: {
        PostId: postId,
      },
      select: commentSerializer,
    });

    return comments;
  } catch (err) {
    throw new Error(err.message);
  }
};

// Get all comments written by a specific User
const getCommentsByUserId = async (userId) => {
  try {
    const comments = await prisma.comment.findMany({
      where: {
        AuthorId: userId,
      },
      select: commentSerializer,
    });

    return comments;
  } catch (err) {
    throw new Error(err.message);
  }
};

// Create a new comment
const createComment = async (postId, authorId, commentBody) => {
  try {
    const comment = await prisma.comment.create({
      data: {
        AuthorId: authorId,
        PostId: postId,
        Comment: commentBody,
      },
      select: commentSerializer,
    });

    return comment;
  } catch (err) {
    throw new Error(err.message);
  }
};

// Check if a comment belongs to a specificUser
const doesCommentBelongsToUser = async (userId, commentId) => {
  try {
    const comment = await prisma.comment.findUnique({
      where: { CommentId: commentId },
      select: {
        AuthorId: true,
      },
    });

    if (comment == null) return false;
    return comment.AuthorId == userId;
  } catch (err) {
    return false;
  }
};

// Edit a comment
const editComment = async (user, commentId, commentBody) => {
  try {
    if (
      !doesCommentBelongsToUser(user.UserId, commentId) &&
      req.user.Role.RoleName !== "OWNER"
    )
      throw new Error("You are not allowed to access this resource.");

    if (!commentBody && !commentBody.length)
      throw new Error('Expected field "Comment".');

    const updatedComment = await prisma.comment.update({
      where: {
        CommentId: commentId,
      },
      data: {
        Comment: req.body.comment,
      },
    });

    return updatedComment;
  } catch (err) {
    throw new Error(err.message);
  }
};

// delete a specific Commment by its Id
const deleteComment = async (user, commentId) => {
  try {
    // Check if the comment belongs to the user, or if user is an ADMIN
    if (
      !doesCommentBelongsToUser(user.UserId, commentId) &&
      req.user.Role.RoleName !== "OWNER"
    )
      throw new Error("You are not allowed to access this resource.");

    await prisma.comment.delete({
      where: {
        CommentId: commentId,
      },
    });

    return "Comment has been deleted.";
  } catch (err) {
    throw new Error(err.message);
  }
};

module.exports = {
  getComments,
  getCommentById,
  getCommentsByPostId,
  getCommentsByUserId,
  createComment,
  editComment,
  deleteComment,
};
