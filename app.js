const express = require('express')
const path = require('path')
const mongoose = require('mongoose')
const methodOverride = require('method-override')
const Blog = require('./models/blog')

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

app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

app.use(express.urlencoded({ extended : true }))
app.use(methodOverride('_method'))

//home Page
app.get('/', (req, res) => {
    res.render('home')
})

//Index page
app.get('/blogs', async (req, res) => {
    const blogs = await Blog.find({})
    res.render('blogs/index', { blogs })
})


//Create new Blog page
app.get('/blogs/new' , (req, res) => {
    res.render('blogs/new')
})


//Post that blog 
app.post('/blogs', async (req, res) => {
    const blog = new Blog(req.body.blog)
    await blog.save()
    res.redirect(`/blogs/${blog._id}`)
} )

//show page
app.get('/blogs/:id', async (req, res) => {
    const blog = await Blog.findById(req.params.id)
    res.render('blogs/show', { blog })
})

//edit Page
app.get('/blogs/:id/edit', async (req, res) => {
    const blog = await Blog.findById(req.params.id)
    res.render('blogs/edit', { blog })
})

//Update 
app.put('/blogs/:id', async (req, res) => {
    const { id } = req.params;
    const blog = await Blog.findByIdAndUpdate(id, {...req.body.blog})
    res.redirect(`/blogs/${blog._id}`)
})

//Delete 
app.delete('/blogs/:id', async (req, res) => {
    const { id } = req.params
    await Blog.findByIdAndDelete(id)
    res.redirect(`/blogs`)
})

app.listen(3000, () => {
    console.log('Serving on port 3000')
})