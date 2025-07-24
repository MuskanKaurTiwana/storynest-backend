const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const commentController = require('../controllers/commentController');

// Add a comment to a blog
router.post('/:blogId', authMiddleware, commentController.createComment);

// Get comments of a blog
router.get('/:blogId', commentController.getCommentsByBlog);

module.exports = router;
