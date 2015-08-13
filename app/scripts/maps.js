/* jshint multistr: true */
/* global google */
/* exported MapsService */

var MapsService = function() {
    'use strict';

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
            infoWindow.setContent(self.createInfoWindowContent(event));
            infoWindow.open(map, this);
        });

        return marker;
    };


    self.createInfoWindowContent = function(event) {
        var content = ' \
          <div class="mdl-card mdl-shadow--2dp demo-card-square"> \
            <div class="mdl-card__title mdl-card--expand"> \
              <h2 class="mdl-card__title-text">@@name@@</h2> \
            </div> \
            <div class="mdl-card__supporting-text"> \
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. \
              Aenan convallis. \
            </div> \
            <div class="mdl-card__actions mdl-card--border"> \
              <a class="mdl-button mdl-button--colored mdl-js-button mdl-js-ripple-effect"> \
              View Updates \
            </a> \
          </div> \
        </div> \
      ';

        return content.replace('@@name@@', event.title);
    };

    self.initializeMap = function(domElement) {
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

        return new google.maps.Map(domElement, mapOptions);
    };

    self.initializeInfoWindow = function() {
        // Initialize the InfoWindow
        return new google.maps.InfoWindow();
    };

    map = self.initializeMap();
    infoWindow = self.initializeInfoWindow();
};
