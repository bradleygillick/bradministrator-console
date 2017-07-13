var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
require("dotenv").load();

var index = require('./server/routes/index');

var app = express();

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }))


app.use(cookieParser());
app.use(express.static(path.join(__dirname, './client')));
app.use(express.static(path.join(__dirname, './node_modules')));
//app.use(express.static(path.join(__dirname, '/../', 'node_modules')))

app.use('/api/hwValues', require('./server/routes/hwvalues'))



app.use('*', function (req, res) {
  res.sendFile('index.html', {
    root: path.join(__dirname, './client')
  })
})

// error handler
app.use(function(err, req, res, next) {
  const response = { message: err.message }
  if (req.app.get('env') === 'development') {
    response.stack = err.stack
  }

  res.status(err.status || 500).json(response)
});

module.exports = app;