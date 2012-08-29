var goto2 = function() {
	$('#divSection1').slideUp()
	$('div.page-header-search-fixed').slideDown()
	$('#divSection2').slideDown('slow')
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
					$('#btn' + window.activeTab).click()
				}, 10)
			}
		})
	}
}

var displayUser = function(id, loader) {
	
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
		
		$('#div' + window.activeTab).show().hide('slide', {direction: 'left'}, 400);
		setTimeout(function() { $('#divTimeline').show('slide', {direction: 'right'}, 400); }, 100)
		
		window.activeTab = 'Timeline'
		
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
		$('#div' + window.activeTab).show().hide('slide', {direction: 'left'}, 400);
		setTimeout(function() {
			$('#divDetails').show('slide', {direction: 'right'}, 400);
		}, 100)
		window.activeTab = 'Details'
		
		$('#lblDetails').show()
		$('#lblTimeline').hide()
		$('#lblDashboard').hide()
		
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
		$('#div' + window.activeTab).show().hide('slide', {direction: 'left'}, 400);
		setTimeout(function() { $('#divDashboard').show('slide', {direction: 'right'}, 400); }, 100)
		window.activeTab = 'Dashboard'
		
		$('#lblDetails').hide()
		$('#lblTimeline').hide()
		$('#lblDashboard').show()
	}
	$('#btnDashboard').click(tabDashboard)
	
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
	$('#txtStatsDate').val(d.getUTCFullYear() + '-' + (d.getMonth() > 9 ? d.getMonth() : '0' + d.getMonth()) + '-' + d.getDate())
	$('#txtEventDate').val(d.getUTCFullYear() + '-' + (d.getMonth() > 9 ? d.getMonth() : '0' + d.getMonth()) + '-' + d.getDate())
	var wtMax = -1, wtMin = 10000
	var bsMax = -1, bsMin = 10000
	var wtValues = [], wtDates = []
	var bsValues = [], bsDates = []
	
	this.Statistics.forEach(function(stat) {
		if (!stat || !stat.Value || stat.Value.toString().trim().length == 0) return
		if (!stat.Type) return
		switch (stat.Type.toLowerCase()) {
			case 'weight':
				if (stat.Value > wtMax) wtMax = stat.Value
				if (stat.Value < wtMin) wtMin = stat.Value
				wtValues.push(parseFloat(stat.Value))
				wtDates.push(stat.Date)
				break
			case 'blood_sugar':
				if (stat.Value > bsMax) bsMax = stat.Value
				if (stat.Value < bsMin) bsMin = stat.Value
				bsValues.push(parseFloat(stat.Value))
				bsDates.push(stat.Date)
				break
			default:
				break
		}
	});
	
	if (wtValues.length > 0) {
		if (wtValues.length > 6) wtValues = wtValues.slice(wtValues.length - 6, wtValues.length)
		var chart = new HighChart({
			container: 'divHeartRateGraph',
			data: {name: 'Heart Rate', data: wtValues},
			categories: wtDates,
			tooltipFormatter: function() {
				console.dir(this)
			}
		})
	}
	
	if (bsValues.length > 0) {
		if (bsValues.length > 6) bsValues = bsValues.slice(bsValues.length - 6, bsValues.length)
		var chart = new HighChart({
			container: 'divBloodSugarGraph',
			data: {name: 'Blood Sugar', data: bsValues},
			categories: bsDates
		})
	}
	
	$('#btnStatsSave').click(function() {
		var btn = $(this)
		
		btn.button('loading')
		var article = {
			"__CreatedBy": "Strento",
			"__Properties": [
				{
					"Key": "Type",
					"Value": $('#slctStatsType > option:selected').val()
				},
				{
					"Key": "Value",
					"Value": $('#txtStatsValue').val()
				},
				{
					"Key": "Date",
					"Value": $('#txtStatsDate').val()
				},
				{
					"Key": "Time",
					"Value": $('#txtStatsTime').val()
				},
				{
					"Key": "Notes",
					"Value": $('#txtStatsNotes').val()
				}
			],
			"__SchemaType": "Statistics"
		}
		
		Gossamer.storage.articles.create(deploymentId, 'Statistics', article, function(article) {
			var connection = {
				"__ArticleAId": userId,
				"__ArticleBId": article.__Id,
				"__CreatedBy": "Strento",
				"__LabelA": "User",
				"__LabelB": "Statistics",
				"__RelationName": "Statistics",
			}
			Gossamer.storage.connections.create(deploymentId, 'Statistics', connection, function(connection) {
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
			"__CreatedBy": "Strento",
			"__Properties": [
				{
					"Key": "Event_Type",
					"Value": $('#slctEventType > option:selected').val()
				},
				{
					"Key": "Event_Date",
					"Value": $('#txtEventDate').val()
				},
				{
					"Key": "Event_Time",
					"Value": $('#txtEventTime').val()
				},
				{
					"Key": "Note",
					"Value": $('#txtEventNotes').val()
				}
			],
			"__SchemaType": "Event"
		}
		
		Gossamer.storage.articles.create(deploymentId, 'Event', article, function(article) {
			var connection = {
				"__ArticleAId": userId,
				"__ArticleBId": article.__Id,
				"__CreatedBy": "Strento",
				"__LabelA": "User",
				"__LabelB": "Event",
				"__RelationName": "Event",
			}
			Gossamer.storage.connections.create(deploymentId, 'Event', connection, function(connection) {
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
	
	
}


$(function () {
	
	// populate the user list
	Gossamer.storage.articles.searchAll(deploymentId, 'User', '', 1, function(articles) {
		
		var users = articles.map(function(article) {
			
			var userName = article.__Properties.filter(function(prop) {
				return prop.Key == 'Name'
			})[0].Value
			var photos = article.__Properties.filter(function(prop) {
				return prop.Key == 'Photograph'
			})
			
			var user = {userName: userName, userId: article.__Id}
			
			if (photos.length > 0 && photos[0].Value && photos[0].Value.trim().length > 0) 
				user.photograph = photos[0].Value + '?session=' + Gossamer.authentication.getSessionId()
			
			return user
		})
		
		$('#divUserBlocks').append($(Mustache.render($('#divUserBlocksTemplate').html(), {users: users})))
		
		$('#divUserBlocks > div.usrblk').click(function() {
			
			var loader = $('div.user-loading-image', $(this)).css('display','inline-block');
			
			var id = $(this).data().userid
			
			window.userId = id
			var user = new Gossamer.models.User(id, displayUser)
		})
		
	}, function() {
		// error handling here
	})
	
    $('#txtPName').keyup(function (e) {
        searchPatient.apply(this, arguments)
    });
    
    $('button#btnUserSave').click(function() {
		var btn = $(this)
		var kv = function(a, b) {
			return {"Key":a,"Value":b} 
		}
		btn.button('loading')
		var article = {
			"__CreatedBy": "Strento",
			"__SchemaType": "User"
		}
		
		// load the billion properties
		var p = []
		p.push(kv("Name",$('#txtUserName').val()))
		p.push(kv("Gender",$('[name=Gender]:checked').val()))
		p.push(kv("DOB",$('#txtDOB').val()))
		p.push(kv("Occupation",$('#txtOcc').val()))
		p.push(kv("Blood_Group",$('#slctBloodGroup > option:selected').val()))
		
		p.push(kv("Address",$('#txtAddress').val()))
		p.push(kv("City",$('#txtCity').val()))
		p.push(kv("Telephone_Number",$('#txtTelephoneNumber').val()))
		p.push(kv("Mobile_Number",$('#txtMobileNumber').val()))
		p.push(kv("Email_Id",$('#txtEmail').val()))
		
		p.push(kv("Insurer",$('#txtInsurer').val()))
		p.push(kv("Insurance_Id",$('#txtInsuranceId').val()))
		p.push(kv("Insurance_Type",$('#slctInsuranceType > option:selected').val()))
		p.push(kv("Eff_Date",$('#txtEffFrom').val()))
		p.push(kv("Term_Date",$('#txtTermDate').val()))
		
		article.__Properties = p
		Gossamer.storage.articles.create(deploymentId, 'User', article, function(article) {
			console.dir(article)
			btn.button('reset')
		}, function() {
			btn.button('reset')
		})
	})

    window.location.hash = ''

	$('#txtPName').focus();
    
    
    if (window.navigator.userAgent.toLowerCase().indexOf('ipad') == -1) {
		$('div.container').waypoint(function(event, direction) {
			$('.page-header-search').toggleClass('stuck-top');
		})
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
	$('div.timeline').css('height', $('div.book-bottom').offset().top - 100)
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
		
		event.displayHeader = event.Event_Type.replace(/_/g,' ');
		
		var d = new Date(event.Event_Date);
		event.displayDate = d.getDate() + ' ' + ['January','February','March','April','May','June','July','August','September','October','November','December'][d.getMonth()] + ' ' + d.getFullYear()
		
		if (event.Event_Report && event.Event_Report.length > 0)
			event.image = event.Event_Report + '?session=' + Gossamer.authentication.getSessionId();
		
		event.timelineDate = event.Event_Date.toDateString()
		for (var x in event) {
			if (x != 'timelineDate' && x != 'dump')
				event.dump += '<b>' + x.replace(/_/g,' ') + '</b><br/>' + event[x] + '<br/><br/>'
		}
	})
}


var HighChart = function(options) {
	var chart = new Highcharts.Chart({
		chart: {
			renderTo: options.container,
			type: 'line',
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
			categories: options.categories || []
		},
		yAxis: {
			title: {
				text: options.yTitle || 'Y Axis'
			},
			plotLines: [{
				value: 0,
				width: 1,
				color: '#808080'
			}]
		},
		tooltip: {
			formatter: options.tooltipFormatter|| (function() {
                        return '<b>'+ this.series.name +'</b><br/>'+
                        this.x +': '+ this.y +'°C';
                })
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
