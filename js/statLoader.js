var StatGenerator = function(userId, opt) {
	
	var options = opt || {
		statType: 'Heart_Rate',
		minValue: 80,
		maxValue: 120,
		interval: '0'
	}
	
	options.userId = userId
	
	if (!this instanceof StatGenerator) return new StatGenerator();
	
	var uId = userId;
	
	var load = function() {
		var article = {
			"__CreatedBy": "Strento",
			"__Properties": [
				{
					"Key": "Type",
					"Value": options.statType
				},
				{
					"Key": "Value",
					"Value": parseInt(Math.random() * (options.maxValue - options.minValue)) + options.minValue
				},
				{
					"Key": "Date",
					"Value": new Date().format('yyyy-mm-dd')
				}
			],
			"__SchemaType": "Statistics"
		}
		
		Gossamer.storage.articles.create(deploymentId, 'Statistics', article, function(article) {
			var connection = {
				"__ArticleAId": options.userId,
				"__ArticleBId": article.__Id,
				"__CreatedBy": "Strento",
				"__LabelA": "User",
				"__LabelB": "Statistics",
				"__RelationName": "Statistics",
			}
			console.dir(article)
			Gossamer.storage.connections.create(deploymentId, 'Statistics', connection, function(connection) {
				console.dir(connection)
			}, function() {
				
			})
		})
	}
	
	var handle = 0;
	
	this.start = function() {
		handle = setInterval(load, options.interval)
	}
	this.stop = function() {
		clearInterval(handle)
	}
}
