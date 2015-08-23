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

/**
 * Class to store info from a venue.
 *
 * @param {string} name       Venue name
 * @param {Object} location   Venue location (latitude and longitude).
 * @param {string} street     Venue street.
 * @param {string} city       Venue city.
 * @param {string} country    Venue country.
 * @param {string} postalcode Venue postalcode.
 * @param {string} website    Venue website.
 */
var Venue = function(name, location, street, city, country, postalcode, website) {
    'use strict';

    this.name = name || '';

    this.location = {
        latitude: location.latitude,
        longitude: location.longitude
    };

    this.street = street || '';
    this.city = city || '';
    this.country = country || '';
    this.postalcode = postalcode || '';
    this.website = website || '';
};

/**
 * Class to store info from an event.
 *
 * @param {string} title      Event title.
 * @param {string} website    Event website.
 * @param {string} date       Event date.
 * @param {string} image      Event-related image url.
 * @param {Venue}  venue      Event venue.
 * @param {string} attendance Event attendance.
 * @param {string} headliner  Event headliner.
 */
var Event = function(title, website, date, image, venue, attendance, headliner) {
    'use strict';

    this.title = title || '';
    this.website = website || '';
    this.date = date || '';
    this.image = image || 'images/concert.jpg';

    if (venue) {
        this.venue = venue;
    }

    if (attendance) {
        this.attendance = attendance + '  going';
    } else {
        this.attendance = 'No data about attendance found';
    }

    if (headliner) {
        this.headliner = headliner || '';
    } else {
        this.headliner = 'Unknown';
    }
};

/**
 * Class to store info from an artist.
 *
 * @param {[type]} name    [description]
 * @param {[type]} id      [description]
 * @param {[type]} onTour  [description]
 * @param {[type]} image   [description]
 * @param {[type]} summary [description]
 */
var Artist = function(name, id, onTour, image, summary) {
    'use strict';

    this.name = name || '';
    this.mbid = id || '';
    this.ontour = onTour || '0';
    this.image = image || 'images/concert.jpg';
    this.bio = summary || '';
};

/**
 * Application ViewModel.
 */
