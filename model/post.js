const mongoose = require("mongoose")
const MSchema = mongoose.Schema

mongoose.set('strictQuery', false);

const postSchema = new MSchema({
  comment: String,
  userId: String
})

module.exports = mongoose.model('Post', postSchema)