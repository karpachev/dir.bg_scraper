var util = require("util");

var async = require("async");
var md5 = require("md5");
var gcloud = require("gcloud")({
  projectId: 'dir-bg-scraper'
  });
var datastore = gcloud.datastore();
// var gcs   = gcloud.storage();

module.exports = function(URL, callback) {
	var response = {
		statusCode : 200
	}
	var pageKey = datastore.key(['Page',md5(URL)]);
	var query = datastore.createQuery('Page')
					.filter('__key__', pageKey)
					;
	datastore.runQuery(query,function(err,results){
		if (!results || results.length!=1) {
			response.statusCode= 400;
			callback("Not in Datastore", response, null)
		} else {
			// console.log("Found in Datastore", URL, util.inspect(results));
			callback(null,response,results[0].data.body);
		}
	});
}
