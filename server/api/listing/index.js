'use strict';

var express = require('express');
var router = express.Router();

var config = require('config');
var logger = config.logger.child({
    module: 'listing'
});

var controller = require('./controller.js');

router.get('/index/?', controller.index)

module.exports = router;