var map;
var ajaxRequest;
var plotlist;
var plotlayers=[];

function initmap() {
	// set up AJAX request
	ajaxRequest=getXmlHttpObject();
	if (ajaxRequest==null) {
		alert ("This browser does not support HTTP Request");
	return;
	}
	
	// set up the map
	map = new L.Map('map');

	// create the tile layer with correct attribution
	//var osmUrl='http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
	var osmUrl='http://{s}.tile.opencyclemap.org/cycle/{z}/{x}/{y}.png';
	
	
	var osmAttrib='Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors';
	var osm = new L.TileLayer(osmUrl, {minZoom: 8, maxZoom: 19, attribution: osmAttrib});		

 //monte fossa neve
	var marker = L.marker([38.1008, 14.9214]).addTo(map);
	marker.bindPopup("<b>Monte Fossa Neve</b>").openPopup();

 //neviera di fossa neve
	var marker = L.marker([38.09575, 14.92160]).addTo(map);
	marker.bindPopup("<b>Neviera</b>").openPopup();

	//monte saraceno
	var marker = L.marker([38.09110,14.92469]).addTo(map);
	marker.bindPopup("<b>Monte Saraceno</b>").openPopup();
	
	// start the map in Patti old town centre
	//map.setView(new L.LatLng(38.1390, 14.9645),17);

	var southWest = L.latLng(38.09102,14.90795),
	northEast = L.latLng(38.10160,14.93465),
	bounds = L.latLngBounds(southWest, northEast);
	map.fitBounds(bounds);

	map.addLayer(osm); 
 //L.control.layers(baseMaps, overlayMaps).addTo(map);
/*
var baseLayers = {
    "Mapbox": mapbox,
    "OpenStreetMap": osm
};

var overlays = {
    "Marker": marker,
    "Roads": roadsLayer,
				"Borders": bordersLayer
};

L.control.layers(osm, overlays).addTo(map);
*/
	
	askForPlots();
	map.on('moveend', onMapMove);

}

function onMapMove(e) {
	askForPlots();
}
	
function getXmlHttpObject() {
	if (window.XMLHttpRequest) { return new XMLHttpRequest(); }
	if (window.ActiveXObject)  { return new ActiveXObject("Microsoft.XMLHTTP"); }
	return null;
}

function askForPlots() {
	// request the marker info with AJAX for the current bounds
	var bounds=map.getBounds();
	var minll=bounds.getSouthWest();
	var maxll=bounds.getNorthEast();
	var msg='http://www.plotbrowser.com/leaflet/findbybbox.cgi?format=leaflet&bbox='+minll.lng+','+minll.lat+','+maxll.lng+','+maxll.lat;
	ajaxRequest.onreadystatechange = stateChanged;
	ajaxRequest.open('GET', msg, true);
	ajaxRequest.send(null);
}

function stateChanged() {
	// if AJAX returned a list of markers, add them to the map
	if (ajaxRequest.readyState==4) {
		//use the info here that was returned
		if (ajaxRequest.status==200) {
			plotlist=eval("(" + ajaxRequest.responseText + ")");
			removeMarkers();
			for (i=0;i<plotlist.length;i++) {
				var plotll = new L.LatLng(plotlist[i].lat,plotlist[i].lon, true);
				var plotmark = new L.Marker(plotll);
				plotmark.data=plotlist[i];
				map.addLayer(plotmark);
				plotmark.bindPopup("<h3>"+plotlist[i].name+"</h3>"+plotlist[i].details);
				plotlayers.push(plotmark);
			}
		}
	}
}

function removeMarkers() {
	for (i=0;i<plotlayers.length;i++) {
		map.removeLayer(plotlayers[i]);
	}
	plotlayers=[];
}

//coordinate del punto cliccato
//alert
/*
function onMapClick(e) {
    alert("You clicked the map at " + e.latlng);
}
*/
//popup
var popup = L.popup();

function onMapClick(e) {
   popup
        .setLatLng(e.latlng)
        .setContent("coordinate del punto:<br>" + e.latlng.toString())
         .openOn(map);
}

map.on('click', onMapClick);




// add a title
	var legend = L.control({position: 'topright'});  
	    legend.onAdd = function (map) {

	    var div = L.DomUtil.create('div', 'info legend'),
	        grades = [50, 100, 150, 200, 250, 300],
	        labels = ['<strong> Centro Storico di Patti: Notte per la Cultura 2014, V^ Edizione #npc14 </strong>'],
	        from, to;

	    for (var i = 0; i < grades.length; i++) {
	        from = grades [i];
	        to = grades[i+1]-1;

    labels.push(
        '<i style="background:' + getColor(from + 1) + '"></i> ' +
        from + (to ? '&ndash;' + to : '+'));
        }
        div.innerHTML = labels.join('<br>');
        return div;

        };

