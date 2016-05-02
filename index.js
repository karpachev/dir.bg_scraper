var request = require("request");
var async = require("async");
var cheerio = require('cheerio');
var util = require('util');
var URL = require('url');
var md5 = require('md5');

var datastore = require('./datastore.js');
var stats = require("./stats.js");

var starting_URL = 'http://dnes.dir.bg';
/// Configuration object for the Crawling task
function TaskConfig(config) {
	this.request = request;
	this.request = require("./datastore_request.js");

	if (config)
		for (key in config) {
			this[key] = config[key];
		}
}


var crawler_queue = async.queue(
		request_page,
		500
	);
crawler_queue.push(new TaskConfig({
	URL:starting_URL,
	max_level: 1
}));
crawler_queue.drain = stats.print_stats.bind(stats);

var visited_pages = {};
var hashes = {};
function request_page(task, callback) {
	if (visited_pages[task.URL]) {
		//console.log(util.format("Already processed %s", task.URL));
		callback();
		return;
	}

	console.log("Crawling ", task.URL, ":", task.max_level);
	visited_pages[task.URL] = true;
	task.request(task.URL, function (error, response, body) {
	  if (!error && response.statusCode == 200) {
	  	//console.log(util.format("Finished processing %s [%d]", task.URL, body.length));
	  	process_page(task, body);
	  } else {
	  	if (task.retries && task.retries>2) {
	  		console.error(util.format("ERR: Failed processing %s", task.URL));
	  	} else {
	  		if(!task.retries) task.retries= 0;
	  		task.retries++;
	  		request_page(task, callback);
	  		return;
	  	}
	  }
      callback();
	});
}

function process_page(task, body) {
	stats.new_page(body); // save some stats
	var ref_URL = task.URL;

	var body_hash = md5(body);
	if (hashes[body_hash]) {
		console.error(util.format("-------\r\n%s already processed as \r\n%s",
				ref_URL, hashes[body_hash].join("\r\n")
			));
		hashes[body_hash].push(ref_URL);
	} else {
		hashes[body_hash] = [ref_URL];
	}

	datastore.push({body:body, ref_URL:ref_URL, body_hash: body_hash});

	var $ = cheerio.load(body);
	$("a").each( function(index,element) {
		var href= $(element).attr("href");
		if (!filter(href)) {
			//console.log(href);
			var parsed_url = URL.parse(href);
			if (parsed_url.hostname && parsed_url.hostname!="dnes.dir.bg") {
				//console.log("Skipping link outside of domain", href);
				return true;
			}
			var resolved_URL = URL.resolve(ref_URL,href);
			parsed_url = URL.parse(resolved_URL)
			parsed_url.hash = undefined;
			resolved_URL = URL.format(parsed_url);
			if (visited_pages[resolved_URL]) {
				return true;
			}			
			if (task.max_level!==undefined && task.max_level<1) {
				return true;
			}
			var new_task = new TaskConfig({URL:resolved_URL});
			if (task.max_level!==undefined) new_task.max_level = task.max_level-1;
			crawler_queue.push(new_task);
		}
	});
}

function rewrite_URL(ref_URL,href) {
	return URL.resolve(ref_URL,href);
}

function filter(href) {
	if (!href) return true;
	if (href.length<=1) return true;
	if (href.substring(0,"#".length)=="#") return true;

	if (href.substring(0,"javascript:".length)=="javascript:") {
		return true;
	}
	return false;
}