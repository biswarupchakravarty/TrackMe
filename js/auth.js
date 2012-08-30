if (!Gossamer) window.Gossamer = {};

Gossamer.authentication = new (function() {

	var sessionId = null;

	this.getSessionId = function() {
		return sessionId || null;
	}
	
	this.clearSessionId = function() {
		$.removeCookie('sessionkey')
	}

	var apikey;
	this.getApiKey = function() {
		return apikey;
	}

	this.getSession = function(apikey) {
		
		this.apikey = apikey
		
		if ($.cookie('sessionkey')) {
			sessionId = $.cookie('sessionkey')
			return
		}
		
		apikey = apikey || 'kHfGM9t2OdT1i7EEuQsLqO0Po16KMowftXqCnYlLY54=';
		var request = {
			ApiKey: apikey,
			IsNonSliding: false,
			UsageCount: -1,
			WindowTime: 240
		};
		var url = Gossamer.storage.urlFactory.session.getCreateSessionUrl();
		Gossamer.utils.ajax.put(url, request, false, function(data) {
			if (data.Session && data.Session.SessionKey) {
				sessionId = data.Session.SessionKey;
				$.cookie('sessionkey',sessionId)
			}
		}, function() {
			throw new Error("Couldn't get session key from server.");
		});
	}

})();

var apiKey = 'KzmgKrafja9/HjtlMKbd3jkIQZADmTDLf0tlrlenvoU='
Gossamer.authentication.getSession(apiKey)
window.deploymentId = '2047637487485349'
