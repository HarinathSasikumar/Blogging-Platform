const mongoose = require('mongoose');
const slugify = require('slugify');

const PostSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    slug: {
      type: String,
      unique: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      maxlength: [500, 'Description cannot exceed 500 characters'],
    },
    content: {
      type: String,
      required: [true, 'Content is required'],
    },
    featuredImage: {
      type: String,
      default: '',
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Author is required'],
    },
    tags: {
      type: [String],
      set: (tags) => {
        if (!tags) return [];
        const arr = Array.isArray(tags) ? tags : String(tags).split(',');
        return arr.map((tag) => tag.toLowerCase().trim()).filter(Boolean);
      },
    },
    category: {
      type: String,
      enum: [
        'Technology',
        'Programming',
        'Design',
        'Career',
        'Tutorial',
        'Lifestyle',
        'Business',
        'Science',
        'Health',
        'Travel',
        'Other',
      ],
      default: 'Other',
    },
    readingTime: {
      type: Number,
      default: 1,
    },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    views: {
      type: Number,
      default: 0,
    },
    published: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

// Pre-save hook: auto-generate slug and calculate reading time
PostSchema.pre('save', function (next) {
  // Generate slug only for new documents or when title changes
  if (this.isNew || this.isModified('title')) {
    const randomSuffix = Math.random().toString(36).substring(2, 8);
    this.slug = slugify(this.title, { lower: true, strict: true }) + '-' + randomSuffix;
  }

  // Calculate reading time from content word count
  if (this.content) {
    // Strip HTML tags to get plain text word count
    const plainText = this.content.replace(/<[^>]*>/g, '');
    const wordCount = plainText.trim().split(/\s+/).filter(Boolean).length;
    this.readingTime = Math.max(1, Math.ceil(wordCount / 200));
  }

  next();
});

module.exports = mongoose.model('Post', PostSchema);
