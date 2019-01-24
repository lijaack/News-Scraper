var axios = require("axios");
var cheerio = require("cheerio");
var db = require("../models");
module.exports = function(app){

    app.get("/scrape", function(req, res) {
        db.Article.deleteMany({saved:false}).then(function(){


            axios.get("https://www.pcgamer.com/news/").then(function(response) {
                var $ = cheerio.load(response.data);        
                $("div.listingResult.small").each(function(i, element) {

                  var result = {};

                  result.title = $(this)
                      .find("h3.article-name")
                      .text();
                  result.link = $(this)
                      .children("a")
                      .attr("href");
                  result.summary = $(this)
                      .find("p.synopsis")
                      .text()
                  result.image =$(this)
                      .find("div.image-remove-reflow-container")
                      .data("original")
      
                  db.Article.create(result)
                    .then(function(dbArticle) {

                    })
                    .catch(function(err) {
                      console.log(err);
                    });

                });
                res.redirect("/");

            });

        })
    });

    app.get("/", function(req, res){

        db.Article.find({saved: false}).then(function(dbArticle){
            var hbsObject = {
                article: dbArticle
            };
            res.render("index", hbsObject)
        })
    })

    app.get("/saved", function(req, res){
        db.Article.find({saved: true})
        .populate("note")
        .then(function(dbArticle){
            var hbsObject = {
                article: dbArticle
            };
            res.render("saved", hbsObject)
        })
    })

    app.post("/saved",function(req, res){
        db.Article.update({_id: req.body.id}, {$set: {"saved": true}}).then(function(result){
            res.json("deleted");
        })
    })

    app.post("/note", function(req, res){
        db.Note.create({
            body: req.body.note
        })
        .then(function(dbNote) {
          return db.Article.findOneAndUpdate({ _id: req.body.id }, {$push:{ note: dbNote._id }}, { new: true });
        })
        .then(function(dbArticle) {
          res.json(dbArticle);
        })
        .catch(function(err) {
          res.json(err);
        });

    })

    app.delete("/article", function(req, res){
        db.Article.deleteMany({_id: req.body.id}).then(function(result){
            res.json("deleted");
        })
    })
    app.delete("/note", function(req, res){
        db.Note.deleteMany({_id: req.body.id}).then(function(result){
            res.json("deleted");
        })
    })
};