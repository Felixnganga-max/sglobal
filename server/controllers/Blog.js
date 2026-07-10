const Blog = require("../models/Blog");
const { deleteImage, uploadBase64Image } = require("../db/claudinary");

const parseArrayField = (value) => {
  if (!value) return [];
  return Array.isArray(value) ? value : JSON.parse(value);
};

const isBlankHtml = (html) => !html || !html.replace(/<[^>]*>/g, "").trim();

// @desc    Get all blogs with filtering, search, and pagination
// @route   GET /smartglobal/blogs
// @access  Public
exports.getAllBlogs = async (req, res) => {
  try {
    const {
      category,
      search,
      sortBy = "createdAt",
      order = "desc",
      page = 1,
      limit = 20,
    } = req.query;

    const filter = { published: true };

    if (category && category !== "all") {
      filter.category = category;
    }

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { excerpt: { $regex: search, $options: "i" } },
        { tags: { $in: [new RegExp(search, "i")] } },
      ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const sortOrder = order === "asc" ? 1 : -1;
    const sort = { [sortBy]: sortOrder };

    const blogs = await Blog.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Blog.countDocuments(filter);

    res.status(200).json({
      success: true,
      count: blogs.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
      data: blogs,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};

// @desc    Get single blog by ID or slug
// @route   GET /smartglobal/blogs/:identifier
// @access  Public
exports.getBlog = async (req, res) => {
  try {
    const { identifier } = req.params;

    let blog;
    if (identifier.match(/^[0-9a-fA-F]{24}$/)) {
      blog = await Blog.findById(identifier);
    } else {
      blog = await Blog.findOne({ slug: identifier });
    }

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found",
      });
    }

    blog.views += 1;
    await blog.save();

    res.status(200).json({
      success: true,
      data: blog,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};

// @desc    Create new blog
// @route   POST /smartglobal/blogs
// @access  Private/Admin
exports.createBlog = async (req, res) => {
  try {
    const {
      title,
      slug,
      category,
      excerpt,
      content,
      tags,
      readTime,
      authorName,
      imageData,
    } = req.body;

    if (!title || !category || !excerpt || !content) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields",
      });
    }

    if (isBlankHtml(content)) {
      return res.status(400).json({
        success: false,
        message: "Blog content cannot be empty",
      });
    }

    let imageInfo;
    if (req.file) {
      imageInfo = { url: req.file.path, publicId: req.file.filename };
    } else if (imageData) {
      imageInfo = await uploadBase64Image(imageData, "kent-boringer-blogs");
    } else {
      return res.status(400).json({
        success: false,
        message: "Featured image is required",
      });
    }

    const blog = await Blog.create({
      title,
      slug:
        slug ||
        title
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-|-$/g, ""),
      category,
      excerpt,
      content,
      tags: parseArrayField(tags),
      readTime: readTime || "5 min read",
      author: authorName ? { name: authorName } : undefined,
      featuredImage: imageInfo,
    });

    res.status(201).json({
      success: true,
      message: "Blog created successfully",
      data: blog,
    });
  } catch (error) {
    if (req.file) {
      await deleteImage(req.file.filename);
    }
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "A blog with this slug already exists",
      });
    }
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};

// @desc    Update blog
// @route   PUT /smartglobal/blogs/:id
// @access  Private/Admin
exports.updateBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found",
      });
    }

    const {
      title,
      slug,
      category,
      excerpt,
      content,
      tags,
      readTime,
      authorName,
      imageData,
      published,
    } = req.body;

    if (content !== undefined && isBlankHtml(content)) {
      return res.status(400).json({
        success: false,
        message: "Blog content cannot be empty",
      });
    }

    let imageInfo = blog.featuredImage;
    if (req.file) {
      await deleteImage(blog.featuredImage.publicId);
      imageInfo = { url: req.file.path, publicId: req.file.filename };
    } else if (imageData) {
      await deleteImage(blog.featuredImage.publicId);
      imageInfo = await uploadBase64Image(imageData, "kent-boringer-blogs");
    }

    const updateData = {
      title: title || blog.title,
      slug: slug || blog.slug,
      category: category || blog.category,
      excerpt: excerpt || blog.excerpt,
      content: content !== undefined ? content : blog.content,
      tags: tags !== undefined ? parseArrayField(tags) : blog.tags,
      readTime: readTime || blog.readTime,
      author: authorName ? { name: authorName } : blog.author,
      published: published !== undefined ? published : blog.published,
      featuredImage: imageInfo,
    };

    const updated = await Blog.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      message: "Blog updated successfully",
      data: updated,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};

// @desc    Like a blog post
// @route   PATCH /smartglobal/blogs/:id/like
// @access  Public
exports.likeBlog = async (req, res) => {
  try {
    const blog = await Blog.findByIdAndUpdate(
      req.params.id,
      { $inc: { likes: 1 } },
      { new: true },
    );
    if (!blog) {
      return res.status(404).json({ success: false, message: "Blog not found" });
    }
    res.status(200).json({ success: true, data: blog });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};

// @desc    Dislike a blog post
// @route   PATCH /smartglobal/blogs/:id/dislike
// @access  Public
exports.dislikeBlog = async (req, res) => {
  try {
    const blog = await Blog.findByIdAndUpdate(
      req.params.id,
      { $inc: { dislikes: 1 } },
      { new: true },
    );
    if (!blog) {
      return res.status(404).json({ success: false, message: "Blog not found" });
    }
    res.status(200).json({ success: true, data: blog });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};

// @desc    Delete blog
// @route   DELETE /smartglobal/blogs/:id
// @access  Private/Admin
exports.deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found",
      });
    }

    await deleteImage(blog.featuredImage.publicId);
    await Blog.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Blog deleted successfully",
      data: {},
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};
