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
    var map, infoWindow;
    var markers = [];

    self.loadEventsFromLastFm = function(artist, pageToLoad) {
        var lastFmAPIURL = 'http://ws.audioscrobbler.com/2.0/?method=artist.getevents&api_key=091752a3717719e4d40441a0127c8914&format=json&autocorrect=1&limit=30&artist=@@artist@@&page=@@page@@';

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
            infowindow.setContent(self.createInfoWindowContent(event));
            infowindow.open(map, this);
        });
        return marker;
    };

    self.createInfoWindowContent = function(event) {
        var content = ' \
          <div class="mdl-card mdl-shadow--2dp demo-card-square" style="border: solid"> \
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
        infowindow = new google.maps.InfoWindow();
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

    self.markersList = ko.computed(function() {
        self.clearMarkers();
        ko.utils.arrayForEach(self.filteredEventList(), function(event) {
            markers.push(self.createMarker(event));
        });
        console.log(markers);
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
