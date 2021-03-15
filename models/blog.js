
const mongoose = require('mongoose')
const Schema = mongoose.Schema

const BlogSchema = new Schema({
    title: String,
    image: String,
    description: String
})

module.exports = mongoose.model('Blog', BlogSchema)