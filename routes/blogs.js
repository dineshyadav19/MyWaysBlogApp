const express = require('express')
const router = express.Router()
const catchAsync = require('../utils/catchAsync')
const Blog = require('../models/blog')
const { blogSchema } = require('../schemas.js')


const validateBlog = (req, res, next) => {
    const { error } = blogSchema.validate(req.body)
    if(error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next()
    }
}

//Index page
router.get('/', catchAsync(async (req, res) => {
    const blogs = await Blog.find({})
    res.render('blogs/index', { blogs })
}))


//Create new Blog page
router.get('/new' , (req, res) => {
    res.render('blogs/new')
})


//Post that blog 
router.post('/', validateBlog, catchAsync(async (req, res) => {
    const blog = new Blog(req.body.blog)
    await blog.save()
    req.flash('success', 'Successfully Created a new Blog')
    res.redirect(`/blogs/${blog._id}`)
}))

//show page
router.get('/:id',catchAsync(async (req, res) => {
    const blog = await Blog.findById(req.params.id).populate('comments')
    if(!blog){
        req.flash('error', "Couldn't find the desired Blog" )
        return res.redirect('/blogs')
    }
    res.render('blogs/show', { blog })
}))

//edit Page
router.get('/:id/edit', catchAsync(async (req, res) => {
    const blog = await Blog.findById(req.params.id)
    if(!blog){
        req.flash('error', "Couldn't find the desired Blog" )
        return res.redirect('/blogs')
    }
    res.render('blogs/edit', { blog })
}))

//Update 
router.put('/:id', validateBlog, catchAsync(async (req, res) => {
    const { id } = req.params;
    const blog = await Blog.findByIdAndUpdate(id, {...req.body.blog})
    req.flash('success', 'Successfully updated the Blog')
    res.redirect(`/blogs/${blog._id}`)
}))

//Delete 
router.delete('/:id', catchAsync(async (req, res) => {
    const { id } = req.params
    await Blog.findByIdAndDelete(id)
    req.flash('success', 'Blog Deleted')
    res.redirect(`/blogs`)
}))

module.exports = router
