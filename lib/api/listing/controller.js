'use strict';

var config = require('config');
var logger = config.logger.child({
    module: 'ad.controller'
});
var service = require('./service');

var listingController = {};

var DB_TYPE = 'listing';

listingController.index = function(req, res) {
    logger.trace("received index request");

    service.index()
    .then(function(result) {
        res.status(200).json(result);
    });
};

module.exports = listingController;