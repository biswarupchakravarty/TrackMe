if (!Gossamer) window.Gossamer = {}
if (!Gossamer.models) Gossamer.models = {}

Gossamer.models.User = function(id, onLoaded) {

	var userId = id
	
	onLoaded = onLoaded || function() {}
	
	var base = {}
	
	var translate = function(article) {
		if (!article.__Properties || article.__Properties.length == 0) return
		for (var x=0;x < article.__Properties.length;x=x+1) {
			this[article.__Properties[x].Key] = article.__Properties[x].Value
		}
		if (article.__Attributes && article.__Attributes.length && article.__Attributes.length > 0) {
			for (var x=0;x < article.__Attributes.length;x=x+1) {
				this[article.__Attributes[x].Key] = article.__Attributes[x].Value
			}
		}
	}
	
	var load = function() {		
		var that = this
		Gossamer.storage.articles.get(deploymentId, 'User', userId, function() {
			translate.apply(base, [arguments[0]])
		
			queryUserGraph()
		}, function() {
			
		});
	}
	
	loadAll = function() {
		// TODO: maybe implement this
	}
	
	var parseGraphQuery = function(projection) {
		var user = projection.Nodes[0]
		for (var x=0;x < user.Projections.length;x=x+1) {
			var p = user.Projections[x]
			base[p.Name] = []
			if (!p.Nodes || p.Nodes.length == 0) continue;
			p.Nodes.forEach(function(node) {
				var newNode = {}
				translate.apply(newNode, [node.Article])
				base[p.Name].push(newNode)
			})
		}
		
		// transform 
		if (window.navigator.userAgent.toLowerCase().indexOf('ipad') != -1) {
			var spl = base.DOB.toString().split('-');
			base.DOB = new Date(spl[0], spl[1]-1, spl[2])
		}
		
		
		base.Event.forEach(function(event) {
			if (window.navigator.userAgent.toLowerCase().indexOf('ipad') != -1) {
				var spl = event.Event_Date.toString().split('-');
				event.Event_Date = new Date(spl[0], spl[1]-1, spl[2])
			} else {
				event.Event_Date = new Date(event.Event_Date)
			}
		})
		
		
// 		base.emailHash = CryptoJS.MD5(base.Email_Id);
		base.Age = new Date().getYear() - new Date(base.DOB).getYear()
		base.Gender = base.Gender.toLowerCase()
		
		if (base.Photograph)
			base.Photograph += '?session=' + Gossamer.authentication.getSessionId()
		
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
		console.dir(base)
		onLoaded.apply(base, [base])
	}
	
	var queryUserGraph = function() {
		var query = {
			"Children": [],
			"Input": [userId],
			"Name": "Patients",
			"Type": "User"
		};
		
		['Event','Statistics','Family_History','EventStatistics','EventFile'].forEach(function(relation) {
			query.Children.push({
				"Edge": relation,
				"Name": relation
			})
		})
		
		Gossamer.storage.articles.queryGraph(deploymentId, query, function(projection) {
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
