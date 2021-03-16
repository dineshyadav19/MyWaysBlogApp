const express = require('express')
const router = express.Router({ mergeParams: true })

const { commentSchema } = require('../schemas.js')
const catchAsync = require('../utils/catchAsync')
const ExpressError = require('../utils/ExpressError')
const Blog = require('../models/blog')
const Comment = require('../models/comment')

const validateComment = (req, res, next) => {
    const { error } = commentSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}

router.post('/', validateComment, catchAsync(async (req, res) => {
    const blog = await Blog.findById(req.params.id);
    const comment = new Comment(req.body.comment);
    blog.comments.push(comment);
    await comment.save();
    await blog.save();
    req.flash('success', 'Comment Added!!!')
    res.redirect(`/blogs/${blog._id}`);
}))

router.delete('/:commentId', catchAsync(async (req, res) => {
    const { id, commentId } = req.params;
    await Blog.findByIdAndUpdate(id, { $pull: { comments: commentId } });
    await Comment.findByIdAndDelete(commentId);
    req.flash('success', 'Comment Deleted')
    res.redirect(`/blogs/${id}`);
}))

module.exports = router