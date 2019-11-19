var express = require("express");
var bodyParser = require("body-parser");
var logger = require("morgan");
var mongoose = require("mongoose");
var exphbs = require("express-handlebars");
var axios = require("axios");
var cheerio = require("cheerio");
var db = require("./models");
var request = require("request");
var PORT = process.env.PORT || 3000;
var app = express();

app.use(logger("dev"));
app.use(bodyParser.urlencoded({ extended: true }));
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
    db.Article.find({})
        .then(function(dbArticle) {
            res.render("index", { articles: dbArticle });

        })
        .catch(function(err) {
            // If an error occurred, send it to the client
            res.json(err);
        });
});
app.get("/notes", function(req, res) {
    // Grab every document in the Articles collection
    db.Note.find({})
        .then(function(dbNote) {
            // If we were able to successfully find Articles, send them back to the client
            res.json(dbNote);
        })
        .catch(function(err) {
            // If an error occurred, send it to the client
            res.json(err);
        });
});

// A GET route for scraping website
app.get("/scrape", function(req, res) {
    axios.get("https://www.macrumors.com/").then(function(response) {

        var $ = cheerio.load(response.data);
        $(".article").each(function(i, element) {
            var result = {};

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


            // Checks for duplicate entries in db if none add article
            db.Article.findOneAndUpdate({ title: result.title }, result, { upsert: true })
                .then(function(dbArticle) {
                    console.log(dbArticle);
                })
                .catch(function(err) {
                    return res.json(err);
                });
        });
        res.send("Scrape Complete");
    });
});

// Route for grabbing a specific Article by id, populate it with notes
app.get("/articles/:id", function(req, res) {
    db.Article.findOne({ _id: req.params.id })
        .populate("notes")
        .then(function(dbArticle) {
            res.render("notes", { article: dbArticle });
        })
        .catch(function(err) {
            res.json(err);
        });
});

app.post("/articles/:id", function(req, res) {
    // Create a new note and pass the req.body to the entry
    db.Note.create(req.body)
        .then(function(dbNote) {
            return db.Article.findOneAndUpdate({ _id: req.params.id }, { $push: { notes: dbNote._id } }, { new: true });
        })
        .then(function(dbArticle) {
            res.json(dbArticle);
        })
        .catch(function(err) {
            res.json(err);
        });
});

// Delete article from the DB
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
// Delete note from article
app.delete("/notes/delete/:id", function(req, res) {

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