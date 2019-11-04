// Require node packages
var express = require("express");
var logger = require("morgan");
var mongoose = require("mongoose");
var axios = require("axios");
var cheerio = require("cheerio");

//Require models
var db  = require ("./models");

// Init Express App
var app = express();

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

//The GET route scrapes INSERT SITE HERE for data we use to populate the our webpage

app.get("scrape", function(request, response) {
    //Use axios to grab the body of html
    axios/get("https://opensnow.com/state/UT#history").then(function(error, response){
        //Save cheerio to $ to run like jQuery
        var $ = cheerio.load(response.data);
        //Seop open Object use this so store objects and eventually push object to database

        
        //Grab every CHILD HTML TAG within a PARENT HTML TAG, follows cheerio syntax from documentation here
        $(".title-location").each(function(i,element){
            
            //Save the results to a local object
            var result = {} 
            //Add text of every link, save as properties of a result object
            result.resortTitle = $(this)
                .children()
                .text();
            result.linglink = $(this)
                .find("a")
                .attr("href");
            
        })
    });
})

