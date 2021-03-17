const Blog = require('../models/blog')
const Comment= require('../models/comment')
const { cloudinary } = require("../cloudinary");

module.exports.index = async (req, res) => {
    const blogs = await Blog.find({})
    res.render('blogs/index', { blogs })
}

module.exports.createBlog = (req, res) => {
    res.render('blogs/new')
}

module.exports.postBlog = async (req, res) => {
    const blog = new Blog(req.body.blog)
    blog.images = req.files.map(f => ({ url: f.path, filename: f.filename }));
    blog.author = req.user._id
    await blog.save()
    console.log(blog);
    req.flash('success', 'Successfully Created a new Blog')
    res.redirect(`/blogs/${blog._id}`)
}

module.exports.showBlog = async (req, res) => {
    const blog = await Blog.findById(req.params.id).populate({
        path: 'comments',
        populate: {
            path: 'author'
        }
    }).populate('author')
    if(!blog){
        req.flash('error', "Couldn't find the desired Blog" )
        return res.redirect('/blogs')
    }
    res.render('blogs/show', { blog })
}

module.exports.editBlog = async (req, res) => {
    const { id } = req.params;
    const blog = await Blog.findById(id)
    if(!blog){
        req.flash('error', "Couldn't find the desired Blog" )
        return res.redirect('/blogs')
    }
    res.render('blogs/edit', { blog })
}

module.exports.updateBlog = async (req, res) => {
    const { id } = req.params;
    const blog = await Blog.findByIdAndUpdate(id, {...req.body.blog})
    const imgs = req.files.map(f => ({ url: f.path, filename: f.filename }));    
    blog.images.push(...imgs);
    await blog.save();
    if (req.body.deleteImages) {
        for (let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename);
        }
        await blog.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } })
    }
    req.flash('success', 'Successfully updated the Blog')
    res.redirect(`/blogs/${blog._id}`)
}

module.exports.deleteBlog = async (req, res) => {
    const { id } = req.params
    await Blog.findByIdAndDelete(id)
    req.flash('success', 'Blog Deleted')
    res.redirect(`/blogs`)
}