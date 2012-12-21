(function($) {
	var map; // O mapa - Será carregado assim que o documento estiver pronto
	var municipiosArray = {};

	$(document).ready(function($) {
		$("input[type='checkbox']").change( filter );
		$("#changelist-search").submit( search );
		$("#closeiwlink").click( closeAllInfowindows );
		var latlng = new google.maps.LatLng(-14.2350040, -51.925280);
		var myOptions = {
				zoom: 5,
				center: latlng,
				mapTypeId: google.maps.MapTypeId.ROADMAP
		};

		map = new google.maps.Map(document.getElementById("map"), myOptions);
	    ajax_submit();
    })
    
	function ajax_submit(event) {
		$.ajax({
			url: "/sigi/dashboard/mapdata/",
			type: 'GET',
			cache: true,
			success: function(return_data) {
			// Delete all markers
			for (i in municipiosArray) {
				municipiosArray[i].setMap(null);
			}
			municipiosArray = {}
			
			// Create new markers
			for (var i in return_data) {
				var municipio = return_data[i];
				var markData = {
						map: null, // Just create the mark, dont plot it
						position: new google.maps.LatLng(parseFloat(municipio.lat), parseFloat(municipio.lng)),
						title: municipio.nome,
						icon: '/sigi/media/images/' + municipio.icone + '.png'
				}
				var mark = new google.maps.Marker(markData);
				var infoWin = new google.maps.InfoWindow({content: '<strong>' + municipio.nome + '</strong><br/><br/>' + municipio.info });
				linkMarkMessage(mark, infoWin, map);
				municipio['mapmark'] = mark;
				municipio['infowindow'] = infoWin;
				municipiosArray[i] = municipio;
			}
			filter(null);
		}});
		return false;
	}

	function linkMarkMessage(mark, infoWin, map) {
		google.maps.event.addListener(mark, 'click', function() {infoWin.open(map, mark);});
	}
	
	function closeAllInfowindows() {
		for (var i in municipiosArray) {
			municipiosArray[i]['infowindow'].close();
		}
	}
	
	function filter(event) {
		var data = $("#filter_form").serializeArray();
		var estados = [];
		var regioes = [];
		
		for (var i in data) {
			var name = data[i].name, value = data[i].value;
			if (name == 'estados') {
				estados.push(value);
				delete data[i];
			} else if (name == 'regioes') {
				regioes.push(value);
				delete data[i];
			}
		}
		
		for (var i in municipiosArray) {
			var municipio = municipiosArray[i];
			municipio['infowindow'].close();
			var aparece = false;

			if (regioes.indexOf(municipio.regiao) == -1 && estados.indexOf(municipio.estado) == -1) {
				aparece = false; 
			} else {
				for (var j in data) {
					if (data[j]) {
						var name = data[j].name, value = data[j].value;
						idx = municipio[name].indexOf(value);
						if (idx != -1) {
							aparece = true;
							break;
						}
					}
				}
			}
			if (aparece) {
				if (municipio.mapmark.map == null) {
					municipio.mapmark.setMap(map);
				}
			} else {
				if (municipio.mapmark.map != null) {
					municipio.mapmark.setMap(null);
				}
			}
		}
	}
	
	function search(event) {
		$.ajax({
			url: "/sigi/dashboard/mapsearch/",
			type: 'GET',
			data: $("#changelist-search").serializeArray(),
			cache: true,
			success: function(return_data) {
				if (return_data.result == 'NOT_FOUND') {
					$("#search-panel").html('Nenhum município encontrado.');
					return;
				}
				if (return_data.ids.length == 1) {
					$("#search-panel").html('um município encontrado.');
				} else {
					$("#search-panel").html(return_data.ids.length + ' municípios encontrados.');
				}
				var total = 0;
				for (var i in return_data.ids) {
					var municipio = municipiosArray[return_data.ids[i]];
					if (typeof(municipio) != 'undefined') {
						if (municipio.mapmark.map == null) {
							municipio.mapmark.setMap(map);
						}
						google.maps.event.trigger(municipio.mapmark, 'click');
						total = total + 1;
					}
				}

				if (total == 0) {
					$("#search-panel").html('Nenhum município encontrado.');
					return;
				}
				if (total == 1) {
					$("#search-panel").html('um município encontrado.');
				} else {
					$("#search-panel").html(total + ' municípios encontrados.');
				}
			}});
		return false;
	}
	
})(django.jQuery);