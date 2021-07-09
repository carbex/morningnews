const mongoose = require('mongoose');

const articleSchema = mongoose.Schema({
    urlToImage: String,
    title: String,
    description: String,
    content: String,
    language: String
});

module.exports = mongoose.model('articles', articleSchema);