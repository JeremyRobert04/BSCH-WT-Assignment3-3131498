/**
 * Methods to interact with the Post model in the database
 */
const { PrismaClient } = require("@prisma/client");
const path = require("path");
const formidable = require("formidable");

const prisma = new PrismaClient();

// Define a Serializer to get only the above fields:
const PostSerializer = {
  PostId: true,
  Author: {
    select: {
      UserId: true,
      FirstName: true,
      LastName: true,
    },
  },
  Title: true,
  Preview: true,
  ImageUrl: true,
  Content: true,
  Comments: {
    select: {
      CommentId: true,
      Author: {
        select: {
          UserId: true,
          FirstName: true,
          LastName: true,
        },
      },
      Comment: true,
      created_at: true,
    },
  },
  Tag: {
    select: {
      TagId: true,
      TagName: true,
      TagColor: true,
      TagImage: true,
    },
  },
  created_at: true,
};

// Get all posts from the database
const getPosts = async () => {
  try {
    // Get all posts by descending order (newest first)
    const posts = await prisma.post.findMany({
      orderBy: [
        {
          PostId: "desc",
        },
      ],
      select: PostSerializer,
    });

    return posts;
  } catch (err) {
    throw new Error(err.message);
  }
};

// Get a specific post by its ID
const getPostById = async (postId) => {
  try {
    const post = await prisma.post.findUnique({
      where: { PostId: postId },
      select: PostSerializer,
    });

    if (post == null) {
      throw new Error(`Unable to find post with id: ${id}.`);
    }
    return post;
  } catch (err) {
    throw new Error(err.message);
  }
};

// Get all posts that has been created by a specific User
const getPostsByUserId = async (userId) => {
  try {
    const posts = await prisma.post.findMany({
      orderBy: [
        {
          PostId: "desc",
        },
      ],
      where: { AuthorId: userId },
      select: PostSerializer,
    });

    return posts;
  } catch (err) {
    throw new Error(err);
  }
};

// Get all posts that have a specific tags
const getPostsByTagId = async (tagId) => {
  try {
    const posts = prisma.post.findMany({
      orderBy: [
        {
          PostId: "desc",
        },
      ],
      where: { TagId: tagId },
      select: PostSerializer,
    });

    return posts;
  } catch (err) {
    throw new Error(err.message);
  }
};

// Create a new Post
const createPost = async (req, res) => {
  // define the path where the Post Image will be stored
  const imagePath = path.resolve(__dirname, "../../../public/img");

  // parse a form-data request containing a file
  var form = new formidable.IncomingForm({
    multiples: false,
    maxFiles: 1,
    maxFields: 5,
    keepExtensions: true,
    createDirsFromUploads: false,
    uploadDir: imagePath,
  });

  return new Promise((resolve, reject) => {
    form
      .parse(req)
      .then(async (result) => {
        const [fields, files] = result;

        // Check if form fields are not empty
        if (!fields.PostTitle || !fields.PostTitle[0].length) {
          throw new Error("Error: Post must have a title.");
        } else if (
          !fields.PostTextPreview ||
          !fields.PostTextPreview[0].length
        ) {
          throw new Error("Error: Post must have a text preview.");
        } else if (!files.PostPreview) {
          throw new Error("Error: Post must have an image.");
        } else if (!fields.PostContent || !fields.PostContent[0].length) {
          throw new Error("Error: Post content should not be empty.");
        }

        // Create a new tag in the database
        const data = {
          AuthorId: req.user.UserId,
          Title: fields.PostTitle[0],
          Preview: fields.PostTextPreview[0],
          Content: fields.PostContent[0],
          TagId: JSON.parse(fields.PostTag[0]).TagId,
          ImageUrl: `/public/img/${files.PostPreview[0].newFilename}`,
        };

        const newPost = await prisma.post.create({
          data: data,
          select: PostSerializer,
        });

        resolve({
          message: "New post has been created.",
          data: newPost,
        });
      })
      .catch((err) => {
        if (err.code == 1015)
          err.message = "Error: you can upload only one file at a time.";
        else if (err.code == 1010)
          err.message = "Error: no tag picture provided but 1 is required.";
        reject(err);
      });
  });
};

// Edit a specific post
const editPost = async (req, res) => {
  // Get the post id from the request params
  const postId = parseInt(req.params.postId);
  // define the path where the TagImage will be stored
  const imagePath = path.resolve(__dirname, "../../../public/img");

  // parse a form-data request containing a file
  var form = new formidable.IncomingForm({
    multiples: false,
    maxFiles: 1,
    maxFields: 4,
    keepExtensions: true,
    createDirsFromUploads: false,
    uploadDir: imagePath,
    allowEmptyFiles: true,
    minFileSize: 0,
  });

  return new Promise((resolve, reject) => {
    form
      .parse(req)
      .then(async (result) => {
        const [fields, files] = result;

        var updateFields = {};

        // Check if form fields are not empty, then add to the updateFields variable that hold the fields that need an update
        if (fields.PostTitle && fields.PostTitle[0].length)
          updateFields["Title"] = fields.PostTitle[0];

        if (fields.PostTextPreview && fields.PostTextPreview[0].length)
          updateFields["Preview"] = fields.PostTextPreview[0];

        if (fields.PostContent && fields.PostContent[0].length)
          updateFields["Content"] = fields.PostContent[0];

        if (
          fields.PostTag &&
          JSON.parse(fields.PostTag[0]).hasOwnProperty("TagId")
        )
          updateFields["TagId"] = JSON.parse(fields.PostTag[0]).TagId;

        if (files.PostPreview && files.PostPreview.size > 0)
          updateFields[
            "ImageUrl"
          ] = `/public/img/${files.PostPreview[0].newFilename}`;

        const updatePost = await prisma.post.update({
          where: { PostId: postId },
          data: updateFields,
          select: PostSerializer,
        });

        resolve({
          message: "Post has been updated.",
          data: updatePost,
        });
      })
      .catch((err) => {
        reject(err);
      });
  });
};

// Delete post by its ID
const deletePost = async (postId) => {
  try {
    await prisma.post.delete({
      where: { PostId: postId },
    });

    return "The post has been deleted.";
  } catch (err) {
    throw new Error(err.message);
  }
};

module.exports = {
  getPosts,
  getPostById,
  getPostsByUserId,
  getPostsByTagId,
  createPost,
  editPost,
  deletePost,
};
