const Post = require('../models/Post');
const Comment = require('../models/Comment');
const User = require('../models/User');

// @desc    Get all posts (paginated, filterable)
// @route   GET /api/posts
// @access  Public
const getAllPosts = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 9;
    const skip = (page - 1) * limit;

    const filter = { published: true };

    if (req.query.category) filter.category = req.query.category;
    if (req.query.tag) filter.tags = req.query.tag.toLowerCase();
    if (req.query.author) filter.author = req.query.author;

    const totalPosts = await Post.countDocuments(filter);
    const posts = await Post.find(filter)
      .populate('author', 'username profileImage')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      success: true,
      data: {
        posts,
        totalPosts,
        totalPages: Math.ceil(totalPosts / limit),
        currentPage: page,
      },
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get trending posts (most viewed)
// @route   GET /api/posts/trending
// @access  Public
const getTrendingPosts = async (req, res, next) => {
  try {
    const posts = await Post.find({ published: true })
      .populate('author', 'username profileImage')
      .sort({ views: -1 })
      .limit(5);

    res.status(200).json({
      success: true,
      data: posts,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Search posts by title, description, tags
// @route   GET /api/posts/search?q=
// @access  Public
const searchPosts = async (req, res, next) => {
  try {
    const q = req.query.q;

    if (!q) {
      return res.status(400).json({
        success: false,
        message: 'Search query is required',
      });
    }

    const regex = new RegExp(q, 'i');

    const posts = await Post.find({
      published: true,
      $or: [{ title: regex }, { description: regex }, { tags: regex }],
    })
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

// @desc    Get single post by slug
// @route   GET /api/posts/:slug
// @access  Public
const getPostBySlug = async (req, res, next) => {
  try {
    const post = await Post.findOne({ slug: req.params.slug }).populate(
      'author',
      'username profileImage bio'
    );

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found',
      });
    }

    // Increment view count
    post.views += 1;
    await post.save({ validateBeforeSave: false });

    // Fetch comments separately
    const comments = await Comment.find({ post: post._id })
      .populate('author', 'username profileImage')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: { post, comments },
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Create a new post
// @route   POST /api/posts
// @access  Private
const createPost = async (req, res, next) => {
  try {
    const { title, description, content, featuredImage, tags, category, published } = req.body;

    if (!title || !description || !content) {
      return res.status(400).json({
        success: false,
        message: 'Title, description, and content are required',
      });
    }

    const post = await Post.create({
      title,
      description,
      content,
      featuredImage: featuredImage || '',
      tags: tags || [],
      category: category || 'Other',
      published: published !== undefined ? published : true,
      author: req.user._id,
    });

    await post.populate('author', 'username profileImage');

    res.status(201).json({
      success: true,
      data: post,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update a post
// @route   PUT /api/posts/:id
// @access  Private (author only)
const updatePost = async (req, res, next) => {
  try {
    let post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found',
      });
    }

    // Check ownership
    if (post.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this post',
      });
    }

    const allowedFields = ['title', 'description', 'content', 'featuredImage', 'tags', 'category', 'published'];
    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        post[field] = req.body[field];
      }
    });

    await post.save();
    await post.populate('author', 'username profileImage');

    res.status(200).json({
      success: true,
      data: post,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete a post
// @route   DELETE /api/posts/:id
// @access  Private (author only)
const deletePost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found',
      });
    }

    // Check ownership
    if (post.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this post',
      });
    }

    // Delete all comments for this post
    await Comment.deleteMany({ post: post._id });

    await post.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Post deleted successfully',
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Toggle like on a post
// @route   POST /api/posts/:id/like
// @access  Private
const toggleLike = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found',
      });
    }

    const userId = req.user._id;
    const alreadyLiked = post.likes.some((id) => id.toString() === userId.toString());

    if (alreadyLiked) {
      post.likes = post.likes.filter((id) => id.toString() !== userId.toString());
    } else {
      post.likes.push(userId);
    }

    await post.save({ validateBeforeSave: false });

    res.status(200).json({
      success: true,
      likes: post.likes.length,
      liked: !alreadyLiked,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Toggle bookmark on a post
// @route   POST /api/posts/:id/bookmark
// @access  Private
const toggleBookmark = async (req, res, next) => {
  try {
    const postId = req.params.id;
    const user = await User.findById(req.user._id);

    const alreadyBookmarked = user.bookmarks.some(
      (id) => id.toString() === postId.toString()
    );

    if (alreadyBookmarked) {
      user.bookmarks = user.bookmarks.filter((id) => id.toString() !== postId.toString());
    } else {
      user.bookmarks.push(postId);
    }

    await user.save({ validateBeforeSave: false });

    res.status(200).json({
      success: true,
      bookmarked: !alreadyBookmarked,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get current user's bookmarks
// @route   GET /api/posts/bookmarks/me
// @access  Private
const getUserBookmarks = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).populate({
      path: 'bookmarks',
      populate: { path: 'author', select: 'username profileImage' },
    });

    res.status(200).json({
      success: true,
      data: user.bookmarks,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get logged-in user's own posts
// @route   GET /api/posts/my-posts
// @access  Private
const getMyPosts = async (req, res, next) => {
  try {
    const posts = await Post.find({ author: req.user._id })
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

module.exports = {
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
};
