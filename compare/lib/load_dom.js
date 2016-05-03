module.exports = function loadDom(file) {
	var htmlparser = require("htmlparser");
	// var util = require("util");
	// var fs = require("fs");	

	var handler = new htmlparser.DefaultHandler(function (error, dom) {
		if (error) {
			throw "Unable to parse file"
		}
		else {
			//console.log("Succesfully parsed")
		}
	});
	var parser = new htmlparser.Parser(handler);
	parser.parseComplete(file);
	return remove_empty_tags(handler.dom);
}

function remove_empty_tags(dom) {
	if (dom===undefined) return dom;
	if (dom.length && dom.length==0) return dom;

	for (var i=0;i<dom.length;i++) {
		var el= dom[i];
		if (el.type=="text" && is_spaces(el.raw)) {
			dom.splice(i,1)
			i--;
			continue;
		}
		var not_visible_tags = ["comment","script","style","noscript"];
		not_visible_tags.forEach(function(tags){
			if (el.type.toUpperCase()==tags.toUpperCase()) {
				dom.splice(i,1)
				i--;
			}
		});

		remove_empty_tags(el.children);
	}

	return dom;
}

function is_spaces(str) {
	for (var i=0;i<str.length;i++) {
		if (str[i]!=' ' && str[i]!='\t' && str[i]!='\r' && str[i]!='\n') {
			return false; 
		}
	}
	return true;
}