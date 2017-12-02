const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser')
const path = require("path");
const db = require('./db');
//const favicon = require('serve-favicon');

//controllers
const spellingController = require("./controllers/spellingController");
const d3Controller = require("./controllers/d3Controller");
//Express request pipeline
const app = express();
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname,"./views"));
//app.use(favicon(path.join(__dirname,"../public/assets/images/favicon.ico")));
app.use(express.static(path.join(__dirname,"./views/assets")));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use("/spelling", spellingController);
app.use("/d3", d3Controller);

app.get('/', function (req, res) {
  res.send('Hello World!')
})


app.listen(80, function () {
  console.log('Example app listening on port 80!')
})
