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

Service.index = function() {
    return fetchList()
    .then(function(res) {
        return processList(res.resultItemList);
    });
};

var fetchList = function() {
    var url = "http://service.dice.com/api/rest/jobsearch/v1/simple.json?sort=1&pgcnt=5";
    return fetchPage(url)
    .then(function(res) {
        return JSON.parse(res);
    });
};

var processList = function(list) {
    var result = [];

    return new Promise(function(resolve) {
        resolve(list);
    }).each(function(listing) {
        return processPage(listing)
        .then(function(pageResult) {
            result.push(pageResult);
        });
    })
    .then(function() {
        return result;
    });
};

var i = 0;
var processPage = function(page) {
    console.log("processing page " + ++i);
    var pageResult = {
        title: page.jobTitle,
        company: page.company,
        location: page.location
    };

    return fetchPage(page.detailUrl)
    .then(function(response) {
        return pageResult;
    });
};

var fetchPage = function(url) {
    return new Promise(function(resolve, reject) {

        request.get(url)
        .end(function(err, res) {
            if(err) {
                return reject(err);
            }
            resolve(res.text);
        });
    });
};

module.exports = Service;