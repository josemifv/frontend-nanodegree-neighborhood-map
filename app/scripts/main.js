var assignIfNotUndefined = function(value) {
    if (value) {
        return value;
    }
    return '';
}

var Event = function(data) {
    this.title = assignIfNotUndefined(data['title']);
    this.website = assignIfNotUndefined(data['website']);
    this.date = assignIfNotUndefined(data['startDate']);
    this.image = assignIfNotUndefined(data.image[3]['#text']);
    if (data['venue']) {
        this.venue = new Venue(data.venue);
    }
};

var Venue = function(data) {
    this.name = data.name;
    this.location = {
        "latitude": data.location['geo:point']['geo:lat'],
        "longitude": data.location['geo:point']['geo:long']
    };
    this.street = data.location.street;
    this.city = data.location.city;
    this.country = data.location.country;
    this.postalcode = data.postalcode;
    this.website = data.website;
};

var appViewModel = function() {
    var self = this;
    var map, infoWindow, markers;

    self.xhr = undefined;

    self.searchText = ko.observable('Metallica').extend({
        rateLimit: {
            method: "notifyWhenChangesStop",
            timeout: 500
        }
    });

    self.eventList = ko.observableArray([]);

    self.filteredEventList = ko.computed(function() {
        return ko.utils.arrayFilter(self.eventList(), function(event) {
            return true
        });
    });

    self.searchEvents = ko.computed(function() {
        var lastFmAPIURL = 'http://ws.audioscrobbler.com/2.0/?method=artist.getevents&api_key=091752a3717719e4d40441a0127c8914&format=json&autocorrect=1&artist=';

        // Clear previous results
        self.eventList([]);
        if (self.xhr) {
            self.xhr.abort();
        }

        self.xhr = $.ajax({
            url: lastFmAPIURL + self.searchText(),
            success: function(data) {
                if (!data.error) {
                    var results = data.events.event;
                    var numResults = (data.events['@attr'] != undefined) ? data.events['@attr'].total : data.events.total;
                    // The API DOES NOT return an array if there is only one result
                    if (numResults == 1) {
                        self.eventList.push(new Event(results));
                    } else {
                        for (var i = 0; i < numResults; i++) {
                            self.eventList.push(new Event(results[i]));
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
    });

    var initializeMap = function() {
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

    initializeMap();
};

// TODO Add to load or ready event
ko.applyBindings(new appViewModel());
