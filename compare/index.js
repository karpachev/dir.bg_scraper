var compare = require("./lib/compare.js");
var load_dom = require("./lib/load_dom.js");

module.exports = function(html1,html2) {
	var stats= compare(load_dom(html1), load_dom(html2));
	// console.log(stats.toString());
	return stats.no_match / stats.total;	
}



