const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const blogController = require('../controllers/blogController');
const Blog = require('../models/Blog');

// ✅ Public: Get all blogs
router.get('/', blogController.getAllBlogs);

// ✅ Public: Get blog by ID for viewing
router.get('/:id', blogController.getBlogById);

// ✅ Protected: Get blog by ID for editing
router.get('/edit/:id', authMiddleware, blogController.getBlogForEdit);

// ✅ Public: Get blogs by user ID (must be placed before routes with params like /:id)
router.get('/user/:userId', async (req, res) => {
    try {
        const blogs = await Blog.find({ author: req.params.userId });
        res.json(blogs);
    } catch (err) {
        console.error('Error fetching user blogs:', err);
        res.status(500).json({ error: 'Failed to fetch user blogs' });
    }
});

// ✅ Protected: Create blog
router.post('/', authMiddleware, async (req, res) => {
    try {
        const { title, content } = req.body;
        const newBlog = new Blog({
            title,
            content,
            author: req.userId
        });
        const savedBlog = await newBlog.save();
        res.status(201).json(savedBlog);
    } catch (error) {
        res.status(500).json({ message: "Failed to create blog" });
    }
});

// ✅ Protected: Update blog
router.put('/:id', authMiddleware, blogController.updateBlog);

// ✅ Protected: Delete blog
router.delete('/:id', authMiddleware, blogController.deleteBlog);

module.exports = router;






