import mongoose from './connect.js'

const tagsSchema = new mongoose.Schema({
    name: {type: String, required: true},
})

export const tags = mongoose.model('tags', tagsSchema)