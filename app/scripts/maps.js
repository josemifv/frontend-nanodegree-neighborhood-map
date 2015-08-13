/* jshint multistr: true */
/* global google */
/* exported MapsService */

var MapsService = new (function() {
    'use strict';

    var self = this;

    var map, infoWindow;
    var markers = [];

    self.getMap = function() {
        return map;
    };

    self.getInfoWindow = function() {
        return infoWindow;
    };

    self.getMarkers = function() {
        return markers;
    };

    self.clearMarkers = function() {
        markers.forEach(function(marker) {
            if (marker) {
                marker.setMap(null);
            }
        });
        markers = [];
    };

    self.createMarker = function(event) {
        var marker = new google.maps.Marker({
            position: new google.maps.LatLng(event.venue.location.latitude, event.venue.location.longitude),
            animation: google.maps.Animation.DROP
        });

        marker.setMap(map);

        google.maps.event.addListener(marker, 'click', function() {
            self.bounceOnce(this);
            infoWindow.setContent(self.createInfoWindowContent(event));
            infoWindow.open(map, this);
        });

        return marker;
    };

    self.bounceOnce = function(marker) {
        marker.setAnimation(google.maps.Animation.BOUNCE);
        setTimeout(function() {
            marker.setAnimation(null);
        }, 1400);
    };

    self.createInfoWindowContent = function(event) {
        var content = '<div class="mdl-card mdl-shadow--2dp demo-card-square">';
        content += '<div class="mdl-card__title mdl-card--expand">';
        content += '<h2 class="mdl-card__title-text">@@name@@</h2>';
        content += '</div>';
        content += '<div class="mdl-card__supporting-text">';
        content += 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.';
        content += 'Aenan convallis.';
        content += '</div>';
        content += '<div class="mdl-card__actions mdl-card--border">';
        content += '<a class="mdl-button mdl-button--colored mdl-js-button mdl-js-ripple-effect">';
        content += 'View Updates';
        content += '</a>';
        content += '</div>';
        content += '</div>';

        return content.replace('@@name@@', event.title);
    };

    self.selectMarker = function(markerIndex) {
        google.maps.event.trigger(markers[markerIndex], 'click');
    };

    self.initializeMap = function(mapCanvasId) {
        var caceres = new google.maps.LatLng(39.476, -6.372);
        var mapOptions = {
            center: caceres,
            zoom: 3,
            disableDefaultUI: true,
            styles: [{
                featureType: 'poi',
                elementType: 'labels',
                stylers: [{
                    visibility: 'off'
                }]
            }]
        };

        map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
    };

    self.initializeInfoWindow = function() {
        // Initialize the InfoWindow
        infoWindow = new google.maps.InfoWindow();
    };
})();
