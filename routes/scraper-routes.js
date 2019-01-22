var axios = require("axios");
var cheerio = require("cheerio");
var db = require("../models");
module.exports = function(app){

    app.get("/scrape", function(req, res) {
        // First, we grab the body of the html with axios
        db.Article.deleteMany({}).then(function(){
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

        db.Article.find({}).then(function(dbArticle){
            var hbsObject = {
                article: dbArticle
            };
            res.render("index", hbsObject)
        })
    })

    app.get("/saved", function(req, res){
        res.render("saved")
    })
};