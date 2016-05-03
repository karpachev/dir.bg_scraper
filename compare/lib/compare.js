var Stats = require("./stats.js");
var util = require("util");
module.exports = compare;

function compare(dom1, dom2, level) {
	level = level?level:0;
	var result = new Stats;

	// check if dom1 or dom2 are undefined or empty arrays
	if (incomplete(dom1,dom2,result)) {
		return result;
	}

	// loop through them and try to find matches
	var ind = { _1 : 0, _2 : 0 };
	var params = {
		ind : ind,
		result : result,
		level : level
	};
	while (ind._1<dom1.length && ind._2<dom2.length) {
		if (equal(dom1,dom2,params)) {
			continue;
		}
		var num_children = Math.max(count_children(dom1[ind._1]),count_children(dom2[ind._2]));
		result.inc_no_match( num_children );
		ind._1++;ind._2++;
		continue;

		// they do not match strongly or weekly - try to find match
		// try first with _2
		var found_match = false;
		var save__2 = ind._2;
		for(ind._2++;ind._2<dom2.length;ind._2++) {
			if (equal(dom1,dom2,ind,result)) {
				found_match = true;
				break;
			}			
		}
		if (found_match) {
			continue;
		}

		// try with _1
		ind._2 = save__2;
		found_match = false;
		var save__1 = ind._1;
		for(ind._1++;ind._1<dom1.length;ind._1++) {
			if (equal(dom1,dom2,ind,result)) {
				found_match = true;
				break;
			}		
		}
		if (found_match) {
			continue;
		}

		// no match
		ind._1 = save__1+1;
		ind._2++;
		result.inc_no_match();
	}

	return result;
}

function count_children(dom) {
	if (dom==undefined || dom.length || dom.length==0) {
		return 0;
	}

	var count = 0;
	if (dom.children) {
		dom.children.forEach(function(el){
			count+= 1 + count_children(el);
		});
	}
	return count;
}

function equal(dom1,dom2,params) {
	var ind = params.ind,
		result = params.result;
	var tabs="";
	for (var i=0;i<params.level;i++) tabs+= "  ";

	if (strongly_equal(dom1[ind._1], dom2[ind._2])) {
		log(tabs,"SM", ind._1,ind._2,dom1[ind._1].name,dom2[ind._2].name);
		result.inc_strongly_equal();
		
		var temp_result = compare(dom1[ind._1].children,dom2[ind._2].children,params.level+1);
		result.add(temp_result);
		ind._1++; ind._2++;		
		return true;
	}
	if (weekly_equal(dom1[ind._1], dom2[ind._2])) {
		log(tabs,"WM", ind._1,ind._2,dom1[ind._1].name,dom2[ind._2].name);
		result.inc_weekly_equal();
		var temp_result = compare(dom1[ind._1].children,dom2[ind._2].children,params.level+1);
		result.add(temp_result);
		ind._1++; ind._2++;		
		return true;
	}
	log(tabs,"NO", ind._1,ind._2,dom1[ind._1].name,dom2[ind._2].name);
	return false;
}

function strongly_equal(el1, el2) {
	return weekly_equal(el1,el2) && el1.data===el2.data;
}

function weekly_equal(el1, el2) {
	return el1.type===el2.type && 
		(el1.name?el1.name.toUpperCase():el1.name) == (el2.name?el2.name.toUpperCase():el2.name);
}






function incomplete(dom1,dom2,result) {
	dom1 = dom1&&dom1.length&&dom1.length==0?undefined:dom1;
	dom2 = dom2&&dom2.length&&dom2.length==0?undefined:dom2;
	if (dom1===undefined && dom2===undefined) {
		return true;
	}
	if (dom1===undefined && dom2!==undefined) {
		result.inc_no_match(dom2.length?dom2.length:1);
		return true;
	}
	if (dom1!==undefined && dom2===undefined) {
		result.inc_no_match(dom1.length?dom1.length:1);
		return true;
	}

	return false;
}

function log() {
	if (true)
		console.log.apply(null,Array.from(arguments));
}