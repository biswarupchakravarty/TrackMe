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
		
		if ($.cookie('sessionkey') && false) {
			sessionId = $.cookie('sessionkey')
			return
		}
		
		apikey = apikey || 'KzmgKrafja9/HjtlMKbd3jkIQZADmTDLf0tlrlenvoU=';
		var request = {
			apikey: apikey,
			isnonsliding: false,
			usagecount: -1,
			windowtime: 240
		};
		var url = Genesis.storage.urlFactory.application.getCreateSessionUrl();
		Gossamer.utils.ajax.put(url, request, false, function(data) {
			if (data.session && data.session.sessionkey) {
				sessionId = data.session.sessionkey;
				console.log('got session from server')
				$.cookie('sessionkey',sessionId)
			}
		}, function() {
			throw new Error("Couldn't get session key from server.");
		});
	}

})();

var apiKey = 'KzmgKrafja9/HjtlMKbd3jkIQZADmTDLf0tlrlenvoU='
Gossamer.authentication.getSession(apiKey)
window.deploymentId = 'health'
