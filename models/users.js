const mongoose = require('mongoose');

const choiceSchema = mongoose.Schema({
    country: String,
    language: String
})

const userSchema = mongoose.Schema({
    articles: [{ type: mongoose.Schema.Types.ObjectId, ref: 'articles' }],
    firstName: String,
    lastName: String,
    email: String,
    password: String,
    token: String,
    choice: choiceSchema    
});

module.exports = mongoose.model('users', userSchema);