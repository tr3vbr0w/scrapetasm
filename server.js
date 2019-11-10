// Require node packages
var exphbs = require('express-handlebars')
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

// Set up handlebars
// Register Handlebars view engine
app.engine('handlebars', exphbs());
// Use Handlebars view engine
app.set('view engine', 'handlebars');

//Routes

//The GET route scrapes opensnow for data we use to populate the our webpage
//API Routes
app.get("/scrape", function (req, res) {
    //Use axios to grab the body of html
    axios.get("https://opensnow.com/state/UT#history").then(function (response) {
        //Save cheerio to $ to run like jQuery
        var $ = cheerio.load(response.data);
       //Grab every CHILD HTML TAG within a PARENT HTML TAG, follows cheerio syntax from documentation here
        $(".title-location").each(function (i, element) {

            //Save the results to a local object
            var result = {}
            //Add text of every link, save as properties of a result object
            result.resortTitle = $(this)
                .children()
                .text();
            result.link = "https://opensnow.com/" + $(this)
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
app.get("/api/resorts", function (req, res) {
    db.Resort.find({}, function (err, data) {
        if (err) {
            res.sendStatus(500);
        }
        res.json(data)
    })
})



//HTML Routes
app.get('/', function (req, res) {
    db.Resort.find({}, function (dbResort) {
        // res.send(data)
        res.render("index", {
            resort : dbResort
        });
    });
});


app.listen(PORT, function () {
    console.log("App running on port " + PORT + "!");
});

