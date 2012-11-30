var goto2 = function() {
	$('#divSection1').slideUp()
	$('div.page-header-search-fixed').slideDown()
	$('#divSection2').slideDown('slow')
	$('div.header-tab-dashboard').css('background','url("img/tab_dashboard.png") no-repeat')
}

var goto1 = function() {
	$('#divSection2').hide()
	$('#divSection1').slideDown()
	$('div.page-header-search-fixed').slideUp()
}

var refreshUser = function() {
	if (window.userId) {
		new Gossamer.models.User(window.userId, function() {
			displayUser.apply(this, [])
			if (window.activeTab) {
				setTimeout(function() {
					$('a.goto-' + window.activeTab).click()
				}, 0)
			}
		})
	}
}

var displayUser = function(id) {
	
	// create the timeline
	generateTimeline(this.timeline)
	
	// render!
	$('#divSection2').html(Mustache.render($('#divSection2Template').html(), this))
	
	$('div.timeline-item-heading').hover(function() {
		$('i.icon-remove-circle', $(this)).toggle()
	})
	
	$('a.event-delete').click(function() {
		
	})
	
	$('div.user-loading-image').css('display','none');
	
	goto2()
	
	window.activeTab = 'Dashboard'
	
	setTimeout(showTimeline, 500)
	
	window.tabTimeline = function(){
		$('#btnDashboard')
			.removeClass('book-dashboard-button-active')
			.addClass('book-dashboard-button-inactive')
			
		$('#btnDetails')
			.removeClass('book-details-button-active')
			.addClass('book-details-button-inactive')
			
		$(this)
			.removeClass('book-timeline-button-inactive')
			.addClass('book-timeline-button-active')
		
		
		$('#divDetails').hide()
		$('#divDashboard').hide()
		$('#divTimeline').show()
		
		$('#lblTimeline').show()
		$('#lblDashboard').hide()
		$('#lblDetails').hide()
		
		setTimeout(function() {
			$('#timelineContainer').masonry({
				itemSelector: '.timeline-item',
				isAnimated: true
			});
			setTimeout(Arrows, 1000);
		}, 500)
		
		window.activeTab = 'Timeline'
		
	}
	$('#btnTimeline').click(tabTimeline)
	
	window.tabDetails = function() {
		$('#btnDashboard')
			.removeClass('book-dashboard-button-active')
			.addClass('book-dashboard-button-inactive')
			
		$('#btnTimeline')
			.removeClass('book-timeline-button-active')
			.addClass('book-timeline-button-inactive')
			
		$(this)
			.removeClass('book-details-button-inactive')
			.addClass('book-details-button-active')
		
		$('#divTimeline').hide()
		$('#divDashboard').hide()
		$('#divDetails').show()
		
		$('#lblDetails').show()
		$('#lblTimeline').hide()
		$('#lblDashboard').hide()
		
		window.activeTab = 'Details'
	}
	$('#btnDetails').click(tabDetails)
	
	window.tabDashboard = function() {
		$('#btnTimeline')
			.removeClass('book-timeline-button-active')
			.addClass('book-timeline-button-inactive')
			
		$('#btnDetails')
			.removeClass('book-details-button-active')
			.addClass('book-details-button-inactive')
			
		$(this)
			.removeClass('book-dashboard-button-inactive')
			.addClass('book-dashboard-button-active')
		
		$('#divDetails').hide()
		$('#divTimeline').hide()
		$('#divDashboard').show()
		
		$('#lblDetails').hide()
		$('#lblTimeline').hide()
		$('#lblDashboard').show()
		
		window.activeTab = 'Dashboard'
	}
	$('#btnDashboard').click(tabDashboard)
	
	$('a.goto-timeline').click(function() {
		$('#divDetails').hide()
		$('#divDashboard').hide()
		$('#divTimeline').show()
		
		$('div.header-tab-dashboard').css('background','url("img/tab_timeline.png") no-repeat')
		
		setTimeout(function() {
			$('#timelineContainer').masonry({
				itemSelector: '.timeline-item',
				isAnimated: true
			});
			setTimeout(Arrows, 1000);
		}, 500)
		
		window.activeTab = 'timeline'
	})
	
	$('a.goto-dashboard').click(function() {
		$('#divDetails').hide()
		$('#divDashboard').show()
		$('#divTimeline').hide()
		
		$('div.header-tab-dashboard').css('background','url("img/tab_dashboard.png") no-repeat')
		window.activeTab = 'dashboard'
	})
	
	$('a.goto-details').click(function() {
		$('#divDetails').show()
		$('#divDashboard').hide()
		$('#divTimeline').hide()
		
		$('div.header-tab-dashboard').css('background','url("img/tab_details.png") no-repeat')
		window.activeTab = 'details'
	})
	
	$('a.deleteTimelineItem').live('click', function() {
		var that = $(this)
		that.parent().parent().parent().fadeOut('slow', function() {
			that.remove()
			$('#timelineContainer').masonry({
				itemSelector: '.timeline-item',
				isAnimated: true
			});
		})
	})
	
	var d = new Date()
	$('#txtStatsDate').val(d.getUTCFullYear() + '-' + (d.getMonth() > 9 ? d.getMonth() : '0' + d.getMonth()) + '-' + (d.getDate() > 9 ? d.getDate() : '0' + d.getDate())).datepicker({dateFormat: "yy-mm-dd"})
	$('#txtEventDate').val(d.getUTCFullYear() + '-' + (d.getMonth() > 9 ? d.getMonth() : '0' + d.getMonth()) + '-' + (d.getDate() > 9 ? d.getDate() : '0' + d.getDate())).datepicker({dateFormat: "yy-mm-dd"})
	var wtMax = -1, wtMin = 10000
	var bsMax = -1, bsMin = 10000
	var hbStart = new Date();
	
	var wtValues = [], wtDates = [], wtStart = new Date()
	var bsValues = [], bsDates = [], bsStart = new Date()
	var hbValues = [], hbDates = []
	
	this.Statistics.forEach(function(stat) {
		if (!stat || !stat.value || stat.value.toString().trim().length == 0) return
		if (!stat.type) return
		switch (stat.type.toLowerCase()) {
			case 'weight':
				if (stat.value > wtMax) wtMax = stat.value
				if (stat.value < wtMin) wtMin = stat.value
				wtValues.push(parseFloat(stat.value))
				wtDates.push(stat.date)
				if (stat.date < wtStart) wtStart = stat.date;
				break
			case 'blood_sugar':
				if (stat.value > bsMax) bsMax = stat.value
				if (stat.value < bsMin) bsMin = stat.value
				bsValues.push(parseFloat(stat.value))
				bsDates.push(stat.date)
				if (stat.date < bsStart) bsStart = stat.date;
				break
			case 'heart_rate':
				hbValues.push(parseFloat(stat.value));
				hbDates.push(new Date(stat.date));
				if (new Date(stat.date) < hbStart) hbStart = new Date(stat.date);
				break
			default:
				break
		}
	});
	
	if (wtValues.length > 0) {
		// if (wtValues.length > 6) wtValues = wtValues.slice(wtValues.length - 6, wtValues.length)
		var chart = new HighChart({
			container: 'divHeartRateGraph',
			data: {
				name: 'Weight',
				data: wtValues,
				pointInterval: 3600 * 1000 * 2400,
				pointStart: Date.UTC(wtStart.getFullYear(), wtStart.getMonth(), wtStart.getDate()),
			},
			categories: wtDates,
			yTitle: 'kilograms',
			graphTitle: 'Weight'
		})
	}
	
	if (bsValues.length > 0) {
		// if (bsValues.length > 6) bsValues = bsValues.slice(bsValues.length - 6, bsValues.length)
		var chart = new HighChart({
			container: 'divBloodSugarGraph',
			data: {
				name: 'Blood Sugar',
				data: bsValues,
				pointInterval: 3600 * 1000,
				pointStart: Date.UTC(bsStart.getFullYear(), bsStart.getMonth(), bsStart.getDate()),
			},
			categories: bsDates,
			yTitle: 'mg per dl',
			graphTitle: 'Blood Sugar'
		})
	}
	
	if (hbValues.length > 0) {
		var chart = new HighChart({
			container: 'divHeartBeatGraph',
			data: {
				name: 'Heart Beat',
				type: 'area',
				data: hbValues,
				pointInterval: 3600 * 1000,
                pointStart: Date.UTC(hbStart.getFullYear(), hbStart.getMonth(), hbStart.getDate())
			},
			yTitle: 'beats per minute',
			graphTitle: 'Heart Rate',
			fillColor: {
				linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1},
				stops: [
					[0, Highcharts.getOptions().colors[0]],
					[1, 'rgba(2,0,0,0)']
				]
			}
		})
	}
	
	$('#btnStatsSave').click(function() {
		var btn = $(this)
		
		btn.button('loading')

		var article = {
			"type": $('#slctStatsType > option:selected').val(),
			"value": $('#txtStatsValue').val(),
			"date": $('#txtStatsDate').val(),
			"time": $('#txtStatsTime').val(),
			"notes": $('#txtStatsNotes').val(),
			"__schematype": "Statistics",
			"__createdby": "appacitive",
			"__attributes": [
				{
					"key": "userId",
					"value": window.userId
				},
				{
					"key": "sessionkey",
					"value": Gossamer.authentication.getSessionId()
				}
			]
		}
		
		Genesis.storage.articles.create(deploymentId, 'Statistics', article, function(article) {
			var connection = {
				"__endpointa": {
					"label":"user",
					"articleid":userId
				},
				"__endpointb": {
					"label":"statistics",
					"articleid":article.__id
				},
				"__createdby": "Strento",
				"__relationtype": "Statistics",
			}
			Genesis.storage.connections.create(deploymentId, 'Statistics', connection, function(connection) {
				btn.button('reset')
				$('#addStatModal').modal('hide')
				refreshUser()
			}, function() {
				btn.button('reset')
			})
		}, function() {
			btn.button('reset')
		})
	})
	
	$('#btnEventSave').click(function() {
		var btn = $(this)
		
		btn.button('loading')
		var article = {
			"event_type": $('#slctEventType > option:selected').val(),
			"event_date": $('#txtEventDate').val(),
			"event_time": $('#txtEventTime').val(),
			"note": $('#txtEventNotes').val(),
			"__schematype": "event",
			"__createdby": "appacitive",
		}
		
		Genesis.storage.articles.create(deploymentId, 'Event', article, function(article) {
			var connection = {
				"__endpointa": {
					"label":"user",
					"articleid":userId
				},
				"__endpointb": {
					"label":"event",
					"articleid":article.__id
				},
				"__createdby": "Strento",
				"__relationtype": "Event",
			}
			Genesis.storage.connections.create(deploymentId, 'Event', connection, function(connection) {
				btn.button('reset')
				$('#addEventModal').modal('hide')
				refreshUser()
			}, function() {
				btn.button('reset')
			})
		}, function() {
			btn.button('reset')
		})
	})
	
	clearInterval(window.preloaderHandle)
	$('div.loading-overlay').fadeOut()
	$('div#divProgressBar').slideUp();
	window.selectedFolder.css('z-index','1').css('transform','scale(1,1)')
	window.loading = false
	$('div.user-loader').hide()
}


