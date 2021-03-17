const express = require('express')
const router = express.Router({ mergeParams: true })
const catchAsync = require('../utils/catchAsync')
const comments = require('../controller/comments')
const { isLoggedIn, isCommentAuthor, validateComment } = require('../middleware.js')

router.post('/',isLoggedIn, validateComment, catchAsync(comments.createComment))

router.delete('/:commentId', isLoggedIn, isCommentAuthor, catchAsync(comments.deleteComment))

module.exports = router