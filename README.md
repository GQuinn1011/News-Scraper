# News-Scraper

## Introduction

This app uses Node, Express, MongodB, and Handlebars to scrape news articles from Macrumors.com. You have the ability to create and delete notes for each of the articles as well as the articles themselves. So start scraping the news! 

https://young-escarpment-72088.herokuapp.com/

### Prerequisites

Download and install on your computer:
* MongodB - www.mongodb.com/download-center/community 
* NodeJS - www.nodejs.org/en/download
* Heroku - www.heroku.com (use this if you want to deploy the app)


## Getting Started

* Clone the Repository
* Make a .gitignore file and add the following lines to it. This will tell git not to track these files, and won't be commited to Github.
```
node_modules
.DS_Store
.env
```
* If you want to deploy your app to Heroku you need to install the addon mLab (read the documentation on heroku.com for detailed explaination). Once you do that grab you Mongod_URI you will need that to deploy your database.
* In your .env file put MONGODB_URI=mongodb://<yourinfohere>(from the step above ). This will allow to connect with your database.

* After you've completed the above steps you then have to install the following node modules in the command line in terminal/bash:
```
npm install <package name> or just npm i
  * axios
  * cheerio
  * express
  * express-handlebars
  * mongoose
  
```


### List of Features/Functions

To run program type in the command line:
* mogod
    *  This will start the mongo database.
* node server.js  
    * This will start the server.
    * Then go to your browser type in localhost:3000, this should bring you to the news scraper home page to scrape articles.
* heroku create
    * This is to get the heroku deployment link.
* git push heroku master
    * Make sure you have updated your repo with a push prior to doing this.
* heroku open
    * This will bring you to the browser and it will automatically open to the news scraper home page.
  
### Built With
  
1. Handlebars
1. javascript
1. node.js
1. MongodB
1. https://www.npmjs.com/ - for axios, mongoose, express, express-handlebars, and cheerio.
1. mLab
1. Heroku
  
