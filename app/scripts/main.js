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

var Venue = function(name, location, street, city, country, postalcode, website) {
    'use strict';

    this.name = name || '';

    this.location = {
        latitude: location.latitude,
        longitude: location.longitude
    };

    this.street = street;
    this.city = city;
    this.country = country;
    this.postalcode = postalcode || '';
    this.website = website || '';
};

var Event = function(title, website, date, image, venue, attendance, headliner) {
    'use strict';

    this.title = title || '';
    this.website = website || '';
    this.date = date || '';
    this.image = image || 'images/concert.jpg';

    if (venue) {
        this.venue = venue;
    }

    this.attendance = parseInt(attendance || '0');

    this.headliner = headliner || '';
};

var Artist = function(name, id, onTour, image, summary) {
    'use strict';

    this.name = name || '';
    this.mbid = id || '';
    this.ontour = onTour || '0';
    this.image = image || 'images/concert.jpg';
    this.bio = summary || '';
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

    self.searchText.subscribe(function() {
        self.searchEvents();
    });

    self.dateFilter = ko.observable('all');

    self.apiEngine = ko.observable('songkick').extend({
        localStore: 'OntheRoad-Search-Engine'
    });

    self.loadEventsFromLastFm = function(artist, pageToLoad) {
        if (artist) {
            if (self.xhrEvents) {
                self.xhrEvents.abort();
            }

            // Clear previous results
            if (!pageToLoad || pageToLoad === 1) {
                self.eventList([]);
                self.totalPages(0);
                self.currentPage(0);
            }

            var lastFmAPIURL = 'http://ws.audioscrobbler.com/2.0/?method=artist.getevents&api_key=091752a3717719e4d40441a0127c8914&format=json&autocorrect=1&limit=30&artist=@@artist@@&page=@@page@@';

            lastFmAPIURL = lastFmAPIURL.replace('@@artist@@', artist).replace('@@page@@', pageToLoad || '1');

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
                        $('#toastNoEvents').show();
                    }
                },
                error: function(e) {
                    console.log(e.message || e.statusText);
                    $('#toastAPIError').show();
                },
                fail: function(e) {
                    console.log(e.message || e.statusText);
                    $('#toastAPIError').show();
                }
            });
        }
    };

    self.getArtistInfoFromLastFm = function(artist) {
        var lastFmAPIURL = 'http://ws.audioscrobbler.com/2.0/?method=artist.getinfo&api_key=091752a3717719e4d40441a0127c8914&format=json&autocorrect=1&artist=@@artist@@';

        lastFmAPIURL = lastFmAPIURL.replace('@@artist@@', artist);

        if (artist) {
            if (self.xhrArtist) {
                // Cancel previous call
                self.xhrArtist.abort();
            }

            self.xhrArtist = $.ajax({
                url: lastFmAPIURL,
                success: function(serverData) {
                    if (!serverData.error) {
                        if (serverData.artist && serverData.artist.name !== 'Undefined') {
                            self.currentArtist(new Artist(serverData.artist));
                            self.searchText(serverData.artist.name);
                        }
                    } else {
                        console.log(serverData.message);
                        $('#toastNoArtist').show();
                    }
                },
                error: function(e) {
                    console.log(e.message || e.statusText);
                    $('#toastAPIError').show();
                },
                fail: function(e) {
                    console.log(e.message || e.statusText);
                    $('#toastAPIError').show();
                }
            });
        }
    };


    self.loadEventsFromSongkick = function(artist, pageToLoad) {
        if (artist) {
            if (self.xhrEvents) {
                self.xhrEvents.abort();
            }

            // Clear previous results
            if (!pageToLoad || pageToLoad === 1) {
                self.eventList([]);
                self.totalPages(0);
                self.currentPage(0);
            }

            var songkickAPIURL = 'http://api.songkick.com/api/3.0/artists/@@artist@@/calendar.json?apikey=l3aDt08aR6bme4z3&page=@@page@@';

            songkickAPIURL = songkickAPIURL.replace('@@artist@@', artist).replace('@@page@@', pageToLoad || '1');

            self.xhrEvents = $.ajax({
                url: songkickAPIURL,
                success: function(serverData) {
                    if (serverData && serverData.resultsPage.status === 'ok') {
                        var results = serverData.resultsPage.results;
                        if (results.event && results.event.length > 0) {
                            self.eventList(ko.utils.arrayMap(results.event, function(event) {
                                var venue;
                                if (event.venue) {
                                    venue = new Venue(
                                        event.venue.displayName, {
                                            'latitude': event.venue.lat,
                                            'longitude': event.venue.lng
                                        },
                                        null,
                                        event.location.city,
                                        null, null,
                                        event.venue.uri);
                                }
                                return new Event(event.displayName, event.uri, event.start.date, null, venue, null, null);
                            }));
                        } else {
                            $('#toastNoEvents').show();
                        }
                    } else {
                        console.log(serverData);
                        $('#toastAPIError').show();
                    }
                },
                error: function(e) {
                    console.log(e.message || e.statusText);
                    $('#toastAPIError').show();
                },
                fail: function(e) {
                    console.log(e.message || e.statusText);
                    $('#toastAPIError').show();
                }
            });
        }
    };

    self.getArtistInfoFromSongkick = function(artist) {
        if (artist) {
            if (self.xhrArtist) {
                // Cancel previous call
                self.xhrArtist.abort();
            }

            var songkickAPIURL = 'http://api.songkick.com/api/3.0/search/artists.json?query=@@artist@@&apikey=l3aDt08aR6bme4z3';

            songkickAPIURL = songkickAPIURL.replace('@@artist@@', artist);

            self.xhrArtist = $.ajax({
                url: songkickAPIURL,
                success: function(serverData) {
                    if (serverData && serverData.resultsPage.status === 'ok') {
                        var results = serverData.resultsPage.results;
                        if (results.artist && results.artist.length > 0) {
                            var bestResult = results.artist[0];
                            self.currentArtist(new Artist(bestResult.displayName, bestResult.id, (bestResult.onTourUntil) ? '1' : '0'));
                            self.loadEventsFromSongkick(bestResult.id);
                        } else {
                            $('#toastNoArtist').show();
                        }
                    } else {
                        console.log(serverData);
                        $('#toastAPIError').show();
                    }
                },
                error: function(e) {
                    console.log(e.message || e.statusText);
                    $('#toastAPIError').show();

                },
                fail: function(e) {
                    console.log(e.message || e.statusText);
                    $('#toastAPIError').show();

                }
            });
        } else {
            console.log('Not query string provided');
        }
    };

    self.isThereArtist = ko.computed(function() {
        return self.currentArtist() instanceof Artist;
    });

    self.filteredEventList = ko.computed(function() {
        return ko.utils.arrayFilter(self.eventList(), function(event) {
            var now = new Date();
            var eventDate = new Date(event.date);
            switch (self.dateFilter()) {
                case 'today':
                    return (eventDate.getDate() === now.getDate());
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
        MapsService.fitBounds();
    });

    self.searchEvents = function() {
        if (self.searchText() !== '') {
            if (self.apiEngine() === 'lastfm') {
                self.loadEventsFromLastFm(self.searchText(), 1);
                self.getArtistInfoFromLastFm(self.searchText());
            } else {
                self.getArtistInfoFromSongkick(self.searchText(), 1);
            }
        }
    };

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

    self.showResultList = ko.observable(true);

    self.updateResultList = ko.computed(function() {
        if (self.showResultList()) {
            $('#results-list').show();
        } else {
            $('#results-list').hide();
        }
    });
};

$(function() {
    'use strict';

    ko.applyBindings(new OnTheRoadVM());
    MapsService.initializeMap();
    MapsService.initializeInfoWindow();
    $('#progress-bar').hide();
});
