const mongoose = require('mongoose')
const Comment = require('./comment')
const Schema = mongoose.Schema

const BlogSchema = new Schema({
    title: String,
    image: String,
    description: String,
    createdAt: { type: Date, default: Date.now },
	author: {
		id: {
			type: Schema.Types.ObjectId,
			ref: 'User'
		},
		username: String
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