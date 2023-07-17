const bunyan = require('bunyan')
const logger = bunyan.createLogger({
  name: 'dd-trace',
  level: 'trace'
})

//Datadog Tracing Injections
const tracer = require('dd-trace').init({
  debug: true,
  logInjection: true,
  logger: {
    debug: message => logger.trace(message),
    error: err => logger.error(err)
  }
});

tracer.use('http', {
  server: {
    hooks: {
      request: (span, req, res) => {
        // pathname should be low cardinality (i.e. not /user/:id with millions of IDs)
        span.setTag('http.route', url.parse(req.url).pathname)
      }
    }
  }
})

const express = require("express");
const mongoose = require('mongoose');
require("dotenv").config();

const keys = require('./keys');

const routes = require("./routes");

const PORT = process.env.PORT || 3001;
const app = express();

var StatsD = require('hot-shots');
var dogstatsd = new StatsD();

// Increment a counter.
dogstatsd.increment('page.views');

// Define middleware here
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Serve up static assets (usually on heroku)
if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"));
}

//Setting headers for CORS Policies
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "http://daily-plans.herokuapp.com");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Credentials");
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");
  res.header("Access-Control-Allow-Credentials", "true");
  next();
});

// Add routes, both API and view 
app.use(routes);

// Connect to the Mongo DB

const connection = (process.env.NODE_ENV === "production" ? process.env.MONGO_URI : keys.mongodb.mongo_uri);

if (process.env.NODE_ENV === "production") {
  mongoose.connect(connection, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false })
    .then(() => console.log("Database Connected Successfully"))
    .catch(err => console.log(err));
} else {
  mongoose.connect(process.env.MONGODB_URI || "mongodb://127.0.0.1/daily-planner", { useNewUrlParser: true, useUnifiedTopology: true });
}

//Start the API server
app.listen(PORT, function () {
  console.log(`🌎  ==> API Server now listening on PORT ${PORT}!`);
});