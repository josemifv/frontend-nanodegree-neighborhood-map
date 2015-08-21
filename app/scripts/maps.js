/* jshint multistr: true */
/* global $, google */
/* exported MapsService */

/**
 * Service that manages all operations with the map.
 * @return MapService instance
 */
var MapsService = new (function() {
    'use strict';

    var self = this;

    var map, infoWindow;
    var markers = [];
    var apiEngine;

    // GETTERS AND SETTERS

    self.getMap = function() {
        return map;
    };

    self.getInfoWindow = function() {
        return infoWindow;
    };

    self.getMarkers = function() {
        return markers;
    };

    /**
     * It removes all markers in the map.
     */
    self.clearMarkers = function() {
        markers.forEach(function(marker) {
            if (marker) {
                marker.setMap(null);
            }
        });
        markers = [];
    };

    /**
     * It added a marker in the map.
     * @param  {Event} Event linked to the marker.
     */
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

    /**
     * It fits the map bounds to the markers in the map.
     */
    self.fitBounds = function() {
        // Source --> http://stackoverflow.com/questions/15299113/google-maps-v3-fitbounds-on-visible-markers
        var bounds = new google.maps.LatLngBounds();

        if (markers.length > 0) {
            for (var i = 0; i < markers.length; i++) {
                if (markers[i].getVisible()) {
                    bounds.extend(markers[i].getPosition());
                }
            }
            map.fitBounds(bounds);
        }
    };

    /**
     * It adds a bounce-twice effect to a marker.
     * @param  {google.maps.Marker} Marker.
     */
    self.bounceOnce = function(marker) {
        marker.setAnimation(google.maps.Animation.BOUNCE);
        setTimeout(function() {
            marker.setAnimation(null);
        }, 1400);
    };

    /**
     * It generates the infowindow containg all info from an event.
     * @param  {Event} Event.
     */
    self.createInfoWindowContent = function(event) {
        var content = '<div class="mdl-card">';
        content += '<div class="mdl-card__title" style="background: url(@@eventImage@@) center / cover">';
        content += '<h2 class="mdl-card__title-text">@@name@@</h2>';
        content += '</div>';
        content += '<div class="mdl-card__supporting-text">';
        content += '<strong>Headliner: @@eventHeadliner@@</strong>';
        content += '<br/>';
        content += '<span>@@venueName@@</span>';
        content += '<br/>';
        content += '<span>@@venueCity@@ @@venueCountry@@</span>';
        content += '<br/>';
        content += '<span>@@attendance@@</span>';
        content += '<span class="pull-right">@@attribution@@</span>';
        content += '</div>';
        content += '<div class="mdl-card__menu">';
        content += '<button class="mdl-button mdl-button--icon mdl-js-button mdl-js-ripple-effect" onclick="MapsService.getInfoWindow().close()">';
        content += '<i class="material-icons">clear</i>';
        content += '</button>';
        content += '</div>';
        content += '</div>';

        content = content.replace('@@name@@', event.title);
        content = content.replace('@@eventImage@@', event.image);
        content = content.replace('@@eventHeadliner@@', event.headliner);
        content = content.replace('@@attendance@@', event.attendance);
        content = content.replace('@@venueName@@', event.venue.name);
        content = content.replace('@@venueCity@@', event.venue.city);
        content = content.replace('@@venueCountry@@', event.venue.country);

        if (apiEngine === 'lastfm') {
            content = content.replace('@@attribution@@', 'Powered by <a target="_blank" href="@@website@@">Last.fm</a>');
            content = content.replace('@@website@@', (event.website && event.website !== '') ? event.website : 'http://www.last.fm');
        } else {
            content = content.replace('@@attribution@@', '<a target="_blank" href="@@website@@"><img src="images/songkick-logo.png"></a>');
            content = content.replace('@@website@@', (event.website && event.website !== '') ? event.website : 'http://www.songkick.com');
        }

        return content;
    };

    /**
     * It simulates a click on a marker.
     * @param  {[type]} markerIndex [description]
     * @param  {[type]} engine      [description]
     */
    self.selectMarker = function(markerIndex, engine) {
        apiEngine = engine;
        google.maps.event.trigger(markers[markerIndex], 'click');
    };

    /**
     * Map initialization.
     * @param  {DOMElement} mapCanvasId Canvas that will contain the map.
     */
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

    /**
     * InfoWindow initialization.
     */
    self.initializeInfoWindow = function() {
        // Initialize the InfoWindow
        infoWindow = new google.maps.InfoWindow();

        google.maps.event.addListener(infoWindow, 'domready', function() {
            var iwOuter = $('.gm-style-iw');

            var iwBackground = iwOuter.prev();

            iwBackground.children(':nth-child(2)').css({
                'display': 'none'
            });
            iwBackground.children(':nth-child(4)').css({
                'display': 'none'
            });

            iwBackground.children(':nth-child(1)').attr('style', function(i, s) {
                return s + 'left: 76px !important;';
            });

            iwBackground.children(':nth-child(3)').attr('style', function(i, s) {
                return s + 'left: 76px !important;';
            });

            iwBackground.children(':nth-child(3)').find('div').children().css({
                'box-shadow': 'rgba(72, 181, 233, 0.6) 0px 1px 6px',
                'z-index': '1'
            });

            iwBackground.children(':nth-child(3)').attr('style', function(i, s) {
                return s + 'margin: 0px; padding: 0px;';
            });

            var iwCloseBtn = iwOuter.next();
            iwCloseBtn.css({
                'display': 'none'
            });
        });
    };
})();
