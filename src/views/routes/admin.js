const express = require("express");
const {
  createTag,
  getTags,
  deleteTag,
} = require("../controllers/tag.controller");
const {
  createPost,
  getPosts,
  deletePost,
  getPostById,
  editPost,
} = require("../controllers/post.controller");
const {
  deleteComment,
  getComments,
} = require("../controllers/comment.controller");
const router = express.Router();

// Admin overview page
router.get("/admin", async (req, res) => {
  var locals = {
    pageTitle: "Travel Guider - Admin",
    pageDescription: "Travel Guider admin page",
  };

  try {
    // get all previous posts for admin view
    locals["posts"] = await getPosts();
  } catch (err) {
    locals["posts"] = [];
  }

  res.render("Admin/AdminLastPosts", { layout: "./layouts/Admin", locals });
});

// Create a new post Page
router.get("/admin/new-post/", async (req, res) => {
  var locals = {
    pageTitle: "Travel Guider - Admin",
    pageDescription: "Travel Guider admin page",
  };

  try {
    // edit mode = false because we are creating a blank post
    locals["editMode"] = false;
    locals["tags"] = await getTags(); // Get all tags
  } catch (err) {
    req.session.messages = [err.message];
  }

  res.render("Admin/AdminNewPost", { layout: "./layouts/Admin", locals });
});

// Form: create a new post
router.post("/admin/new-post/", async (req, res) => {
  try {
    await createPost(req, res);
  } catch (err) {
    req.session.messages = [err.message];
  }
  return res.redirect("/admin/new-post/");
});

// Edit an existing post
router.get("/admin/edit-post/:postId", async (req, res) => {
  var locals = {
    pageTitle: "Travel Guider - Admin",
    pageDescription: "Travel Guider admin page",
  };

  try {
    // Get the PostId from the url
    const postId = parseInt(req.params.postId);

    // editMode = true because we are updating an existing post
    locals["editMode"] = true;
    locals["post"] = await getPostById(postId); // Get the post data
    locals["tags"] = await getTags();
  } catch (err) {
    req.session.messages = [err.message];
  }

  res.render("Admin/AdminNewPost", { layout: "./layouts/Admin", locals });
});

// Form: update the post
router.post("/admin/edit-post/:postId", async (req, res) => {
  try {
    await editPost(req, res);
    return res.redirect("/admin/");
  } catch (err) {
    req.session.messages = [err.message];
    res.redirect("/admin/edit-post/" + req.params.postId);
  }
});

// Delete an existing post
router.post("/admin/delete-post/:postId", async (req, res) => {
  try {
    const postId = parseInt(req.params.postId);

    await deletePost(postId);
  } catch (err) {
    req.session.message[err.message];
  }

  return res.redirect("/admin/");
});

// Get all available tags
router.get("/admin/tags/", async (req, res) => {
  var locals = {
    pageTitle: "Travel Guider - Admin",
    pageDescription: "Travel Guider admin page",
  };

  try {
    locals["tags"] = await getTags();
  } catch (err) {
    req.session.messages = [err.message];
  }

  res.render("Admin/AdminTags", { layout: "./layouts/Admin", locals });
});

// Form: create a new tags
router.post("/admin/tags", async (req, res) => {
  try {
    await createTag(req, res);
  } catch (err) {
    req.session.messages = [err.message];
  }
  return res.redirect("/admin/tags/");
});

// Form: delete an existing tag
router.post("/admin/tags/deleteTag/:tagId", async (req, res) => {
  try {
    const tagId = parseInt(req.params.tagId);

    await deleteTag(tagId);
  } catch (err) {
    req.session.messages[err.message];
  }

  return res.redirect("/admin/tags/");
});

// Get all comments from all posts
router.get("/admin/comments", async (req, res) => {
  var locals = {
    pageTitle: "Travel Guider - Admin",
    pageDescription: "Travel Guider admin page",
    comments: [],
  };

  try {
    locals.comments = await getComments();
  } catch (err) {
    req.session.messages[err.message];
  }

  res.render("Admin/AdminComments", { layout: "./layouts/Admin", locals });
});

// Delete a comment by its ID
router.post("/admin/comments/deleteComment/:commentId", async (req, res) => {
  try {
    const commentId = parseInt(req.params.commentId);
    await deleteComment(req.user.UserId, commentId);
  } catch (err) {
    req.session.messages = [err.message];
  }

  const previousUrl = req.header("Referer") || "back";
  console.log(previousUrl);
  res.redirect(previousUrl + "#comments-section");
});

module.exports = router;
