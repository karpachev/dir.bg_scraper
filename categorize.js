var request = require("request");
var async = require("async");
var cheerio = require('cheerio');
var util = require('util');
var URL = require('url');
var md5 = require('md5');

var datastore = require('./datastore.js');

var starting_URL = 'http://dnes.dir.bg';