$(function () {
	
	$('#txtDOB').datepicker({
		dateFormat: "yy-mm-dd",
		changeMonth: true,
		changeYear: true,
		yearRange: "1900:2012"
	})
	$('#txtEffFrom').datepicker({
		dateFormat: "yy-mm-dd",
		changeMonth: true,
		changeYear: true,
		yearRange: "1980:2012"
	})
	$('#txtTermDate').datepicker({
		dateFormat: "yy-mm-dd",
		changeMonth: true,
		changeYear: true,
		yearRange: "2012:2062"
	})
	
	$('button.alert-close').live('click',function() {
		var alertIndex = $(this).data().alertindex
		var alertUI = $(this).parent()
		Gossamer.storage.articles.get('healthfinal','userschema',window.userId,function(article) {
			if (!article.__Attributes || article.__Attributes.length == 0) return
			var attr = article.__Attributes.filter(function(attr) {
				return attr.Key.toLowerCase() == 'alerts'
			})
			if (!attr || attr.length == 0) return
			var alertTokens = attr[0].Value.split('|')
			var alerts = alertTokens.filter(function(alertToken) {
				return alertToken.trim().length > 0
			})
			alerts.splice(alertIndex, 1)
			var final = alerts.join('|')
			var updateCommand = {
				"UpdateCommands": [
					{
						"__type": "UpdateAttributesCommand:http://www.tavisca.com/gossamer/datacontracts/2011/11",
						"AttributesToAddOrUpdate": [
							{
								"Key": "Alerts",
								"Value": final
							}
						]
					}
				]
			}
			var logger = function() {console.dir(arguments)}
			
			Gossamer.storage.articles.update('healthfinal','userschema',window.userId,updateCommand,function() {
				alertUI.slideUp()
			},logger)
		})
	})
	
	$('#divUserBlocks > div.usrblk').live('mousedown', function() {
		
		if (window.loading) return;
		
		$('div.user-loader', $(this)).show()
		
		var id = $(this).data().userid
		
		if (id == 0) {
			$('#lnkShowAddUser').click();
			return;
		}
		
		window.userId = id
		
		$('div.bar').css('width','100%');
		$('div.loading-overlay').fadeIn();
	    // $('div#divProgressBar').slideDown();
		
		var currentScale = 1;
		window.preloaderHandle = 0;
		window.selectedFolder = $(this).css('z-index','1001')
		
		setInterval(function() {
			if (currentScale >= 1.1) return;
			currentScale += 0.01
			selectedFolder.css('transform','scale(' + currentScale + ',' + currentScale + ')')
		}, 10);
		
		window.loading = true
		var user = new Gossamer.models.User(id, displayUser)
		
		return false;
	})
	
	window.userIds = []
	
	// populate the user list
	Genesis.storage.articles.searchAll(deploymentId, 'Userschema', '', 1, function(articles) {
		
		// keep track for cleanup acivities
		articles.forEach(function(article) {
			window.userIds.push(article.__id)
		})
		
		// the actual refresh script
		var refreshAlerts = function(userId) {
			Genesis.storage.articles.get('health','userschema',userId,function(article) {
				var alertCount = 0
				for (var attr in article.__attributes) {
					if (attr == 'alerts') {
						var tokens = article.__attributes[attr].split('|')
						tokens.forEach(function(token) { 
							if (token.trim().length > 0) alertCount++
						})
					}
				}
				// TODO: enable once handlers start working
				if (alertCount != 0) {
					// $('#divAlerts' + userId).html(alertCount).show()
				} else {
					// $('#divAlerts' + userId).hide()
				}
			})
		}
		
		window.refreshHandles = []
		// the script to activate refresh script
		var attachRefreshScript = function(userId) {
			window.refreshHandles.push(setInterval(function() {
				refreshAlerts(userId)
			}, 10000))
		}
		
		
		var users = articles.map(function(article) {
			
			var userName = article.name
			
			// TODO: remove this when photos are possible again
			//delete article.photograph

			var user = {userName: userName, userId: article.__id}
			
			if (article.photograph) 
				user.photograph = article.photograph + '?session=' + Gossamer.authentication.getSessionId()
			
			for (var attr in article.__attributes) {
				if (attr == 'alerts') {
					var tokens = article.__attributes[attr].split('|')
					var alertCount = 0
					tokens.forEach(function(token) { 
						if (token.trim().length > 0) alertCount++
					})
					if (alertCount > 0) user.alertCount = alertCount
				}
			}
			
			// attach the refresh script
			attachRefreshScript(article.__id)
			
			return user
		})
		
		$('#divUserBlocks').append($(Mustache.render($('#divUserBlocksTemplate').html(), {users: users})))
		
		
	}, function() {
		// error handling here
	})
	
    $('#txtPName').keyup(function (e) {
        searchPatient.apply(this, arguments)
    });
    
	var blured=function(){
		var flag=true
		var errMsg=$('#lblErrMsg')
	    var uname=$(this).val().trim()
		
	    if(!uname || uname.length == 0)
		{
			 flag=false
			 errMsg.show()
			 $(this).addClass("border-color-red")
		}
		else{
		errMsg.hide()
		$(this).removeClass("border-color-red")
		}
	}
	
	//var blured=new blur()
	$('#txtUserName').blur(blured)
	$('#txtDOB').blur(blured)
	$('#txtMobileNumber').blur(blured)
	$('#txtEmail').blur(blured)
    $('button#btnUserSave').click(function() {
		var btn = $(this)
		
		
		var kv = function(a, b) {
			return {"Key":a,"Value":b} 
		}
		btn.button('loading')
			
			
		var article = {
			"__createdby": "appacitive",
			"__schematype": "Userschema"
		}
		
		// load the billion properties
		var p = []
		article["name"] = $('#txtUserName').val();
		article["gender"] = $('[name=Gender]:checked').val();
		article["dob"] = $('#txtDOB').val();
		article["occupation"] = $('#txtOcc').val();
		article["blood_group"] = $('#slctBloodGroup > option:selected').val();
		
		article["address"] = $('#txtAddress').val();
		article["city"] = $('#txtCity').val();
		article["telephone_number"] = $('#txtTelephoneNumber').val();
		article["mobile_number"] = $('#txtMobileNumber').val();
		article["email_id"] = $('#txtEmail').val();
		
		article["insurer"] = $('#txtInsurer').val();
		article["insurance_id"] = $('#txtInsuranceId').val();
		article["insurance_type"] = $('#slctInsuranceType > option:selected').val();
		article["eff_date"] = $('#txtEffFrom').val();
		article["term_date"] = $('#txtTermDate').val();
		
		console.dir(article)

		Genesis.storage.articles.create(deploymentId, 'Userschema', article, function(article) {
			$('#addUserModal').modal('hide')
			btn.button('reset')
		}, function() {
			btn.button('reset')
		})
	})

    window.location.hash = ''

	//$('#txtPName').focus();
    

	if (false) {
		if (window.navigator.userAgent.toLowerCase().indexOf('ipad') == -1) {
			$('div.container').waypoint(function(event, direction) {
				$('.page-header-search').toggleClass('stuck-top');
			})
		}
	}
	
    $('#timelineContainer').mousemove(function (e) {
        var topdiv = $("#containertop").height();
        var pag = e.pageY - 26;
        $('.plus').css({
            "top": pag + "px",
            "background": "url('images/plus.png')",
            "margin-left": "1px"
        });
    }).mouseout(function () {
        $('.plus').css({
            "background": "url('')"
        });
    });
	
})

