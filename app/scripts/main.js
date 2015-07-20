var map;
var placesService;
var infoWindow;
var placeTypes = ['lodging'];

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

    ko.applyBindings(new appViewModel());
}

function searchNearby(location, types) {
    var request = {
        location: location,
        radius: 1000,
        type: types
    };
    placesService.nearbySearch(request, searchNearbyCallback);
}

function searchNearbyCallback(results, status) {
    if (status == google.maps.places.PlacesServiceStatus.OK) {
        for (var i = 0; i < results.length; i++) {
            createMarker(results[i]);
        }
    } else {
        console.log(status);
    }
}

function getDetailsCallback(place, status) {
    if (status == google.maps.places.PlacesServiceStatus.OK) {
        infoWindow.setContent(createInfoWindowContent(place));
    } else {
        console.log(status);
    }
}

function createMarker(place) {
    var placeLoc = place.geometry.location;
    var marker = new google.maps.Marker({
        map: map,
        position: place.geometry.location
    });
    marker.setIcon(place.icon);

    google.maps.event.addListener(marker, 'click', function() {
        bounceALittle(marker);
        var request = {
            placeId: place.place_id
        };
        placesService.getDetails(request, getDetailsCallback);
        infoWindow.open(map, this);
    });
}

function createInfoWindowContent(place) {
    var infocontent = '<div class="mdl-card">';
    infocontent += '<div class="mdl-card__title"><h2 class="mdl-card__title-text">' + place.name + '</h2></div>';
    infocontent += '<div class="mdl-card__media"><img src="' + place.photos[0].getUrl({ maxWidth: 220, maxHeight: 140 }) + '" width="220" height="140" border="0" alt="" style="padding:20px;"></div>';
    infocontent += '<div class="mdl-card__supporting-text">' + place.formatted_address + '</div>';
    infocontent += '<div class="mdl-card__supporting-text">' + place.formatted_phone_number + '</div>';
    infocontent += '<div class="mdl-card__supporting-text">' + place.price_level + '</div>';
    infocontent += '<div class="mdl-card__supporting-text">' + place.rating + '</div>';
    infocontent += '<div class="mdl-card__supporting-text"><a href="' + place.website + '" target="_blank">' + place.website + '</a></div>';
    infocontent += '</div>';
    infocontent += '</div>';
    return infocontent;
}

function bounceALittle(marker) {
    marker.setAnimation(google.maps.Animation.BOUNCE);
    setTimeout(function() {
        marker.setAnimation(null);
    }, 1400);
}


google.maps.event.addDomListener(window, 'load', initialize);
