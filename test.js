var request = require("request");
var async = require("async");
var cheerio = require('cheerio');
var util = require('util');
var URL = require('url');
var md5 = require('md5');


var test_URL = "http://dnes.dir.bg/news_comments.php?id=22450131&tag_id=119833#show-comment-form";

var parsed = URL.parse(test_URL);
console.log(parsed);
parsed.hash = undefined;

console.log( URL.format(parsed) );
