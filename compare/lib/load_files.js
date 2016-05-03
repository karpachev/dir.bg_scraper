var fs = require("fs");
var md5 = require("md5");
var request = require("request");
var async = require("async");

module.exports = function (test_config_case, callback) {

	var file_names = fs.readFileSync("test_config/"+test_config_case,"utf8");
	file_names = file_names.split("\r\n");
	// console.log(file_names);

	var result = [];
	file_names.forEach(function(url,i) {
		result.push(
			function(callback) {
				request(url, (err,response,body) => {
					if (err || response.statusCode!=200) {
						console.error("ERR: Could not access", url);
						callback(err);
						return false;
					}
					callback(null, body);	
				});				
			}
		);
	});

	async.parallel(result, function(err,resutls){
		callback(err, resutls);
	});
};

function static_files(test_config_case) {
	var fs = require("fs");
	var md5 = require("md5");

	var file_names = fs.readFileSync("test_config/"+test_config_case,"utf8");
	file_names = file_names.split("\r\n");
	// console.log(file_names);

	var result = [];
	file_names.forEach(function(file,i){
		file = "raw_files/" + md5(file) + ".html";
		result.push( fs.readFileSync(file, "utf8") );
	});

	return result;
}