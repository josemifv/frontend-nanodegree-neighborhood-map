var map;

function setMarker(position) {
    var marker = new google.maps.Marker({
        position: position,
        animation: google.maps.Animation.DROP
    });
    marker.setMap(map);
}

function initialize() {
    var caceres = new google.maps.LatLng(39.476, -6.372);
    var mapOptions = {
        zoom: 17,
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
}

google.maps.event.addDomListener(window, 'load', initialize);
