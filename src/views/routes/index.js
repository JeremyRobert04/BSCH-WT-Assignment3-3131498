const express = require("express");
const passport = require("passport");
const {
  getPosts,
  getPostById,
  getPostsByTagId,
} = require("../controllers/post.controller");
const { createComment } = require("../controllers/comment.controller");
const { getTagById } = require("../controllers/tag.controller");
const router = express.Router();

// home page
router.get("", async (req, res) => {
  var locals = {
    pageTitle: "Travel Guider - Home",
    pageDescription: "Travel Guider home page",
    posts: [],
  };

  try {
    // get All past posts
    locals.posts = await getPosts();
  } catch (err) {
    req.session.messages = [err.message];
  }

  res.render("Home", { locals });
});

// About Page
router.get("/about", async (req, res) => {
  var locals = {
    pageTitle: "Travel Guider - About me",
    pageDescription: "Travel Guider about page",
  };

  res.render("AboutUs", { locals });
});

// All posts pages
router.get("/posts", async (req, res) => {
  var locals = {
    pageTitle: "Travel Guider - Posts",
    pageDescription: "Travel Guider posts page",
    posts: [],
    pageTitleSection: "All Posts",
  };

  try {
    // Get TagId in case of filter (/tags?tagId=1)
    const tagId = parseInt(req.query.tagId);

    if (tagId) {
      // if tagId is not undefined or null then get all posts for this specific tags
      locals.posts = await getPostsByTagId(tagId);
      // Set the page title with the name of the Tag
      locals.pageTitleSection = `All Posts - ${
        (await getTagById(tagId)).TagName
      }`;
    } else {
      // Otherwise just get all the posts
      locals.posts = await getPosts();
    }
  } catch (err) {
    req.session.messages = [err.message];
    return res.redirect("/posts/");
  }

  res.render("Posts", { locals });
});

// Specific post page
router.get("/post/:postId", async (req, res) => {
  var locals = {
    pageTitle: "Travel Guider - Posts",
    pageDescription: "Travel Guider posts page",
    post: {},
  };

  try {
    // Get the postId from the url
    const postId = parseInt(req.params.postId);
    // get the post by its ID
    locals.post = await getPostById(postId);
  } catch (err) {
    req.session.messages = [err.message];
  }

  res.render("DetailedPost", { locals });
});

// Form: create a new comment for a specific post
router.post("/post/:postId/new-comment/", async (req, res) => {
  const postId = parseInt(req.params.postId);
  // Get the ID of the post

  try {
    // Create a new comment
    await createComment(postId, req.user.UserId, req.body.Comment);
  } catch (err) {
    console.error(err);
    req.session.messages = [err.message];
  }
  // redirect to the post at the comments section
  return res.redirect(`/post/${postId}#comments-section`);
});

module.exports = router;
