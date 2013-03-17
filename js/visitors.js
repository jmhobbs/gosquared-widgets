$(function () {

	var graph, params;

	(window.onpopstate = function () {
			var match,
					pl     = /\+/g,
					search = /([^&=]+)=?([^&]*)/g,
					decode = function (s) { return decodeURIComponent(s.replace(pl, " ")); },
					query  = window.location.search.substring(1);

			params = {};
			while (match = search.exec(query))
				 params[decode(match[1])] = decode(match[2]);
	})();

	function updateGraph () {
		$.ajax({
			url: "https://api.gosquared.com/latest/concurrents/?callback=?",
			data: { api_key: params.api_key, site_token: params.site_token },
			success: function ( data, status, xhr ) {
				graph.refresh(data.visitors);
			},
			error: function ( xhr, errorType, error ) {
				if( window.console && window.console.log ) { console.log('XHR Error:', errorType, error); }
			},
			complete: function ( xhr, status ) {	
				setTimeout(updateGraph, 4000);
			}
		});
	}

	$.ajax({
		url: "https://api.gosquared.com/latest/overview/?callback=?",
		data: { api_key: params.api_key, site_token: params.site_token },
		success: function ( data, status, xhr ) {
			if( data.hasOwnProperty('code') ) {
				$('#gauge').text('Error');
				if( window.console && window.console.log ) { console.log('API Error:', data); }
				return;
			}

			graph = new JustGage({
				id: "gauge", 
				value: data.visitors, 
				min: 0,
				max: data.summaries.list['visitors.total'].max,
				label: "visitors",
				showInnerShadow: false,
				levelColors: ["#000000"],
				labelFontColor: "#000000",
				gaugeWidthScale: 0.2,
				gaugeColor: '#FFF'
			});

			setTimeout(updateGraph, 4000);
		},
		error: function ( xhr, errorType, error ) {
			$('#gauge').text('Error');
			if( window.console && window.console.log ) { console.log('XHR Error:', errorType, error); }
		}
	});

});