function Arrows() {
	$('span.leftCorner').remove()
	$('span.rightCorner').remove()
	var s = $('#timelineContainer').find('.timeline-item');
	$.each(s, function (i, obj) {
		var posLeft = $(obj).css("left");
		$(obj).addClass('borderclass');
		if (posLeft == "0px") {
			html = "<span class='rightCorner'></span>";
			$(obj).prepend(html);
		} else {
			html = "<span class='leftCorner'></span>";
			$(obj).prepend(html);
		}
	});
	
	$('#timelineContainer').masonry({
        itemSelector: '.timeline-item',
        isAnimated: true
    });
}

var toggleTimeline = function() {
	$('.collapsible').click()
}

var showTimeline = function() {
	$('#timelineContainer').show()
	
	// timeline layout
    $('#timelineContainer').masonry({
        itemSelector: '.timeline-item',
        isAnimated: true
    });
    
    setTimeout(function() {
		$('#timelineContainer').masonry({
			itemSelector: '.timeline-item',
			isAnimated: true
		});
		setTimeout(Arrows, 1000);
	}, 500)
	
	if ($('div.timeline-item').length < 6) $('div.timeline').hide(); else $('div.timeline').show()
	$('div.timeline').css('left', $('div.timeline-item').offset().left + 21 + $('div.timeline-item').width())
	
	var height = $('div.book-middle').height - 200;
	$('div.timeline').css('height',height);
	
	$('div.timeline').offset().top += $('div.timeline').offset().top
	$('a.collapsible').click(function() {
		$(this).parent().parent().next().toggle('fast', function() {
			$('#timelineContainer').masonry({
				itemSelector: '.timeline-item',
				isAnimated: true
			});
		});
		var i = $('i', $(this))
		i.toggleClass('icon-plus').toggleClass('icon-minus')
		setTimeout(Arrows, 1500)
	})
	
}

