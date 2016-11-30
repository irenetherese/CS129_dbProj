

var map = function(){
	var documentDate = this.date.split('-');
	var year = documentDate[0];
	var month = documentDate[1];
	var date = year + '-' + month;
	emit({month: date}, {adj_close: [this.adj_close]});
}

var reduce = function(key, values) {
	return {adj_close: values.reduce(function(x, y){return x.concat(y.adj_close);}, [])};
}
var finalize = function(key, value){
	var total = value.adj_close.reduce(function(x,y){return x + y;}, 0);
	var average = (total / value.adj_close.length);
	var standard_deviation = 0;
	for (var i = 0; i < value.adj_close.length; i++){
		standard_deviation += Math.pow((value.adj_close[i] - average), 2); 
	}
	standard_deviation = Math.sqrt(standard_deviation / value.adj_close.length);

	return {adj_close: total, count: value.adj_close.length, average: average, sd: standard_deviation};
}

resultsfb = 
	db.runCommand({
		mapReduce: 'fb',
		map: map,
		reduce: reduce,
		finalize: finalize,
		out: 'fb.report'	
    });


resultsgoog = 
	db.runCommand({
		mapReduce: 'goog',
		map: map,
		reduce: reduce,
		finalize: finalize,
		out:'goog.report'	
    });


resultsaapl = 
	db.runCommand({
		mapReduce: 'aapl',
		map: map,
		reduce: reduce,
		finalize: finalize,
		out: 'aapl.report'	
    });

