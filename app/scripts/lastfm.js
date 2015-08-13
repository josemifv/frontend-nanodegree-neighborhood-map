/* global $ */
/* exported LastFMService */

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
};

var LastFMService = function() {
    'use strict';

    self.loadEventsFromLastFm = function(artist, pageToLoad) {
        var lastFmAPIURL = 'http://ws.audioscrobbler.com/2.0/?method=artist.getevents&api_key=091752a3717719e4d40441a0127c8914&format=json&autocorrect=1&limit=30&artist=@@artist@@&page=@@page@@';

        // Clear previous results
        if (!pageToLoad || pageToLoad === 1) {
            self.eventList([]);
            self.totalPages(0);
            self.currentPage(0);
        }

        if (self.xhr) {
            self.xhr.abort();
        }

        lastFmAPIURL = lastFmAPIURL.replace('@@artist@@', artist).replace('@@page@@', pageToLoad);

        self.xhr = $.ajax({
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
            }
        });
    };
};
