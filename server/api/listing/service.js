'use strict';

var Promise = require('bluebird');
var request = require('superagent-promise')(require('superagent'), Promise);
var cheerio = require('cheerio');

var config = require('config');
var logger = config.logger.child({
    module: 'listing.service'
});

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

function fetchList() {
    var url = "http://service.dice.com/api/rest/jobsearch/v1/simple.json?sort=1&pgcnt=10";
    return fetchPage(url)
    .then(function(res) {
        return JSON.parse(res);
    });
}

var processList = function(list) {
    var result = [];

    return Promise.resolve(list)
    .each(function(listing) {
        return processPage(listing)
        .then(function(pageResult) {
            console.log(result.length);
            result.push(pageResult);
        });
    })
    .then(function() {
        console.log(result.length);
        return result;
    });
};

var processPage = function(page) {
    var pageResult = {
        lister: {
            company: {
                name: page.company
            }
        },
        url: page.detailUrl,
        title: page.jobTitle,
        location: page.location
    };

    return fetchPage(page.detailUrl)
    .then(function(response) {
        var $ = cheerio.load(response);

        pageResult.lister.company.displayName = $('li.employer').find('a').text();
        pageResult.description = $('#jobdescSec').text();
        var payIcon = $('span.icon-bank-note')[0];
        if(payIcon) {
            pageResult.pay = $(payIcon.parent.parent).find('.iconsiblings').find('span').html();
        }

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