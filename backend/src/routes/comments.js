const express = require('express');
const router = express.Router();
const { getComments, addComment, deleteComment } = require('../controllers/commentController');
const { protect } = require('../middleware/auth');

// GET /api/comments/:postId
router.get('/:postId', getComments);

// POST /api/comments/:postId
router.post('/:postId', protect, addComment);

// DELETE /api/comments/:commentId
router.delete('/:commentId', protect, deleteComment);

module.exports = router;
