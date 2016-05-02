var async = require("async");
var md5 = require("md5");
var gcloud = require("gcloud")({
  projectId: 'dir-bg-scraper'
  });
var datastore = gcloud.datastore();
var gcs   = gcloud.storage();

var bucket =gcs.bucket('dnes_dir_bg');
// console.log(bucket);


module.exports = async.queue(
	pre_store_page,
	10
);
function pre_store_page(task,callback) {
	console.log("In datastore.js::pre_store_page");
	var pageKey = datastore.key(['Page',md5(task.ref_URL)]);
	var query = datastore.createQuery('Page')
					.select('__key__')
					.filter('__key__', pageKey)
					;
	datastore.runQuery(query,function(err,results){
		if (!results || results.length!=1) {
			// record is not already in the Datastore - save it
			console.log("Trying to save in Datastore", task.ref_URL);
			console.log(err,results);
			task.datastore_retries= 0;
			insert_into_Datastore(task,callback);
		} else {
			console.log("Already in Datastore", task.ref_URL);
			callback();
		}
	});
}

function store_page(task,callback)
{
	//{body:body, ref_URL:ref_URL, body_hash: body_hash}
	//console.error("Storing page", task.ref_URL, task.body_hash);
	var file = bucket.file(task.body_hash);
  	var stream = file.createWriteStream({gzip:true});

	stream.on('error', function (err) {
		if (task.storage_retries===undefined) task.storage_retries = 0;
		task.storage_retries++;
		if (task.storage_retries>3) {
			console.error("ERR: Failed to upload file",task.ref_URL, task.body_hash);
			callback();
		} else {
			store_page(task,callback);
		}
	});

	stream.on('finish', function () {
		console.log("Succesfully uploaded file", task.ref_URL, task.body_hash);
		insert_into_Datastore(task,callback);
	});

	stream.end(task.body);	
}

var insert_into_Datastore = function (task,callback) {
	//{body:body, ref_URL:ref_URL, body_hash: body_hash}
	var pageKey = datastore.key(['Page',md5(task.ref_URL)]);
	datastore.save({
		key : pageKey,
		data : [
			{
				name : "retrieved",
				value: new Date
			},
			{
				name : "body",
				value : task.body,
				excludeFromIndexes: true
			},
			{
				name : "body_hash",
				value : task.body_hash,
				excludeFromIndexes: true
			},
			{
				name : "url",
				value: task.ref_URL
			}
		]	
	},function(err){
		if (err) {
			if (task.datastore_retries>3) {
				console.error("ERR: failed to save into the Datastore", err);
				callback();
			} else {
				task.datastore_retries++;
				setTimeout(
						insert_into_Datastore.bind(null,task,callback),
						300
					);
				return;
			}
		} else {
			console.log("Successfully saved into Datastore:",task.ref_URL);
			callback();
		}
	});
}
