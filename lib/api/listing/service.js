'use strict';

var Promise = require('bluebird');
var request = require('superagent');
var cheerio = require('cheerio');

var config = require('config');

var DB_TYPE = 'job-listing';

var Service = {};

// return config.db.client.index({
//     index: config.db.index,
//     type: DB_TYPE,
//     id: id,
//     body: ---
// });

module.exports = Service;