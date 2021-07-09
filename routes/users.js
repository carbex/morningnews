var express = require('express');
var router = express.Router();
var bcrypt = require('bcrypt');
var uid2 = require('uid2');
const User = require('../models/users');
const Article = require('../models/articles');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/sign-in', async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email })

  let isLogin = false
  let message = null

  var password = req.body.password
  var result = bcrypt.compareSync(password, user.password)

  if(req.body.email.length === 0 || req.body.password.length === 0) {
    message = 'Veuillez saisir tous les champs'
  } else if(!user || !result) {
    message = 'Email ou mot de pass incorrect'
  } else if (result){
    isLogin = true
  }

  res.json({ isLogin, message, user: user })
})

router.post('/sign-up', async (req, res, next) => {

  var hash = bcrypt.hashSync(req.body.password, 10)
  var token = uid2(32)
  const user = await User.findOne({ email: req.body.email })
  
  let isLogin = false
  let message = null

  if(req.body.firstName.legnth === 0 || req.body.lastName.length === 0 || req.body.email.length === 0 || req.body.password.length === 0) {
    message = 'Veuillez saisir tous les champs'
  } else if(user) {
    message = 'Cet utilisateur existe déjà'
  } else {
    const newUser = new User({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      password: hash,
      token: token
    });
    await newUser.save()
    isLogin = true  
    res.json({ isLogin, message, user: newUser }) 
  }  
})

router.post('/add-choice', async (req, res, next) => {
  let token = req.body.token
  let choice = JSON.parse(req.body.choice)
  let user = await User.findOne({ token: token })
  if(user) {
    await User.updateOne({ token: token }, { choice: choice })
  }
  res.json({ result: true })
})

router.post('/add-article', async (req, res, next) => {
  let article = JSON.parse(req.body.article)
  let newArticle = new Article({
    urlToImage: article.urlToImage,
    title: article.title,
    description: article.description,
    content: article.content,
    language: article.language
  })

  let user = await User.findOne({ token: req.body.token }).populate('articles').exec();
  // l'article a-t-il déjà été liké par cet utilisateur ?
    if (!user.articles.find(e => e.title === article.title)) {
        let articleExists = await Article.findOne({ title: article.title });
        // l'article existe-t-il déjà dans la bdd
        if (!articleExists) {
            let savedArticle = await newArticle.save();
            user.articles.push(savedArticle._id);
        } else {
            user.articles.push(articleExists._id);
        }
        let savedUser = await user.save();
        res.json({ result: true, user: savedUser })
    } else {
        res.json({ result: false, user: user })
    }
})

router.delete('/delete-article/:token/:title', async (req, res, next) => {
  let article = await Article.findOne({title: req.params.title})
  let user = await User.findOne({token: req.params.token})
  user.articles.splice(user.articles.indexOf(article._id), 1)
  await user.save()

  res.json({result: true})
})

router.get('/get-article/:token', async (req, res, next) => {
  let user = await User.findOne({ token: req.params.token }).populate('articles').exec();
  let wishList = user.articles
  res.json({result: true, wishList})
})

module.exports = router;
