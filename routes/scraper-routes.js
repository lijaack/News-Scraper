var axios = require("axios");
var cheerio = require("cheerio");
var db = require("../models");
module.exports = function(app){

    app.get("/scrape", function(req, res) {
        // First, we grab the body of the html with axios
        db.Article.remove({saved:false}).then(function(){
            axios.get("https://www.gamespot.com/news/").then(function(response) {
                // Then, we load that into cheerio and save it to $ for a shorthand selector
                var $ = cheerio.load(response.data);        
                // Now, we grab every h2 within an article tag, and do the following:
                $("article.media-article").each(function(i, element) {
                  // Save an empty result object
                  var result = {};
               
                  // Add the text and href of every link, and save them as properties of the result object
                  result.title = $(this)
                      .find("h3.media-title")
                      .text();
                  result.link = $(this)
                      .children("a")
                      .attr("href");
                  result.summary = $(this)
                      .find("p.media-deck")
                      .text()
                  result.image = $(this)
                      .find("div.media-img")
                      .children("img")
                      .attr("src")
      
                    console.log(result)
                  // Create a new Article using the `result` object built from scraping
                  db.Article.create(result)
                    .then(function(dbArticle) {
                      // View the added result in the console
                      console.log(dbArticle);
                    })
                    .catch(function(err) {
                      // If an error occurred, log it
                      console.log(err);
                    });
                });
            
                // Send a message to the client
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
            console.log(dbArticle)
            var hbsObject = {
                article: dbArticle
            };
            res.render("saved", hbsObject)
        })
    })

    app.post("/saved",function(req, res){
        db.Article.update({_id: req.body.id}, {$set: {"saved": true}}).then(function(result){
            console.log("4")
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
        db.Article.remove({_id: req.body.id}).then(function(result){
            res.json("deleted");
        })
    })
    app.delete("/note", function(req, res){
        db.Note.remove({_id: req.body.id}).then(function(result){
            res.json("deleted");
        })
    })
};