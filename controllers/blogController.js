const Blog = require('../models/Blog');

// Public - Get all blogs
exports.getAllBlogs = async (req, res) => {
    try {
        const blogs = await Blog.find().populate('author', 'username');
        res.json(blogs);
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
};

// ✅ Public - Get blog by ID (for viewing)
exports.getBlogById = async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id).populate('author', 'username').lean();
        if (!blog) return res.status(404).json({ message: 'Blog not found' });
        res.json(blog);
    } catch (error) {
        console.error("Error fetching blog:", error);
        res.status(500).json({ message: 'Error fetching blog' });
    }
};

// ✅ Protected - Get blog by ID (for editing)
exports.getBlogForEdit = async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id).populate('author', 'username').lean();
        if (!blog) return res.status(404).json({ message: 'Blog not found' });

        if (blog.author._id.toString() !== req.userId) {
            return res.status(403).json({ message: 'Unauthorized access to edit' });
        }

        res.json(blog);
    } catch (error) {
        console.error("Error fetching blog for edit:", error);
        res.status(500).json({ message: 'Error fetching blog' });
    }
};

// Update blog
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

// Delete blog
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



