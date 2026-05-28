const Comment = require('../models/Comment');
const Post = require('../models/Post');

// @desc    Get comments for a post
// @route   GET /api/comments/:postId
// @access  Public
const getComments = async (req, res, next) => {
  try {
    const comments = await Comment.find({ post: req.params.postId })
      .populate('author', 'username profileImage')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: comments,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Add a comment to a post
// @route   POST /api/comments/:postId
// @access  Private
const addComment = async (req, res, next) => {
  try {
    const { content } = req.body;

    if (!content) {
      return res.status(400).json({
        success: false,
        message: 'Comment content is required',
      });
    }

    // Check post exists
    const post = await Post.findById(req.params.postId);
    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found',
      });
    }

    const comment = await Comment.create({
      post: req.params.postId,
      author: req.user._id,
      content,
    });

    await comment.populate('author', 'username profileImage');

    res.status(201).json({
      success: true,
      data: comment,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete a comment
// @route   DELETE /api/comments/:commentId
// @access  Private (comment author or post author)
const deleteComment = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.commentId).populate('post');

    if (!comment) {
      return res.status(404).json({
        success: false,
        message: 'Comment not found',
      });
    }

    const isCommentAuthor = comment.author.toString() === req.user._id.toString();
    const isPostAuthor = comment.post.author.toString() === req.user._id.toString();

    if (!isCommentAuthor && !isPostAuthor) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this comment',
      });
    }

    await comment.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Comment deleted successfully',
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { getComments, addComment, deleteComment };
