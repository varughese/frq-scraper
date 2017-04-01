var express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    morgan = require('morgan'),
    mongoose = require('mongoose'),
    path = require('path');

var config = require('./config');

var MongoClient = require('mongodb').MongoClient;


app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.use(function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, content-type, Authorization');
    next();
});

app.use(morgan('dev'));

MongoClient.connect(config.database, function(err, db) {

    var apiRoutes = require('./server/routes/api')(app, express, db);

    app.use('/api', apiRoutes);

    app.get('*', function(req, res) {
        res.sendFile(path.join(__dirname + '/public/index.html'));
    });

    app.listen(8080);
    console.log('Magic happening on port', 8080);



    require('./extracttext')(db);



});
