const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const blogController = require('../controllers/blogController');
const Blog = require('../models/Blog'); // Add this to query Blog model directly if needed

// Create blog
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

// Get all blogs
router.get('/', blogController.getAllBlogs);

// Update a blog
router.put('/:id', authMiddleware, blogController.updateBlog);

// Delete a blog
router.delete('/:id', authMiddleware, blogController.deleteBlog);

// ✅ Get blogs by user
router.get('/user/:userId', async (req, res) => {
    try {
        const blogs = await Blog.find({ author: req.params.userId });
        res.json(blogs);
    } catch (err) {
        console.error('Error fetching user blogs:', err);
        res.status(500).json({ error: 'Failed to fetch user blogs' });
    }
});

// Get a blog by ID
router.get('/:id', blogController.getBlogById);

module.exports = router;


