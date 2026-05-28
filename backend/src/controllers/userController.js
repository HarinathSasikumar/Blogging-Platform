const User = require('../models/User');
const Post = require('../models/Post');

// @desc    Get a user's public profile by ID
// @route   GET /api/users/:id
// @access  Public
const getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select(
      '-password -bookmarks'
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get all published posts by a user
// @route   GET /api/users/:id/posts
// @access  Public
const getUserPosts = async (req, res, next) => {
  try {
    const posts = await Post.find({ author: req.params.id, published: true })
      .populate('author', 'username profileImage')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: posts,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update current user's profile
// @route   PUT /api/users/profile (can also be handled via auth routes)
// @access  Private
const updateProfile = async (req, res, next) => {
  try {
    const { username, bio, profileImage } = req.body;

    const allowedUpdates = {};
    if (username !== undefined) allowedUpdates.username = username;
    if (bio !== undefined) allowedUpdates.bio = bio;
    if (profileImage !== undefined) allowedUpdates.profileImage = profileImage;

    const user = await User.findByIdAndUpdate(req.user._id, allowedUpdates, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { getProfile, getUserPosts, updateProfile };