var searchPatient = function (e) {
	
    var pName = $('#txtPName').val().toLowerCase();
    
    if (pName.trim().length == 0) {
		$('#divUserBlocks > div.user-block').show()
		return
	}
		
	var asyncHide = function(element) {
		setTimeout(function() {
			element.hide()
		}, 0)
	}
	
	var asyncShow = function(element) {
		setTimeout(function() {
			element.show()
		}, 0)
	}
    
    $('#divUserBlocks > div.usrblk').each(function() {
		
		var userName = $(this).data().username
		var userId = $(this).data().userid
		
		if (userName.toLowerCase().indexOf(pName) != -1)
			asyncShow($(this));
		else asyncHide($(this));
	})
	
	return
    

    // clear the error
    $('#divPNameError').hide();
    $('div.show-on-success').hide()

    if (window.autoSuggest && window.autoSuggest[pName]) {
		
		var p = 0
		$('#progressContainer1').show();
		$('#progressBar1').css('width','0%');
		var interval = setInterval(function() {
			p += 5;
			$('#progressBar1').css('width',p + '%')
		},50)
		
        var user = new Gossamer.models.User(window.autoSuggest[pName], function () {
			$('#lnkShowModal').hide()
			$('#btnLoggedIn').show()
	
            //var template = $('div.container-fluid').html();
            //var html = Mustache.render(template, this)
            //$('div.container-fluid').html(html)

            $('div.show-on-success').show()

			// timeline
			// generateTimeline(this.timeline)
			
			$('#progressContainer1').hide();
			clearInterval(interval)
			$('#myModal').modal('hide')
			
			$('#btnLoggedIn').html(Mustache.render($('#btnLoggedIn').html(), this))
			
			$('#divPersonalDetails').html(Mustache.render($('#divPersonalDetails').html(), this))
        })
    } else {
        // show error
        // $('#myModal').addClass('error')
        $('div.show-on-success').hide()
    }
}

