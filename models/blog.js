const mongoose = require('mongoose')
const Comment = require('./comment')
const User = require('./user')
const Schema = mongoose.Schema

const BlogSchema = new Schema({
    title: String,
    images: [{
        url: String,
        filename: String
    }],
    description: String,
    createdAt: { type: Date, default: Date.now },
	author: {
		type: Schema.Types.ObjectId,
		ref: 'User'
	},
	comments: [
		{
			type: Schema.Types.ObjectId,
			ref: 'Comment'
		}
    ],
    likes: [
        {
            type: Schema.Types.ObjectId,
            ref: "User"
        }
	]
})

BlogSchema.post('findOneAndDelete', async function (doc) {
    if (doc) {
        await Comment.deleteMany({
            _id: {
                $in: doc.comments
            }
        })
    }
})

module.exports = mongoose.model('Blog', BlogSchema)