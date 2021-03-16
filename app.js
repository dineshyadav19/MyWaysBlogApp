const express = require('express')
const path = require('path')
const mongoose = require('mongoose')
const ejsMate =  require('ejs-mate')
const { blogSchema, commentSchema } = require('./schemas.js')
const catchAsync = require('./utils/catchAsync')
const ExpressError = require('./utils/ExpressError')
const methodOverride = require('method-override')
const Blog = require('./models/blog')
const Comment = require('./models/comment')

mongoose.connect('mongodb://localhost:27017/mywaysBlog', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
})

const db = mongoose.connection
db.on('error', console.error.bind(console, 'connection error:'))
db.once('open', () => {
    console.log('Database connected')
})

const app = express()

app.engine('ejs', ejsMate)
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

app.use(express.urlencoded({ extended : true }))
app.use(methodOverride('_method'))

const validateBlog = (req, res, next) => {
    const { error } = blogSchema.validate(req.body)
    if(error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next()
    }
}

const validateComment = (req, res, next) => {
    const { error } = commentSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}

//home Page
app.get('/', (req, res) => {
    res.render('home')
})

//Index page
app.get('/blogs', catchAsync(async (req, res) => {
    const blogs = await Blog.find({})
    res.render('blogs/index', { blogs })
}))


//Create new Blog page
app.get('/blogs/new' , (req, res) => {
    res.render('blogs/new')
})


//Post that blog 
app.post('/blogs', validateBlog, catchAsync(async (req, res) => {
//    if(!req.body.blog) throw new ExpressError('Invalid Blog Data', 400)
    const blog = new Blog(req.body.blog)
    await blog.save()
    res.redirect(`/blogs/${blog._id}`)
}))

//show page
app.get('/blogs/:id',catchAsync(async (req, res) => {
    const blog = await Blog.findById(req.params.id).populate('comments')
    console.log(blog)
    res.render('blogs/show', { blog })
}))

//edit Page
app.get('/blogs/:id/edit', catchAsync(async (req, res) => {
    const blog = await Blog.findById(req.params.id)
    res.render('blogs/edit', { blog })
}))

//Update 
app.put('/blogs/:id', validateBlog, catchAsync(async (req, res) => {
    const { id } = req.params;
    const blog = await Blog.findByIdAndUpdate(id, {...req.body.blog})
    res.redirect(`/blogs/${blog._id}`)
}))

//Delete 
app.delete('/blogs/:id', catchAsync(async (req, res) => {
    const { id } = req.params
    await Blog.findByIdAndDelete(id)
    res.redirect(`/blogs`)
}))

app.post('/blogs/:id/comments', validateComment, catchAsync(async (req, res) => {
    const blog = await Blog.findById(req.params.id);
    const comment = new Comment(req.body.comment);
    blog.comments.push(comment);
    await comment.save();
    await blog.save();
    res.redirect(`/blogs/${blog._id}`);
}))

app.delete('/blogs/:id/comments/:commentId', catchAsync(async (req, res) => {
    const { id, commentId } = req.params;
    await Blog.findByIdAndUpdate(id, { $pull: { comments: commentId } });
    await Comment.findByIdAndDelete(commentId);
    res.redirect(`/blogs/${id}`);
}))

app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404))
})

app.use((err,req, res, next) => {
    const { statusCode = 500 } = err;
    if(!err.message) err.message = 'Something Went Wrong'
    res.status(statusCode).render('error', { err })
})

app.listen(3000, () => {
    console.log('Serving on port 3000')
})