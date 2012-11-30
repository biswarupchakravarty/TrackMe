if (!Gossamer) window.Gossamer = {}
if (!Gossamer.models) Gossamer.models = {}

Gossamer.models.User = function(id, onLoaded) {

	var userId = id
	
	onLoaded = onLoaded || function() {}
	
	var base = {}
	
	var cache = {}
	
	var translate = function(article) {
		if (article.__attributes) {
			for (var attr in article.__attributes) {
				this[attr] = article.__attributes.attr
			}
		}
	}
	
	var load = function() {
		var that = this
		Genesis.storage.articles.get(deploymentId, 'Userschema', userId, function() {
			translate.apply(base, [arguments[0]])
		
			queryUserGraph()
		}, function() {
			
		});
	}
	
	loadAll = function() {
		// TODO: maybe implement this
	}
	
	var parseGraphQuery = function(projection) {
		var user = projection.Patients[0]
		base = user;

		if (false) {
			for (var x=0;x < user.projections.length;x=x+1) {
				var p = user.projections[x]
				base[p.name] = []
				if (!p.nodes || p.nodes.length == 0) continue;
				p.nodes.forEach(function(node) {
					var newNode = {}
					translate.apply(newNode, [node.article])
					base[p.name].push(newNode)
				})
			}
		}
		
		// transform 
		if (false && window.navigator.userAgent.toLowerCase().indexOf('ipad') != -1) {
			var spl = base.DOB.toString().split('-');
			base.DOB = new Date(spl[0], spl[1]-1, spl[2])
		}
		
		base.Event = user.__projections[0].Event;
		base.Event.forEach(function(event) {
			event.Event_Date = event.event_date;
			event.Event_Type = event.event_type;
			event.Event_Report = event.event_report;
			if (window.navigator.userAgent.toLowerCase().indexOf('ipad') != -1) {
				var spl = event.Event_Date.toString().split('-');
				event.Event_Date = new Date(spl[0], spl[1]-1, spl[2])
			} else {
				event.Event_Date = new Date(event.event_date)
				event.event_date = new Date(event.event_date)
			}
		});
		
		
// 		base.emailHash = CryptoJS.MD5(base.Email_Id);
		base.age = new Date().getYear() - new Date(base.dob).getYear()
		base.gender = base.gender.toLowerCase()
		
		base.Photograph = base.photograph;
		if (base.Photograph)
			base.Photograph += '?session=' + Gossamer.authentication.getSessionId()
		
		// TODO: remove when images start working
		delete base.Photograph
		delete base.photograph

		base.Statistics = base.__projections[1].Statistics;
		// sort the Statistics
		base.Statistics.sort(function(a, b) {
			var d1 = new Date(a.Date || new Date())
			var d2 = new Date(b.Date || new Date())
			var result = d1 - d2
			
			return result
		})
		
		// sort the timeline
		base.timeline = base.Event.sort(function(a,b) {
			var d1 = new Date(a.Event_Date).getTime()
			var d2 = new Date(b.Event_Date).getTime()
			
			var result = (d2 - d1)
			return result
		})
		
		// transform the alerts
		if (false && base.Alerts && base.Alerts.length > 0) {
			var index = 0
			var alerts = base.Alerts.split('|').filter(function(alert) {
				return alert.trim().length > 0
			})
			base.alerts = alerts.map(function(alert) {
				var tokens = alert.split('_')
				return {
					statType: tokens[0],
					value: tokens[1],
					time: tokens[2],
					index: index++
				}
			})
		}
		console.dir(base)
		onLoaded.apply(base, [base])
	}
	
	var queryUserGraph = function() {
		var query = {
			"children": [],
			"input": [userId],
			"name": "Patients",
			"type": "Userschema",
			"properties": null
		};
		
		['Event','Statistics','Family_History','EventStatistics','EventFile'].forEach(function(relation) {
			query.children.push({
				"edge": relation,
				"name": relation
			})
		})
		
		Genesis.storage.articles.queryGraph(deploymentId, query, function(projection) {
			console.dir(projection)
			parseGraphQuery(projection)
		}, function() {
			alert('graph query bugged out.')
		})
	}
	
	// load the user if id is provided
	if (id)	{
		// queryUserGraph();
		load();
	}
	
	return base;
}
