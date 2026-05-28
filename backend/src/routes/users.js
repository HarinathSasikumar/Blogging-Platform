const express = require('express');
const router = express.Router();
const { getProfile, getUserPosts } = require('../controllers/userController');

// GET /api/users/:id
router.get('/:id', getProfile);

// GET /api/users/:id/posts
router.get('/:id/posts', getUserPosts);

module.exports = router;
