var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var project = require('./project/app');
var cors = require("cors");

const port = process.env.PORT || 8080;
const router = express.Router();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Unsafely enable cors
app.use(cors());

project(app);
app.listen(port);
app.use('/api', router);
console.log(`API running at localhost:${port}/api`);
