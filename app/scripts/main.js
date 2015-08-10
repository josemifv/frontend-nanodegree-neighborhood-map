var Event = function(data) {
    this.title = data['title'] || '';
    this.website = data['website'] || '';
    this.date = data['startDate'] || '';
    this.image = data.image[3]['#text'] || 'images/concert.jpg';
    if (data['venue']) {
        this.venue = new Venue(data.venue);
    }
};

var Venue = function(data) {
    this.name = data.name || '';
    if (data.location) {
        this.location = {
            "latitude": data.location['geo:point']['geo:lat'],
            "longitude": data.location['geo:point']['geo:long']
        }
    }
    this.street = data.location.street;
    this.city = data.location.city;
    this.country = data.location.country;
    this.postalcode = data.postalcode || '';
    this.website = data.website || '';
};

var appViewModel = function() {
    var self = this;
    var map, infoWindow, markers;

    self.loadEventsFromLastFm = function(artist, pageToLoad) {
        var lastFmAPIURL = 'http://ws.audioscrobbler.com/2.0/?method=artist.getevents&api_key=091752a3717719e4d40441a0127c8914&format=json&autocorrect=1&limit=5&artist=@@artist@@&page=@@page@@';

        // Clear previous results
        if (!pageToLoad || pageToLoad == 1) {
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
            success: function(data) {
                if (!data.error) {
                    if (data.events.event) {
                        var results = data.events.event;
                        var numResults = (data.events['@attr'] != undefined) ? Math.min(data.events['@attr'].perPage, data.events['@attr'].total) : data.events.total;

                        // The API DOES NOT return an array if there is only one result
                        if (numResults == 1) {
                            self.eventList.push(new Event(results));
                            self.totalPages(1);
                            self.currentPage(1);
                        } else {
                            for (var i = 0; i < results.length; i++) {
                                self.eventList.push(new Event(results[i]));
                            }
                            self.totalPages(data.events['@attr'].totalPages);
                            self.currentPage(data.events['@attr'].page);
                        }
                    }
                } else {
                    console.log(data.message);
                }
            },
            error: function(e) {
                console.log(e.message);
            }
        });
    };

    self.initializeMap = function() {
        var caceres = new google.maps.LatLng(39.476, -6.372);
        var mapOptions = {
            center: caceres,
            zoom: 3,
            disableDefaultUI: true,
            styles: [{
                featureType: "poi",
                elementType: "labels",
                stylers: [{
                    visibility: "off"
                }]
            }]
        }

        map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
        $('#progress-bar').hide();
    };

    self.xhr = undefined;

    self.searchText = ko.observable('Metallica').extend({
        rateLimit: {
            method: "notifyWhenChangesStop",
            timeout: 500
        }
    });

    self.eventList = ko.observableArray([]);
    self.totalPages = ko.observable();
    self.currentPage = ko.observable();

    self.filteredEventList = ko.computed(function() {
        return ko.utils.arrayFilter(self.eventList(), function(event) {
            return true;
        });
    });

    self.searchEvents = ko.computed(function() {
        self.loadEventsFromLastFm(self.searchText(), 1)
    });

    self.isThereResults = function() {
        return self.filteredEventList().length > 0;
    };

    self.isLastPage = function() {
        return self.currentPage() == self.totalPages();
    };

    self.loadNextPage = function() {
        if (self.currentPage() < self.totalPages()) {
            self.loadEventsFromLastFm(self.searchText(), parseInt(self.currentPage()) + 1);
        }
    };

    self.initializeMap();
};

// TODO Add to load or ready event
ko.applyBindings(new appViewModel());
