var async = require("async");
var request = require("request");
var util = require("util");
var md5 = require("md5");
var gcloud = require("gcloud")({
  projectId: 'dir-bg-scraper'
  });
var datastore = gcloud.datastore();
var gcs   = gcloud.storage();
var compare_html = require("../compare_html_files.js");
var diff = require("diff");


var URL1 = "http://dnes.dir.bg/news/voda-tzena-kevr-22475005?nt=10",
	URL2 = "http://dnes.dir.bg/news/iznos-gazprom-krajat-zhen-potok-22476967?nt=9";

function load_entry_datastore(url,callback) {
	// console.log("In datastore.js::pre_store_page");
	var pageKey = datastore.key(['Page',md5(url)]);
	datastore.get(pageKey,function(err,entity){
		callback(err,entity.data.body);
	});
}

function load_entry(url,callback) {
	// console.log("In datastore.js::pre_store_page");
	request(url,function (error, response, body){
		callback(error,body);
	});
}

async.parallel(
	[
		load_entry.bind(null,URL1),
		load_entry.bind(null,URL2),
	],
	function(err,results) {
		// console.log(util.inspect(results));
		var comp = compare_html(results[0], results[1]);
		console.log(comp);
	}
);