/**
Depends on	jQuery
**/

(function ($) {
    if (!window.Gossamer) {
        window.Gossamer = {};
    }
    if (!Gossamer.utils) {
        window.Gossamer.utils = {};
    }

    window.Gossamer.utils.ajax = new (function () {
		var appendSessionId = function(url) {
			if (!url) return '';
			var sessionId = Gossamer.authentication.getSessionId();
			if (url.indexOf('?') == -1) {
				return url + '?session=' + sessionId;
			} else {
				return url + '&session=' + sessionId;
			}
		}

        var _beforeSend = function(xhr) {
            xhr.setRequestHeader('appacitive-session', Gossamer.authentication.getSessionId());
            xhr.setRequestHeader('appacitive-environment', 'live');
        }

        this.getImage = function (url, onSuccess) {
            $.ajax({
                url: url,
                type: 'GET',
                async: true,
                beforeSend: _beforeSend,
                success: function (data) {
                    (onSuccess || function(){})(data);
                },
                error: function () {
                    
                }
            });
        };

        this.get = function (url, async, onSuccess, onError) {
            onError = onError || function () { };
            $.ajax({
                url: url,
                type: 'GET',
                async: async,
                beforeSend: _beforeSend,
                success: function (data) {
                    if (window.Gossamer.utils.ajax.checkStatus(data)) {
                        (onSuccess || function(){})(data);
                    }
                },
                error: function () {
                    // EventManager.fire('logoutClicked', this);
                    EventManager.fire("error.show", window, { message: "Cannot connect to server." });
                    onError();
                }
            });
        };

        this.post = function (url, data, async, onSuccess, onError) {
            onError = onError || function () { };
            $.ajax({
                url: url,
                type: 'POST',
                async: async,
                beforeSend: _beforeSend,
                contentType: "application/json",
                data: JSON.stringify(data),
                success: function (data) {
                    if (window.Gossamer.utils.ajax.checkStatus(data)) {
                        onSuccess(data) || function () { }
                    }
                },
                error: function () {
                    // EventManager.fire('logoutClicked', this);
                    EventManager.fire("error.show", window, { message: "Cannot connect to server." });
                    onError();
                }
            });
        };

        this.put = function (url, data, async, onSuccess, onError, ignoreStatus) {
            $.ajax({
                url: url,
                type: 'PUT',
                async: async,
                data: JSON.stringify(data),
                beforeSend: _beforeSend,
                contentType: "application/json",
                success: function (data) {
                    if (ignoreStatus) {
                        data.ignoreStatus = true;
                    }
                    if (window.Gossamer.utils.ajax.checkStatus(data)) {
                        onSuccess(data) || function () { }
                    }
                },
                error: function () {
                    (onError || function(){})();
                }
            });
        };

        this.del = function (url, async, onSuccess, onError, ignoreStatus) {
            onError = onError || function () { };
            $.ajax({
                url: url,
                type: 'DELETE',
                async: async,
                beforeSend: _beforeSend,
                success: function (data) {
                    if (ignoreStatus) {
                        data.ignoreStatus = true;
                    }
                    if (window.Gossamer.utils.ajax.checkStatus(data)) {
                        onSuccess(data) || function () { }
                    }
                },
                error: function () {
                    // EventManager.fire('logoutClicked', this);
                    EventManager.fire("error.show", window, { message: "Cannot connect to server." });
                    onError();
                }
            });
        };

        this.checkStatus = function (data) {
			return true;
            if (typeof (data) != undefined) {
                if (data.ignoreStatus) {
                    return true;
                }
                if (data.Code != undefined) {
                    if (data.Code == '8027' || data.Code == '8002' || window.sessionDown) {
                        Gossamer.authentication.removeCookie()
                        Gossamer.authentication.getSession(Gossamer.authentication.getApiKey())
                        return false;
                    }
                }
                else if (data.Status != undefined) {
                    if (data.Status.Code == '8027' || data.Status.Code == '8002' || window.sessionDown) {
                        new Gossamer.views.sessionExpiredView().render(data, function () {
                            EventManager.fire('logoutClicked', this);
                        });
                        return false;
                    }
                }
            }
            return true;
        };
    })();
})(jQuery)
