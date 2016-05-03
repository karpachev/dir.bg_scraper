var htmlparser = require("htmlparser");
var util = require("util");
var fs = require("fs");

/// Compares html1 and html2 and returns an estimate on the percentage
/// on the number of characters they differ compared to bigger file
module.exports = function(html1, html2) {
	var handler = new htmlparser.DefaultHandler(function (error, dom) {
		if (error) {
			throw "Unable to parse file"
		}
		else {
			//console.log("Succesfully parsed")
		}
	});
	var parser = new htmlparser.Parser(handler);
	parser.parseComplete(html1);
	var dom1 = handler.dom;
	// util.puts(util.inspect(dom1, false, null));
	parser.parseComplete(html2);
	var dom2 = handler.dom;
	var difference = compare(dom1,dom2);
	// console.log("Difference", difference, dom2_total_size, difference/dom2_total_size);
	return difference / Math.max(html1.length, html2.length);
}

function compare2(dom1,dom2,level) {
	var diff = require("diff");
	var result= diff.diffJson(dom1,dom2);
	console.log(util.inspect(result));
	return JSON.stringify(result).length;
}

function compare(dom1,dom2,level) {
	if (!level) level = 0;
	var difference = 0;
	// console.log(level, "Check if lenghts are equal", dom1.length==dom2.length);
	if (dom1.length!=dom2.length) {
		// console.log("Found difference at level", level, dom1.length, dom2.length);
		// util.puts(util.inspect(dom1, false, null))
		// console.log("\r\n--------\r\n");
		// util.puts(util.inspect(dom2, false, null))		
		// return;
	}
	for (var i=0;i<Math.min(dom1.length,dom2.length);i++) {
		if (dom1[i].type!=dom2[i].type)	{
			// console.log(level, "Types differ", i);
			difference+= Math.max(dom1[i].raw.length, dom2[i].raw.length);
		}		
		if (dom1[i].raw!=dom2[i].raw) {
			// console.log(level, "Raw data differ", i);
			// console.log(dom1[i].raw,"<>",dom2[i].raw);
			//difference+= Math.abs(dom1[i].raw.length - dom2[i].raw.length);
		}
		if (dom1[i].children && dom2[i].children) {
			// console.log(level, "Checking children", i);
			difference+= compare(dom1[i].children, dom2[i].children, level+1);
		} else if (dom1[i].children) {
			// console.log(level, "Difference in children on dom1", i);
			difference += raw_length(dom1[i].children);

		} else if (dom2[i].children) {
			// console.log(level, "Difference in children on dom2", i);
			difference += raw_length(dom2[i].children);
		}
	}

	return difference;
}

function raw_length(dom)
{
	var length = 0;
	if (!dom.length) {
		length+= dom.raw.length;
		if (dom.children) {
			dom = dom.children;
		} else {
			return length;
		}
	}
	for (var i=0;i<dom.length;i++) {
		length += dom[i].raw.length;
		if (dom[i].children)
			length += raw_length(dom[i].children);
	}

	return length;
}