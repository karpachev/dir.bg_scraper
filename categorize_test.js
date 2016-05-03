var fs = require("fs");
var util = require("util");
var md5 = require("md5");
var categorize = require("./categorize.js");




fs.readFile("./compare/raw_files/list.yaml", "utf8", (err, yaml) => {
	if (err) {
		console.error("ERR: Cannot read list.yaml file", err);
		return true;
	}
	yaml.split("\r\n").forEach(function(url){
		url = (url.split('\t'))[0];
		try {
			html = fs.readFileSync("./compare/raw_files/"+md5(url)+".html", "utf8");
			console.log("Working on", url);

			categorize.push({body:html, ref_URL:url, body_hash: md5(html)});
		} catch(e) {
			
		}
	});
	//categorize.push({body:html, ref_URL:ref_URL, body_hash: body_hash});
});