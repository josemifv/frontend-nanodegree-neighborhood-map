/* global amplify, ko, $, MapsService */

// Simple client storage for view models with AmplifyJS and Knockout
// https://craigcav.wordpress.com/2012/05/16/simple-client-storage-for-view-models-with-amplifyjs-and-knockout/
ko.extenders.localStore = function(target, key) {
    'use strict';

    var value = amplify.store(key) || target();

    var result = ko.computed({
        read: target,
        write: function(newValue) {
            amplify.store(key, newValue);
            target(newValue);
        }
    }).extend({
        notify: 'always'
    });

    result(value);

    return result;
};

var Venue = function(venueData) {
    'use strict';

    this.name = venueData.name || '';

    if (venueData.location) {
        this.location = {
            'latitude': venueData.location['geo:point']['geo:lat'],
            'longitude': venueData.location['geo:point']['geo:long']
        };
    }

    this.street = venueData.location.street;
    this.city = venueData.location.city;
    this.country = venueData.location.country;
    this.postalcode = venueData.postalcode || '';
    this.website = venueData.website || '';
};

var Event = function(eventData) {
    'use strict';

    this.title = eventData.title || '';
    this.website = eventData.website || '';
    this.date = eventData.startDate || '';
    this.image = eventData.image[3]['#text'] || 'images/concert.jpg';

    if (eventData.venue) {
        this.venue = new Venue(eventData.venue);
    }

    this.attendance = parseInt(eventData.attendance || 0);
};

var Artist = function(artistData) {
    'use strict';

    this.name = artistData.name || '';
    this.mbid = artistData.mbid || '';
    this.ontour = artistData.ontour || '0';
    this.image = artistData.image[2]['#text'] || 'images/concert.jpg';
    this.bio = artistData.bio.summary || '';
};

var OnTheRoadVM = function() {
    'use strict';

    var self = this;

    self.xhrArtist = undefined;
    self.xhrEvents = undefined;
    self.xhrPlaces = undefined;

    self.currentArtist = ko.observable().extend({
        localStore: 'OntheRoad-Current-Artist'
    });

    self.eventList = ko.observableArray([]);
    self.totalPages = ko.observable(0);
    self.currentPage = ko.observable(0);

    self.searchText = ko.observable().extend({
        rateLimit: {
            method: 'notifyWhenChangesStop',
            timeout: 500
        },
        localStore: 'OntheRoad-Search-Text'
    });

    self.dateFilter = ko.observable('all');

    self.loadEventsFromLastFm = function(artist, pageToLoad) {
        var lastFmAPIURL = 'http://ws.audioscrobbler.com/2.0/?method=artist.getevents&api_key=091752a3717719e4d40441a0127c8914&format=json&autocorrect=1&limit=30&artist=@@artist@@&page=@@page@@';

        // Clear previous results
        if (!pageToLoad || pageToLoad === 1) {
            self.eventList([]);
            self.totalPages(0);
            self.currentPage(0);
        }

        if (self.xhrEvents) {
            self.xhrEvents.abort();
        }

        lastFmAPIURL = lastFmAPIURL.replace('@@artist@@', artist).replace('@@page@@', pageToLoad);

        self.xhrEvents = $.ajax({
            url: lastFmAPIURL,
            success: function(serverData) {
                if (!serverData.error) {
                    if (serverData.events.event) {
                        var results = serverData.events.event;
                        var numResults = (serverData.events['@attr'] !== undefined) ? Math.min(serverData.events['@attr'].perPage, serverData.events['@attr'].total) : serverData.events.total;

                        // The API DOES NOT return an array if there is only one result
                        if (numResults === 1) {
                            self.eventList.push(new Event(results));
                            self.totalPages(1);
                            self.currentPage(1);
                        } else {
                            for (var i = 0; i < results.length; i++) {
                                self.eventList.push(new Event(results[i]));
                            }
                            self.totalPages(serverData.events['@attr'].totalPages);
                            self.currentPage(serverData.events['@attr'].page);
                        }
                    }
                } else {
                    console.log(serverData.message);
                }
            },
            error: function(e) {
                console.log(e.message);
            },
            fail: function(e) {
                console.log(e.message);
            }
        });
    };

    self.getArtistInfoFromLastFm = function(artist) {
        var lastFmAPIURL = 'http://ws.audioscrobbler.com/2.0/?method=artist.getinfo&api_key=091752a3717719e4d40441a0127c8914&format=json&autocorrect=1&artist=@@artist@@';

        lastFmAPIURL = lastFmAPIURL.replace('@@artist@@', artist);

        if (self.xhrArtist) {
            self.xhrArtist.abort();
        }

        self.xhrArtist = $.ajax({
            url: lastFmAPIURL,
            success: function(serverData) {
                if (!serverData.error) {
                    if (serverData.artist && serverData.artist.name !== 'Undefined') {
                        self.currentArtist(new Artist(serverData.artist));
                    } else {
                        self.currentArtist(new Artist(null));
                    }
                } else {
                    console.log(serverData.message);
                }
            },
            error: function(e) {
                console.log(e.message);
            },
            fail: function(e) {
                console.log(e.message);
            }
        });
    };

    self.filteredEventList = ko.computed(function() {
        return ko.utils.arrayFilter(self.eventList(), function(event) {
            var now = new Date();
            var eventDate = new Date(event.date);
            switch (self.dateFilter()) {
                case 'today':
                    return (eventDate.getDay() === now.getDay());
                case 'month':
                    return (eventDate.getMonth() === now.getMonth());
                case 'year':
                    return (eventDate.getFullYear() === now.getFullYear());
                default:
                    return true;
            }
        });
    });

    self.markersList = ko.computed(function() {
        MapsService.clearMarkers();
        ko.utils.arrayForEach(self.filteredEventList(), function(event) {
            MapsService.getMarkers().push(MapsService.createMarker(event));
        });
        MapsService.getMarkers();
    });

    self.searchEvents = ko.computed(function() {
        if (self.searchText() !== '') {
            self.loadEventsFromLastFm(self.searchText(), 1);
            self.getArtistInfoFromLastFm(self.searchText());
        }
    });

    self.isThereResults = ko.computed(function() {
        return self.filteredEventList().length > 0;
    });

    self.isLastPage = function() {
        return self.currentPage() === self.totalPages();
    };

    self.loadNextPage = function() {
        if (self.currentPage() < self.totalPages()) {
            self.loadEventsFromLastFm(self.searchText(), parseInt(self.currentPage()) + 1);
        }
    };

    self.selectMarker = function(event) {
        var markersIndex = ko.utils.arrayIndexOf(self.filteredEventList(), event);
        MapsService.selectMarker(markersIndex);
    };

    self.persistData = ko.computed(function() {

    });
};

$(function() {
    'use strict';

    ko.applyBindings(new OnTheRoadVM());
    MapsService.initializeMap();
    MapsService.initializeInfoWindow();
    $('#progress-bar').hide();
});
