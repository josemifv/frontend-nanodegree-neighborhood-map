var map;
var placesService;
var infoWindow;
var placeTypes = ['hotel', 'restaurant', 'point_of_worthship'];

function initialize() {
    var caceres = new google.maps.LatLng(39.476, -6.372);
    var mapOptions = {
        zoom: 15,
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
    map.setCenter(caceres);

    infoWindow = new google.maps.InfoWindow();
    placesService = new google.maps.places.PlacesService(map);
    searchNearby(caceres, placeTypes);
}

function searchNearby(location, types) {
    var request = {
        location: location,
        radius: 1000,
        type: types
    };
    placesService.nearbySearch(request, callback);
}

function callback(results, status) {
    if (status == google.maps.places.PlacesServiceStatus.OK) {
        for (var i = 0; i < results.length; i++) {
            createMarker(results[i]);
        }
    }
}

function createMarker(place) {
    var placeLoc = place.geometry.location;
    var marker = new google.maps.Marker({
        map: map,
        position: place.geometry.location
    });

    google.maps.event.addListener(marker, 'click', function() {
        infoWindow.setContent(place.name);
        infoWindow.open(map, this);
    });
}

google.maps.event.addDomListener(window, 'load', initialize);
