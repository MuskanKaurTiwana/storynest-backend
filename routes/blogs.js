// routes/blog.js
const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const blogController = require('../controllers/blogController');
const Blog = require('../models/Blog');

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

router.get('/', blogController.getAllBlogs);

// ✅ Updated: Protect get-by-id route
router.get('/:id', blogController.getBlogById);

router.put('/:id', authMiddleware, blogController.updateBlog);
router.delete('/:id', authMiddleware, blogController.deleteBlog);

router.get('/user/:userId', async (req, res) => {
    try {
        const blogs = await Blog.find({ author: req.params.userId });
        res.json(blogs);
    } catch (err) {
        console.error('Error fetching user blogs:', err);
        res.status(500).json({ error: 'Failed to fetch user blogs' });
    }
});

module.exports = router;



