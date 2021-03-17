const express = require('express')
const router = express.Router()
const catchAsync = require('../utils/catchAsync')
const blogs = require('../controller/blogs')
const { isLoggedIn, isAuthor, validateBlog } = require('../middleware.js')
const multer  = require('multer')
const { storage } = require('../cloudinary')
const upload = multer({ storage })

router.route('/')
    .get( catchAsync(blogs.index))
    .post( isLoggedIn,validateBlog, upload.array('image'), catchAsync(blogs.postBlog))

router.get('/new', isLoggedIn, blogs.createBlog)

router.route('/:id')
    .get(catchAsync(blogs.showBlog))
    .put(isLoggedIn, isAuthor, validateBlog, upload.array('image'), catchAsync(blogs.updateBlog))
    .delete(isLoggedIn, isAuthor, catchAsync(blogs.deleteBlog))

//edit Page
router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(blogs.editBlog))

module.exports = router
