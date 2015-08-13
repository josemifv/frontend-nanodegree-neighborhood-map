/* global ko, LastFMService, MapsService */

var OnTheRoadVM = function() {
    'use strict';

    var self = this;

    self.xhr = undefined;

    self.eventList = ko.observableArray([]);
    self.totalPages = ko.observable();
    self.currentPage = ko.observable();

    self.searchText = ko.observable('Metallica').extend({
        rateLimit: {
            method: 'notifyWhenChangesStop',
            timeout: 500
        }
    });

    self.filteredEventList = ko.computed(function() {
        return ko.utils.arrayFilter(self.eventList(), function(event) {
            return true;
        });
    });

    self.markersList = ko.computed(function() {
        MapsService.clearMarkers();
        ko.utils.arrayForEach(self.filteredEventList(), function(event) {
            MapsService.getMarkers().push(MapsService.createMarker(event));
        });
        console.log(MapsService.getMarkers());
    });

    self.searchEvents = ko.computed(function() {
        LastFMService.loadEventsFromLastFm(self.searchText(), 1);
    });

    self.isThereResults = function() {
        return self.filteredEventList().length > 0;
    };

    self.isLastPage = function() {
        return self.currentPage() === self.totalPages();
    };

    self.loadNextPage = function() {
        if (self.currentPage() < self.totalPages()) {
            LastFMService.loadEventsFromLastFm(self.searchText(), parseInt(self.currentPage()) + 1);
        }
    };

    MapsService.initializeMap(document.getElementById('map-canvas'));
    MapsService.intializeInfoWindow();
};

// TODO Add to load or ready event
$(function() {
    ko.applyBindings(new OnTheRoadVM());
});
