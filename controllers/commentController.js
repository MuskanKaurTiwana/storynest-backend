const Comment = require('../models/Comment');
const Blog = require('../models/Blog');

// Create Comment
exports.createComment = async (req, res) => {
    try {
        const { content } = req.body;
        const blogId = req.params.blogId;

        const newComment = new Comment({
            content,
            author: req.userId,
            blog: blogId
        });

        const savedComment = await newComment.save();
        res.status(201).json(savedComment);

    } catch (error) {
        res.status(500).json({ message: "Failed to create comment" });
    }
};

// Get Comments for a Blog
exports.getCommentsByBlog = async (req, res) => {
    try {
        const blogId = req.params.blogId;
        const comments = await Comment.find({ blog: blogId }).populate('author', 'username');
        res.json(comments);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch comments" });
    }
};
