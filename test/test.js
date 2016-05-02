var request = require("request");
var async = require("async");
var cheerio = require('cheerio');
var util = require('util');
var URL = require('url');
var md5 = require('md5');

var gcloud = require("gcloud")({
  projectId: 'dir-bg-scraper'
  });
var datastore = gcloud.datastore();
var gcs   = gcloud.storage();


function test2() {
	var pageKey = datastore.key(['Page',"0217764db73705192e90b99509ee4b5f2"]);
	var query = datastore.createQuery('Page')
					.select('__key__')
					.filter('__key__', pageKey)
					;
	datastore.runQuery(query,function(err,results){
		console.log(util.inspect(err),util.inspect(results));
	});	
}

test2();



function test1() {
	var test_URL = "http://dnes.dir.bg/news_comments.php?id=22450131&tag_id=119833#show-comment-form";

	var parsed = URL.parse(test_URL);
	console.log(parsed);
	parsed.hash = undefined;

	console.log( URL.format(parsed) );
}
