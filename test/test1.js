var gcloud = require("gcloud");
var storage = gcloud.storage({projectId:"dir-bg-scraper"});

var sample_TXT_file = "Hello there,\r\nThis is sample text file with important info\r\n\r\nBest Regards!";

storage.createBucket("dir-bg-scraper", function(err, bucket, apiResponse) {
	if (err===null) {
		// bucket is the newly created "Test-Bucket"
		console.log("'dir-bg-scraper.appspot.com' successfully created!");

		// create 'README.md' file into this bucket
		var new_file = bucket.file("README.md");
		upload_file(new_file, sample_TXT_file, function(err){
			if (err!==null) {
				console.log("Successfully uploaded the file!");
			} else {
				console.error("Failed to uploaded the file..");
			}
		});
		
	} else {
		console.error("Feiled to create 'dir-bg-scraper.appspot.com'..", err);
	}
});

function upload_file(file, contents, callback) {
	// open write stream
	var stream = file.createWriteStream();

	// if there is an error signal back 
	stream.on('error', callback);

	// if everything is successfull signal back
	stream.on('finish', callback);

	// send the contents
	stream.end(contents);		
}