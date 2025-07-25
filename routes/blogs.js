const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const blogController = require('../controllers/blogController');

// ✅ Public: Get all blogs
router.get('/', blogController.getAllBlogs);

// ✅ Public: Get blogs by user ID
router.get('/user/:userId', blogController.getBlogsByUser);

// ✅ Public: Get blog by ID for anyone (used on blog detail page)
router.get('/:id', blogController.getBlogById);

// ✅ Protected: Get blog by ID only for editing by owner
router.get('/:id/edit', authMiddleware, blogController.getBlogForEdit);

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
        console.error("Error creating blog:", error);
        res.status(500).json({ message: "Failed to create blog" });
    }
});

// ✅ Protected: Update blog
router.put('/:id', authMiddleware, blogController.updateBlog);

// ✅ Protected: Delete blog
router.delete('/:id', authMiddleware, blogController.deleteBlog);

module.exports = router;







