'use strict';

var Promise = require('bluebird');
var request = require('superagent-promise')(require('superagent'), Promise);
var cheerio = require('cheerio');

var config = require('config');

var DB_TYPE = 'job-listing';

var Service = {};

// return config.db.client.index({
//     index: config.db.index,
//     type: DB_TYPE,
//     id: id,
//     listing_id:
//     lister: {
//         id:
//         name:
//     },
//     body:
//     url:
//     title:
//     location:
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

    return Promise.resolve(list)
    .each(function(listing) {
        return processPage(listing)
        .then(function(pageResult) {
            result.push(pageResult);
        });
    })
    .then(function() {
        return result;
    });
};

var processPage = function(page) {
    var pageResult = {
        lister: {
            name: page.company
        },
        url: page.detailUrl,
        title: page.jobTitle,
        location: page.location
    };

    return fetchPage(page.detailUrl)
    .then(function(response) {
        console.log(response);

        return pageResult;
    });
};

var fetchPage = function(url) {
    return request.get(url)
    .then(function(res) {
        return res.text;
    });
};

module.exports = Service;