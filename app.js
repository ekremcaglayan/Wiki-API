const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/wikiDB", {useNewUrlParser: true});

const articleSchema = {
    title: "String",
    content: "String" 
};
const Article = mongoose.model("Article", articleSchema);

app.route("/articles")
.get(function(req, res){
    Article.find().then(function(foundArticles){
        res.send(foundArticles);
    });
})
.post(function(req, res){
    const newArticle = new Article({
        title: req.body.title,
        content: req.body.content
    });

    newArticle.save().then(function(){
        res.send("Succesfully send");
    });
})
.delete(function(req, res){
    Article.deleteMany().then(function(){
        res.send("Succesfully deleted all articles")
    });
});

// SPECIFIC ARTICLE ROUTE

app.route("/articles/:articleTitle")
.get(function(req, res){
    Article.findOne({title: req.params.articleTitle}).then(function(foundArticle){
        res.send(foundArticle);
    });
})
.put(function(req, res){
    Article.replaceOne(
        {title: req.params.articleTitle},
        {title: req.body.title, content: req.body.content}
    ).then(function(){
        res.send("Successfully updated");
    });
})
.patch(function(req, res){
    Article.updateOne(
        {title: req.params.articleTitle},
        {title: req.body.title, content: req.body.content}
    ).then(function(){
        res.send("Successfully updated article");
    });
});

app.listen(3000, function() {
    console.log("Server started on port 3000");
});