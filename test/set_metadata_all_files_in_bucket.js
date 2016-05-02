var util = require("util");
var async = require("async");
var md5 = require("md5");
var gcloud = require("gcloud")({
  projectId: 'dir-bg-scraper'
  });
var datastore = gcloud.datastore();
var gcs   = gcloud.storage();


var dnes_dir_bg_bucket = gcs.bucket("dnes_dir_bg");

var queue = async.queue(
	process_file,
	20
);

dnes_dir_bg_bucket.get(function(err, bucket, apiResponse) {
	if (!err) {
		dnes_dir_bg_bucket = bucket;
		dnes_dir_bg_bucket.getFiles()
			.on('data', function(file) {
				if (file) 
 					queue.push({file:file});
			});
	} else {
		console.error("Unable to find bucket.", err);
	}
});

function process_file(task, callback) {
	var file = task.file;

	file.getMetadata(function(err, metadata, apiResponse) {
		//console.log(metadata);
		if (err) {
			setTimeout(
				process_file.bind(null,file),
				300
			);
		} else {
			metadata.contentType = "text/html";
			file.setMetadata(metadata, function(err, apiResponse) {
				console.log(err, "Set metadata for file", file.name);
				callback();
			})			
		}
	})
}