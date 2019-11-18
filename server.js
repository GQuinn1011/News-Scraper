var express = require("express");
var bodyParser = require("body-parser");
var logger = require("morgan");
var mongoose = require("mongoose");
var exphbs = require("express-handlebars");


var request = require("request");
var axios = require("axios");
var cheerio = require("cheerio");

// Require all models
var db = require("./models");

var PORT = process.env.PORT || 3000;

// Initialize Express
var app = express();

// Configure middleware

// Use morgan logger for logging requests
app.use(logger("dev"));
// Use body-parser for handling form submissions
app.use(bodyParser.urlencoded({ extended: true }));
// Use express.static to serve the public folder as a static directory
app.use(express.static("public"));

// Handlebars
app.engine(
    "handlebars",
    exphbs({
        defaultLayout: "main"
    })
);
app.set("view engine", "handlebars");

// Connect to the Mongo DB (connect to remote mongolab database if deployed; 
// otherwise connect to the local mongoHeadlines database)
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/newsscraper";
mongoose.Promise = Promise;
mongoose.connect(MONGODB_URI, { useNewUrlParser: true });
var databaseUri = "mongodb://localhost/newsscraper";
if (process.env.MONGODB_URI) {
    mongoose.connect(process.env.MONGODB_URI);
} else {
    mongoose.connect(databaseUri);
}

// Routes

// Route for getting all Articles from the db
app.get("/", function(req, res) {
    // Grab every document in the Articles collection
    db.Article.find({})
        .then(function(dbArticle) {
            res.render("index", { articles: dbArticle });

        })
        .catch(function(err) {
            // If an error occurred, send it to the client
            res.json(err);
        });
});

// A GET route for scraping the Dressage-News website
app.get("/scrape", function(req, res) {
    // First, we grab the body of the html with request
    axios.get("http://www.macrumors.com/").then(function(response) {

        var $ = cheerio.load(response.data);
        $(".article").each(function(i, element) {
            // Save an empty result object
            var result = {};

            // Add the text and href of every link, and save them as properties of the result object
            result.title = $(this)
                .children(".title")
                .text();
            result.url = $(this)
                .children(".title")
                .children("a")
                .attr("href");
            result.byline = $(this)
                .children(".byline")
                .text();
            result.img = $(this)
                .children(".content")
                .children(".content_inner")
                .children("img")
                .attr("data-src");


            // Check to see if the article already exists in the database; if it does, don't add another copy; 
            // but if it doesn't, then insert the article into the database
            db.Article.findOneAndUpdate({ title: result.title }, result, { upsert: true })
                .then(function(dbArticle) {
                    // View the added result in the console
                    console.log(dbArticle);

                })
                .catch(function(err) {
                    // If an error occurred, send it to the client
                    return res.json(err);
                });
        });

        // If we were able to successfully scrape and save an Article, send a message to the client
        res.send("Scrape Complete");
    });
});

// Route for grabbing a specific Article by id, populate it with its comments
app.get("/articles/:id", function(req, res) {
    // Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
    db.Article.findOne({ _id: req.params.id })
        // ..and populate all of the comments associated with it
        .populate("notes")
        .then(function(dbArticle) {
            // If we were able to successfully find an Article with the given id, send it back to the client
            res.render("notes", { article: dbArticle });
            //res.json(dbArticle);
        })
        .catch(function(err) {
            // If an error occurred, send it to the client
            res.json(err);
        });
});

app.post("/articles/:id", function(req, res) {
    // Create a new comment and pass the req.body to the entry
    db.Note.create(req.body)
        .then(function(dbNote) {
            return db.Article.findOneAndUpdate({ _id: req.params.id }, { $push: { notes: dbNote._id } }, { new: true });
        })
        .then(function(dbArticle) {
            // If we were able to successfully update an Article, send it back to the client
            res.json(dbArticle);
        })
        .catch(function(err) {
            // If an error occurred, send it to the client
            res.json(err);
        });
});

// Delete One from the DB
app.delete("/delete/:id", function(req, res) {

    db.Article.deleteOne({
            _id: req.params.id
        },
        function(error, removed) {

            if (error) {
                console.log(error);
                res.send(error);
            } else {

                console.log(removed);
                res.send(removed);
            }
        }
    );
});
app.delete("/note/delete/:id", function(req, res) {

    db.Note.deleteOne({
            _id: req.params.id
        },
        function(error, removed) {

            if (error) {
                console.log(error);
                res.send(error);
            } else {

                console.log(removed);
                res.send(removed);
            }
        }
    );
});

app.listen(PORT, function() {
    console.log("App running on port " + PORT + "!");
});