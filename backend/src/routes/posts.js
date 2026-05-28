const express = require('express');
const router = express.Router();
const {
  getAllPosts,
  getTrendingPosts,
  searchPosts,
  getPostBySlug,
  createPost,
  updatePost,
  deletePost,
  toggleLike,
  toggleBookmark,
  getUserBookmarks,
  getMyPosts,
} = require('../controllers/postController');
const { protect } = require('../middleware/auth');

// GET /api/posts/bookmarks/me  — MUST be before /:slug to avoid conflict
router.get('/bookmarks/me', protect, getUserBookmarks);

// GET /api/posts/my-posts — MUST be before /:slug to avoid conflict
router.get('/my-posts', protect, getMyPosts);

// GET /api/posts/trending
router.get('/trending', getTrendingPosts);

// GET /api/posts/search?q=
router.get('/search', searchPosts);

// GET /api/posts
router.get('/', getAllPosts);

// POST /api/posts
router.post('/', protect, createPost);

// GET /api/posts/:slug
router.get('/:slug', getPostBySlug);

// PUT /api/posts/:id
router.put('/:id', protect, updatePost);

// DELETE /api/posts/:id
router.delete('/:id', protect, deletePost);

// POST /api/posts/:id/like
router.post('/:id/like', protect, toggleLike);

// POST /api/posts/:id/bookmark
router.post('/:id/bookmark', protect, toggleBookmark);

module.exports = router;
