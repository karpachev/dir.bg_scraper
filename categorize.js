var request = require("request");
var async = require("async");
var cheerio = require('cheerio');
var util = require('util');
var URL = require('url');
var md5 = require('md5');

var compare_html = require("./compare");

module.exports = async.queue(
	clasify,
	500
);
module.exports.drain = function() {
	categories.forEach(function(el,i){
		console.log(i, el.body_samples.length, el.ref_URLs, el.comparison_scores);
	});
	console.log(  );
}

function Category(task) {
	this.MAX_BODY_SAMPLES = 1;
	this.body_samples = [task.body];
	this.ref_URLs = [task.ref_URL];
	this.comparison_scores = [];

	this.match = function(task) {
		var min_match = Number.POSITIVE_INFINITY;
		var body = task.body;
		for (var i=0;i<this.body_samples.length;i++) {
			var result = compare_html(body, this.body_samples[i]);
			console.log("!!!", result);
			if (result<min_match) min_match = result;
		}

		return min_match;
	}

	this.add = function(task, score) {
		this.body_samples.push(task.body);
		if (this.body_samples.length>this.MAX_BODY_SAMPLES) {
			this.body_samples.shift();
		}
		this.ref_URLs.push( task.ref_URL );

		if (score)
			this.comparison_scores.push(score);
	}
}

var categories = [];
function clasify(task,callback) {
	// {body:body, ref_URL:ref_URL, body_hash: body_hash}
	// var fs = require("fs");
	// fs.writeFileSync("compare/raw_files/"+md5(task.ref_URL)+".html", task.body);
	// fs.appendFileSync("compare/raw_files/list.yaml", task.ref_URL + "\t" + md5(task.ref_URL)+".html\r\n");

	if (categories.length==0) {
		// new category
		categories.push( new Category(task) );
		callback();
		return;
	}

	var categories_match_scores = new Array(categories.length);
	for (var i=0;i<categories.length;i++) {
		categories_match_scores[i] = categories[i].match(task);
	}

	var min_score = categories_match_scores[0],
		min_index = 0;
	categories_match_scores.forEach(function(el,i){
		if (el<min_score) {
			min_score=el;
			min_index = i;	
		} 
	});
	console.log("Scoring", task.ref_URL, min_index, min_score);

	if (min_score<0.03) {
		categories[min_index].add(task,min_score);
	} else {
		categories.push( new Category(task) );
	}
	callback();
	return;
}