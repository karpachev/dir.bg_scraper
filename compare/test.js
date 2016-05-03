var Stats = require("./lib/stats.js");
var compare = require("./lib/compare.js");
var load_dom = require("./lib/load_dom.js");

require("./lib/load_files")("should_NOT_be_euqal_2.txt", function(err, files){
	if (err) {
		console.error("ERR: failed loading all files.. exiting");
		return false;
	}
	// console.log(files);
	dump(load_dom(files[0]), load_dom(files[1]));
	var stats= compare(load_dom(files[0]), load_dom(files[1]));
	console.log(stats.toString());

	for (var i=0;i<files.length*0;i++) {
		for (var j=0;j<files.length;j++) {
			if (i!=j) {
				var stats= compare (load_dom(files[i]), load_dom(files[j]));
				console.log(i, j, stats.toString());
			}
		}
	}	
});


function dump(dom1, dom2) {
	var fs = require("fs");
	fs.writeFileSync("logs/file1.json", JSON.stringify(dom1));
	fs.writeFileSync("logs/file2.json", JSON.stringify(dom2));
}



