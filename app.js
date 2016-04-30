'use strict';

var config = require('config');
var express = require('express');
var app = express();
config.express(app, config);

require('./server/loaders/routes.js')(app);