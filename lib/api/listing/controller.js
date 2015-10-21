'use strict';

var config = require('config');
var logger = config.logger.child({
    module: 'ad.controller'
});
var service = require('./service');

var listingController = {};

var DB_TYPE = 'listing';

module.exports = listingController;