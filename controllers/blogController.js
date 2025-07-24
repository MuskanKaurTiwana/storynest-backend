// controllers/blogController.js
const Blog = require('../models/Blog');

// Get all blogs (public)
exports.getAllBlogs = async (req, res) => {
    try {
        const blogs = await Blog.find().populate('author', 'username');
        res.json(blogs);
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
};

// ✅ Updated: Protected get-by-id for edit page
exports.getBlogById = async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id).populate('author', 'username').lean();
        if (!blog) return res.status(404).json({ message: 'Blog not found' });

        // ✅ Only allow author to fetch blog for editing
        if (blog.author._id.toString() !== req.userId) {
            return res.status(403).json({ message: 'Unauthorized access to blog' });
        }

        res.json(blog);
    } catch (error) {
        console.error("Error fetching blog:", error);
        res.status(500).json({ message: 'Error fetching blog' });
    }
};

// Update blog (already correct)
exports.updateBlog = async (req, res) => {
    const { title, content } = req.body;
    try {
        const blog = await Blog.findById(req.params.id);
        if (!blog) return res.status(404).json({ message: "Blog not found" });

        if (!blog.author || blog.author.toString() !== req.userId) {
            return res.status(403).json({ message: "Unauthorized" });
        }

        blog.title = title || blog.title;
        blog.content = content || blog.content;
        const updatedBlog = await blog.save();
        res.json(updatedBlog);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
};

exports.deleteBlog = async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id);
        if (!blog) return res.status(404).json({ message: "Blog not found" });

        if (blog.author.toString() !== req.userId) {
            return res.status(403).json({ message: "Unauthorized" });
        }

        await blog.deleteOne();
        res.json({ message: "Blog deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
};


