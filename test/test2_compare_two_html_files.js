var htmlparser = require("htmlparser");
var util = require("util");
var fs = require("fs");
var rawHtml = "Xyz <script language= javascript>var foo = '<<bar>>';< /  script><!--<!-- Waah! -- -->";
	rawHtml = fs.readFileSync("test/1.html");
var handler = new htmlparser.DefaultHandler(function (error, dom) {
	if (error)
		console.error("Could not parse")
	else {
		//console.log("Succesfully parsed")
	}
});
var parser = new htmlparser.Parser(handler);
parser.parseComplete(rawHtml);
var dom1 = handler.dom;
// util.puts(util.inspect(dom1, false, null));


rawHtml = fs.readFileSync("test/2.html");
parser.parseComplete(rawHtml);
var dom2 = handler.dom;
// util.puts(util.inspect(dom2, false, null));

compare(dom1,dom2);

function compare(dom1,dom2,level) {
	if (!level) level = 0;
	// console.log(level, "Check if lenghts are equal", dom1.length==dom2.length);
	if (dom1.length!=dom2.length) {
		console.log("Found difference at level", level);
		// util.puts(util.inspect(dom1, false, null))
		// console.log("\r\n--------\r\n");
		// util.puts(util.inspect(dom2, false, null))		
		return;
	}
	for (var i=0;i<Math.min(dom1.length,dom2.length);i++) {
		if (dom1[i].type!=dom2[i].type)	{
			console.log(level, "Types differ", i);

		}		
		if (dom1[i].raw!=dom2[i].raw) {
			console.log(level, "Raw data differ", i);
			console.log(dom1[i].raw,dom2[i].raw);
		}
		if (dom1[i].children && dom2[i].children) {
			//console.log(level, "Checking children", i);
			compare(dom1[i].children, dom2[i].children, level+1)
		} else if (dom1[i].children) {
			console.log(level, "Difference in children on dom1", i);
		} else if (dom2[i].children) {
			console.log(level, "Difference in children on dom2", i);
		} else {

		}
	}

}