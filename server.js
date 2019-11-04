// Require node packages
var express = require("express");
var logger = require("morgan");
var mongoose = require("mongoose");
var axios = require("axios");
var cheerio = require("cheerio");

//Require models
var db = require("./models");

// Init Express App
var app = express();

var PORT = 3000;

//Middleware

//Morgan request logger
app.use(logger("dev"));

//Middleware to parse request body as a json object
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Make public a static folder
app.use(express.static("public"));

//Connect to mongo database
mongoose.connect("mongodb://localhost/unit18Populater", { useNewUrlParser: true });

//Routes

//The GET route scrapes opensnow for data we use to populate the our webpage

app.get("/scrape", function (req, res) {
    //Use axios to grab the body of html
    axios.get("https://opensnow.com/state/UT#history").then(function (response) {
        //Save cheerio to $ to run like jQuery
        var $ = cheerio.load(response.data);
        //Seop open Object use this so store objects and eventually push object to database


        //Grab every CHILD HTML TAG within a PARENT HTML TAG, follows cheerio syntax from documentation here
        $(".title-location").each(function (i, element) {

            //Save the results to a local object
            var result = {}
            //Add text of every link, save as properties of a result object
            result.resortTitle = $(this)
                .children()
                .text();
            result.link = "https://opensnow.com/state/UT#history" + $(this)
                .find("a")
                .attr("href");
            //
            db.Resort.create(result)
                .then(function (dbResort) {
                    console.log(dbResort);
                })
                .catch(function (err) {
                    res.sendStatus(500);
                });
        });
        res.send("Scrape Complete")
    });
});
// Route for getting all Articles from the db
// app.get("/articles", function(req, res) {
//     // TODO: Finish the route so it grabs all of the articles
//     db.Article.find({}, function(err, data){
//       if (err){
//         res.sendStatus(500);
//       }
//       res.json(data);
//     })
//   });
  
//   // Route for grabbing a specific Article by id, populate it with it's note
//   app.get("/articles/:id", function(req, res) {
//     // TODO
//     // ====
//     // Finish the route so it finds one article using the req.params.id,
//     db.Article.findOne({_id : req.params.id})
//     .populate("note")
//     .then(function(dbNote){
      
//       res.json(dbNote)
//     })
//     .catch(function(err){
//       if (err) {
//         res.sendStatus(500);
//       }
//     })
//     // and run the populate method with "note",
//     // then responds with the article with the note included
   
//   });
app.listen(PORT, function() {
    console.log("App running on port " + PORT + "!");
  });