var autoSuggestUsers = function (query, process) {
    if (query.trim().length == 0) {
        process([])
        return
    }
    new Gossamer.models.User().getAllNames(query, process)
}

var generateTimeline = function(timeline) {
	
	timeline.forEach(function(event) {
		event.dump = ''
		
		event.displayHeader = event.event_type.replace(/_/g,' ');
		
		var d = new Date(event.event_date);
		event.displayDate = d.getDate() + ' ' + ['January','February','March','April','May','June','July','August','September','October','November','December'][d.getMonth()] + ' ' + d.getFullYear()
		
		if (event.event_report && event.event_report.length > 0)
			event.image = event.event_report + '?session=' + Gossamer.authentication.getSessionId();
		
		event.timelineDate = event.event_date.toDateString()
		for (var x in event) {
			if (x != 'timelineDate' && x != 'dump')
				event.dump += '<b>' + x.replace(/_/g,' ') + '</b><br/>' + event[x] + '<br/><br/>'
		}
	})
}


var HighChart = function(options) {
	
	options.tooltipFormatter = options.tooltipFormatter || function() {
			return '<b>'+ this.series.name +'</b><br/>'+
			'<b>' + this.x +'</b> : <b> ' + this.y + '</b>';
	};
	
	var chart = new Highcharts.Chart({
		chart: {
			renderTo: options.container,
			zoomType: 'x',
			marginRight: 130,
			marginBottom: 25,
			backgroundColor: 'transparent'
		},
		title: {
			text: options.graphTitle || 'Graph',
			x: -20 //center
		},
		subtitle: {
			text: options.subTitle || '',
			x: -20
		},
		xAxis: {
			type: 'datetime',
			maxZoom: 3600 * 1000 * 2,
			title: { text: null }
		},
		plotOptions: {
			area: {
				fillColor: options.fillColor || undefined,
				lineWidth: 1,
				marker: {
					enabled: false,
					states: {
						hover: {
							enabled: true,
							radius: 5
						}
					}
				},
				shadow: false,
				states: {
					hover: {
						lineWidth: 1
					}
				}
			}
		},
		yAxis: {
			title: {
				text: options.yTitle || 'Y Axis'
			},
			plotLines: [{
				value: 0,
				width: 1,
				color: '#808080'
			}],
			min: 0.6,
			startOnTick: false,
			showFirstLabel: false
		},
		tooltip: {
			shared: true
		},
		legend: {
			layout: 'vertical',
			align: 'right',
			verticalAlign: 'top',
			x: -10,
			y: 100,
			borderWidth: 0
		},
		series: [options.data]
	});
	
	return chart;
}
