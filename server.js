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

//Middleware to parse request body as a json object, set public as a static folder
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(__dirname+ "/public"));



//Connect to mongo database
mongoose.connect("mongodb://localhost/unit18Populater", { useNewUrlParser: true });

// set mongoose middleware
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);

// Set up handlebars
// Register Handlebars view engine
app.engine('handlebars', exphbs());
// Use Handlebars view engine
app.set('view engine', 'handlebars');

//Routes

//Route to go out and get css files
app.get("/assets/css/style.css", (req, res) => {
    res.sendFile(__dirname, "assets/css/style.css");
  });

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
                .catch(function (err) {
                    res.sendStatus(err);
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


//Route to clear everything from the database
app.post("/clear", function(req, res) {
    db.Resort.deleteMany({})
      .then(function(removed) { 
          res.json(removed)
        })
      .catch(function(err) { 
        res.json(err)
      });
  });

app.post("/api/resorts/:id", function (req, res) {
    // console.log("hello")
    db.Resort.findOneAndUpdate(
        {_id: req.params.id},
        {favorite: true}
        // console.log(req.body),
     ).then(dbResort => {
        res.json(dbResort)
    }).catch(err => {
        res.sendStatus(500)
    })
})
// Route to delete an item from the page by its ID
app.delete("/api/resorts/:id", function (req,res){
    db.Resort.deleteOne({
        _id : req.params.id
    })
    .then(function(dbResort){
        res.json(dbResort)

    });
})

//HTML Routes
app.get('/', function (req, res) {
    //Reach out to the mongo server, find all resorts
    db.Resort.find(function (err,resorts) {
        if (err) throw err;
       //Set information about resorts from mongo to handlebars variable
        res.render("index", {
            resorts : resorts
        });
    });
});
app.get('/favorites', function (req, res) {
    //Reach out to the mongo server, find all resorts
    db.Resort.find(
        {favorite : true},function (err,resorts) {
        if (err) throw err;

       //Set information about resorts from mongo to handlebars variable
        res.render("favorites", {
            resorts : resorts
        });
    })
    
});



app.listen(PORT, function () {
    console.log("App running on port " + PORT + "!");
});