var OnTheRoadVM = function() {
    'use strict';

    var self = this;

    self.xhrArtist = undefined;
    self.xhrEvents = undefined;

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
        // Perform search on text input
        self.searchEvents();
    });

    self.dateFilter = ko.observable('all');

    self.apiEngine = ko.observable('songkick').extend({
        localStore: 'OntheRoad-Search-Engine'
    });

    self.apiEngine.subscribe(function() {
        // Perform search if API Engine changes
        self.searchEvents();
    });

    /**
     * It loads all upcoming events from an artist from LastFM API.
     *
     * @param  {string} artist     Artist name.
     * @param  {int}    pageToLoad Page to load (just in case we want to load a concrete page from the API).
     */
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
                        document.getElementById('toastNoEvents').show();
                    }
                },
                error: function(e) {
                    console.log(e.message || e.statusText);
                    document.getElementById('toastAPIError').show();
                },
                fail: function(e) {
                    console.log(e.message || e.statusText);
                    document.getElementById('toastAPIError').show();
                }
            });
        }
    };

    /**
     * It loads info from an artist from LastFM API.
     *
     * @param  {string} artist Artist name.
     */
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
                            var returnedArtist = serverData.artist;
                            self.currentArtist(new Artist(returnedArtist.name, returnedArtist.mbid, returnedArtist.ontour, returnedArtist.image[0]['#text'], returnedArtist.bio.summary));
                            self.searchText(returnedArtist.name);
                        }
                    } else {
                        console.log(serverData.message);
                        document.getElementById('toastNoArtist').show();
                    }
                },
                error: function(e) {
                    console.log(e.message || e.statusText);
                    document.getElementById('toastAPIError').show();
                },
                fail: function(e) {
                    console.log(e.message || e.statusText);
                    document.getElementById('toastAPIError').show();
                }
            });
        }
    };

    /**
     * It loads all upcoming events from an artist from Songkick API.
     *
     * @param  {string} artist     Artist name.
     * @param  {int}    pageToLoad Page to load (just in case we want to load a concrete page from the API).
     */
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

            var songkickAPIURL = 'http://api.songkick.com/api/3.0/artists/@@artist@@/calendar.json?apikey=l3aDt08aR6bme4z3&page=@@page@@&jsoncallback=?';

            songkickAPIURL = songkickAPIURL.replace('@@artist@@', artist).replace('@@page@@', pageToLoad || '1');

            self.xhrEvents = $.ajax({
                url: songkickAPIURL,
                dataType: 'jsonp',
                jsonpCallback: 'jsoncallback',
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
                            document.getElementById('toastNoEvents').show();
                        }
                    } else {
                        console.log(serverData);
                        document.getElementById('toastAPIError').show();
                    }
                },
                error: function(e) {
                    console.log(e.message || e.statusText);
                    document.getElementById('toastAPIError').show();
                },
                fail: function(e) {
                    console.log(e.message || e.statusText);
                    document.getElementById('toastAPIError').show();
                }
            });
        }
    };

    /**
     * It loads info from an artist from Songkick API.
     *
     * @param  {string} artist Artist name.
     */
    self.getArtistInfoFromSongkick = function(artist) {
        if (artist) {
            if (self.xhrArtist) {
                // Cancel previous call
                self.xhrArtist.abort();
            }

            var songkickAPIURL = 'http://api.songkick.com/api/3.0/search/artists.json?query=@@artist@@&apikey=l3aDt08aR6bme4z3&jsoncallback=?';

            songkickAPIURL = songkickAPIURL.replace('@@artist@@', artist);

            self.xhrArtist = $.ajax({
                url: songkickAPIURL,
                dataType: 'jsonp',
                jsonpCallback: 'jsoncallback',
                success: function(serverData) {
                    if (serverData && serverData.resultsPage.status === 'ok') {
                        var results = serverData.resultsPage.results;
                        if (results.artist && results.artist.length > 0) {
                            var bestResult = results.artist[0];
                            self.currentArtist(new Artist(bestResult.displayName, bestResult.id, (bestResult.onTourUntil) ? '1' : '0'));
                            self.loadEventsFromSongkick(bestResult.id);
                        } else {
                            document.getElementById('toastNoArtist').show();

                        }
                    } else {
                        console.log(serverData);
                        document.getElementById('toastAPIError').show();

                    }
                },
                error: function(e) {
                    console.log(e.message || e.statusText);
                    document.getElementById('toastAPIError').show();

                },
                fail: function(e) {
                    console.log(e.message || e.statusText);
                    document.getElementById('toastAPIError').show();

                }
            });
        } else {
            console.log('Not query string provided');
        }
    };

    /**
     * Flag to indicate if there is a current artist or not.
     */
    self.isThereArtist = ko.computed(function() {
        return self.currentArtist() instanceof Artist;
    });

    /**
     * List of filtered events (according to Gigs filters).
     */
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

    /**
     * Function that updates markers in the map according to the filtered results.
     */
    self.updateMarkerList = ko.computed(function() {
        MapsService.clearMarkers();
        ko.utils.arrayForEach(self.filteredEventList(), function(event) {
            MapsService.getMarkers().push(MapsService.createMarker(event));
        });
        MapsService.fitBounds();
    });

    /**
     * It performs the search (Artist and Evennts).
     */
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

    /**
     * [isLastPage description]
     * @return {Boolean} True if current page is the last page of the results.
     */
    self.isLastPage = function() {
        return self.currentPage() === self.totalPages();
    };

    /**
     * It retrieves the next results page.
     */
    self.loadNextPage = function() {
        if (self.currentPage() < self.totalPages()) {
            self.loadEventsFromLastFm(self.searchText(), parseInt(self.currentPage()) + 1);
        }
    };

    /**
     * It shows an InwoWindow containing the info from an Event
     * @param  {[type]} event [description]
     * @return {[type]}       [description]
     */
    self.selectMarker = function(event) {
        var markersIndex = ko.utils.arrayIndexOf(self.filteredEventList(), event);
        MapsService.selectMarker(markersIndex, self.apiEngine());
    };

    self.showResultList = ko.observable(true);

    /**
     * It shows or hides the result list according to results list switch state.
     */
    self.updateResultList = ko.computed(function() {
        if (self.showResultList()) {
            $('#results-list').show();
        } else {
            $('#results-list').hide();
        }
    });
};

// App initialization
$(function() {
    'use strict';

    ko.applyBindings(new OnTheRoadVM());
    MapsService.initializeMap();
    MapsService.initializeInfoWindow();
    $('#progress-bar').hide();
});
