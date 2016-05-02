var util = require("util");

module.exports = {
	pages_crawled : 0,
	total_bytes_crawled : 0,

	print_stats : function () {
		console.log(util.format("Pages crawled: %d, Total MB processed: %d, Average bytes per page: %d",
				this.pages_crawled,
				this.total_bytes_crawled/1024/1024,
				this.total_bytes_crawled/this.pages_crawled
			));
	},
	new_page : function(body) {
		this.pages_crawled ++;
		this.total_bytes_crawled += body.length;

		if (this.pages_crawled%100==0) {
			this.print_stats();
		}
	}
};