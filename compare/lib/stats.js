module.exports = function Stats() {
	this.total = 0;
	this.strongly_equal = 0;
	this.weekly_equal = 0;
	this.no_match = 0;

	this.add = function(other) {
		this.total += other.total;
		this.strongly_equal += other.strongly_equal;
		this.weekly_equal += other.weekly_equal;
		this.no_match += other.no_match;
	};
	this.inc_strongly_equal = function() {
		this.strongly_equal++;
		this.total++;
	};
	this.inc_weekly_equal = function() {
		this.weekly_equal++;
		this.total++;
	};
	this.inc_no_match = function(inc) {
		inc = inc===undefined?1:inc;
		this.no_match += inc;
		this.total+= inc;
	}
	this.toString = function() {
		var util = require("util");
		return util.format("%d/%d/%d/%d %d", 
					this.total,
					this.strongly_equal,
					this.weekly_equal,
					this.no_match,
					this.no_match/this.total);
	}
}