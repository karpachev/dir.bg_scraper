var async = require("async");
var gcloud = require("gcloud")({
  projectId: 'dir-bg-scraper'
  });
var datastore = gcloud.datastore();
var storage   = gcloud.storage();




module.exports = async.queue(
	store_page,
	500
);

function store_page(task,callback)
{
	console.error("Storing page", task);
	callback();
}

var savePage = function (url,body) {
	var pageKey = datastore.key(['Page',url]);
	datastore.get(pageKey, function(err, entity) {
	  console.log(err);
	  console.log(entity);
	  if (err) {
	  	console.log(err);
	  } else {
	  	if (entity==undefined) {
	  		datastore.save({
	  			key : pageKey,
	  			data : [
	  				{
	  					name : "retrieved",
	  					value: new Date
	  				},
	  				{
	  					name : "body",
	  					value : body,
	  					excludeFromIndexes: true
	  				}
	  			]	
	  		},function(err){
	  			console.log("Successfully saved", err);
	  		});
	  	}
	  }
	});	
}