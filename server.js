var express = require("express"); 
var exphbs = require("express-handlebars");
var bodyParser = require("body-parser");
var logger = require("morgan");
var mongoose = require("mongoose");
var axios = require("axios");
var cheerio = require("cheerio");
var PORT = 3000;

var app = express();

// Use morgan logger for logging requests
app.use(logger("dev"));

// Make public a static folder
app.use(express.static("public"));

// Sets up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//sets up app to use body parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//view engine
app.engine("handlebars", exphbs({ defaultLayout: "main", helpers: require('handlebars-helpers') }));
app.set("view engine", "handlebars");



// Routes
// =============================================================
require("./controllers/scraper-routes.js")(app);


// Require all models
var db = require("./models");

// Connect to the Mongo DB
mongoose.connect("mongodb://localhost/", { useNewUrlParser: true });

// Start the server
app.listen(PORT, function() {
  console.log("App running on port " + PORT + "!");
});
