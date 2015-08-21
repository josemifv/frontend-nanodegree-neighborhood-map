var MapsService=new function(){"use strict";var e,t,n,s=this,a=[];s.getMap=function(){return e},s.getInfoWindow=function(){return t},s.getMarkers=function(){return a},s.clearMarkers=function(){a.forEach(function(e){e&&e.setMap(null)}),a=[]},s.createMarker=function(n){var a=new google.maps.Marker({position:new google.maps.LatLng(n.venue.location.latitude,n.venue.location.longitude),animation:google.maps.Animation.DROP});return a.setMap(e),google.maps.event.addListener(a,"click",function(){s.bounceOnce(this),t.setContent(s.createInfoWindowContent(n)),t.open(e,this)}),a},s.fitBounds=function(){var t=new google.maps.LatLngBounds;if(a.length>0){for(var n=0;n<a.length;n++)a[n].getVisible()&&t.extend(a[n].getPosition());e.fitBounds(t)}},s.bounceOnce=function(e){e.setAnimation(google.maps.Animation.BOUNCE),setTimeout(function(){e.setAnimation(null)},1400)},s.createInfoWindowContent=function(e){var t='<div class="mdl-card">';return t+='<div class="mdl-card__title" style="background: url(@@eventImage@@) center / cover">',t+='<h2 class="mdl-card__title-text">@@name@@</h2>',t+="</div>",t+='<div class="mdl-card__supporting-text">',t+="<strong>Headliner: @@eventHeadliner@@</strong>",t+="<br/>",t+="<span>@@venueName@@</span>",t+="<br/>",t+="<span>@@venueCity@@ @@venueCountry@@</span>",t+="<br/>",t+="<span>@@attendance@@</span>",t+='<span class="pull-right">@@attribution@@</span>',t+="</div>",t+='<div class="mdl-card__menu">',t+='<button class="mdl-button mdl-button--icon mdl-js-button mdl-js-ripple-effect" onclick="MapsService.getInfoWindow().close()">',t+='<i class="material-icons">clear</i>',t+="</button>",t+="</div>",t+="</div>",t=t.replace("@@name@@",e.title),t=t.replace("@@eventImage@@",e.image),t=t.replace("@@eventHeadliner@@",e.headliner),t=t.replace("@@attendance@@",e.attendance),t=t.replace("@@venueName@@",e.venue.name),t=t.replace("@@venueCity@@",e.venue.city),t=t.replace("@@venueCountry@@",e.venue.country),"lastfm"===n?(t=t.replace("@@attribution@@",'Powered by <a target="_blank" href="@@website@@">Last.fm</a>'),t=t.replace("@@website@@",e.website&&""!==e.website?e.website:"http://www.last.fm")):(t=t.replace("@@attribution@@",'<a target="_blank" href="@@website@@"><img src="images/songkick-logo.png"></a>'),t=t.replace("@@website@@",e.website&&""!==e.website?e.website:"http://www.songkick.com")),t},s.selectMarker=function(e,t){n=t,google.maps.event.trigger(a[e],"click")},s.initializeMap=function(t){var n=new google.maps.LatLng(39.476,-6.372),s={center:n,zoom:3,disableDefaultUI:!0,styles:[{featureType:"poi",elementType:"labels",stylers:[{visibility:"off"}]}]};e=new google.maps.Map(document.getElementById("map-canvas"),s)},s.initializeInfoWindow=function(){t=new google.maps.InfoWindow,google.maps.event.addListener(t,"domready",function(){var e=$(".gm-style-iw"),t=e.prev();t.children(":nth-child(2)").css({display:"none"}),t.children(":nth-child(4)").css({display:"none"}),t.children(":nth-child(1)").attr("style",function(e,t){return t+"left: 76px !important;"}),t.children(":nth-child(3)").attr("style",function(e,t){return t+"left: 76px !important;"}),t.children(":nth-child(3)").find("div").children().css({"box-shadow":"rgba(72, 181, 233, 0.6) 0px 1px 6px","z-index":"1"}),t.children(":nth-child(3)").attr("style",function(e,t){return t+"margin: 0px; padding: 0px;"});var n=e.next();n.css({display:"none"})})}};ko.extenders.localStore=function(e,t){"use strict";var n=amplify.store(t)||e(),s=ko.computed({read:e,write:function(n){amplify.store(t,n),e(n)}}).extend({notify:"always"});return s(n),s};var Venue=function(e,t,n,s,a,r,o){"use strict";this.name=e||"",this.location={latitude:t.latitude,longitude:t.longitude},this.street=n||"",this.city=s||"",this.country=a||"",this.postalcode=r||"",this.website=o||""},Event=function(e,t,n,s,a,r,o){"use strict";this.title=e||"",this.website=t||"",this.date=n||"",this.image=s||"images/concert.jpg",a&&(this.venue=a),this.attendance=r?r+"  going":"No data about attendance found",this.headliner=o?o||"":"Unknown"},Artist=function(e,t,n,s,a){"use strict";this.name=e||"",this.mbid=t||"",this.ontour=n||"0",this.image=s||"images/concert.jpg",this.bio=a||""},OnTheRoadVM=function(){"use strict";var e=this;e.xhrArtist=void 0,e.xhrEvents=void 0,e.currentArtist=ko.observable().extend({localStore:"OntheRoad-Current-Artist"}),e.eventList=ko.observableArray([]),e.totalPages=ko.observable(0),e.currentPage=ko.observable(0),e.searchText=ko.observable().extend({rateLimit:{method:"notifyWhenChangesStop",timeout:500},localStore:"OntheRoad-Search-Text"}),e.searchText.subscribe(function(){e.searchEvents()}),e.dateFilter=ko.observable("all"),e.apiEngine=ko.observable("songkick").extend({localStore:"OntheRoad-Search-Engine"}),e.apiEngine.subscribe(function(){e.searchEvents()}),e.loadEventsFromLastFm=function(t,n){if(t){e.xhrEvents&&e.xhrEvents.abort(),n&&1!==n||(e.eventList([]),e.totalPages(0),e.currentPage(0));var s="http://ws.audioscrobbler.com/2.0/?method=artist.getevents&api_key=091752a3717719e4d40441a0127c8914&format=json&autocorrect=1&limit=30&artist=@@artist@@&page=@@page@@";s=s.replace("@@artist@@",t).replace("@@page@@",n||"1"),e.xhrEvents=$.ajax({url:s,success:function(t){if(t.error)console.log(t.message),document.getElementById("toastNoEvents").show();else if(t.events.event){var n=t.events.event,s=void 0!==t.events["@attr"]?Math.min(t.events["@attr"].perPage,t.events["@attr"].total):t.events.total;if(1===s)e.eventList.push(new Event(n)),e.totalPages(1),e.currentPage(1);else{for(var a=0;a<n.length;a++)e.eventList.push(new Event(n[a]));e.totalPages(t.events["@attr"].totalPages),e.currentPage(t.events["@attr"].page)}}},error:function(e){console.log(e.message||e.statusText),document.getElementById("toastAPIError").show()},fail:function(e){console.log(e.message||e.statusText),document.getElementById("toastAPIError").show()}})}},e.getArtistInfoFromLastFm=function(t){var n="http://ws.audioscrobbler.com/2.0/?method=artist.getinfo&api_key=091752a3717719e4d40441a0127c8914&format=json&autocorrect=1&artist=@@artist@@";n=n.replace("@@artist@@",t),t&&(e.xhrArtist&&e.xhrArtist.abort(),e.xhrArtist=$.ajax({url:n,success:function(t){if(t.error)console.log(t.message),document.getElementById("toastNoArtist").show();else if(t.artist&&"Undefined"!==t.artist.name){var n=t.artist;e.currentArtist(new Artist(n.name,n.mbid,n.ontour,n.image[0]["#text"],n.bio.summary)),e.searchText(n.name)}},error:function(e){console.log(e.message||e.statusText),document.getElementById("toastAPIError").show()},fail:function(e){console.log(e.message||e.statusText),document.getElementById("toastAPIError").show()}}))},e.loadEventsFromSongkick=function(t,n){if(t){e.xhrEvents&&e.xhrEvents.abort(),n&&1!==n||(e.eventList([]),e.totalPages(0),e.currentPage(0));var s="http://api.songkick.com/api/3.0/artists/@@artist@@/calendar.json?apikey=l3aDt08aR6bme4z3&page=@@page@@";s=s.replace("@@artist@@",t).replace("@@page@@",n||"1"),e.xhrEvents=$.ajax({url:s,success:function(t){if(t&&"ok"===t.resultsPage.status){var n=t.resultsPage.results;n.event&&n.event.length>0?e.eventList(ko.utils.arrayMap(n.event,function(e){var t;return e.venue&&(t=new Venue(e.venue.displayName,{latitude:e.venue.lat,longitude:e.venue.lng},null,e.location.city,null,null,e.venue.uri)),new Event(e.displayName,e.uri,e.start.date,null,t,null,null)})):document.getElementById("toastNoEvents").show()}else console.log(t),document.getElementById("toastAPIError").show()},error:function(e){console.log(e.message||e.statusText),document.getElementById("toastAPIError").show()},fail:function(e){console.log(e.message||e.statusText),document.getElementById("toastAPIError").show()}})}},e.getArtistInfoFromSongkick=function(t){if(t){e.xhrArtist&&e.xhrArtist.abort();var n="http://api.songkick.com/api/3.0/search/artists.json?query=@@artist@@&apikey=l3aDt08aR6bme4z3";n=n.replace("@@artist@@",t),e.xhrArtist=$.ajax({url:n,success:function(t){if(t&&"ok"===t.resultsPage.status){var n=t.resultsPage.results;if(n.artist&&n.artist.length>0){var s=n.artist[0];e.currentArtist(new Artist(s.displayName,s.id,s.onTourUntil?"1":"0")),e.loadEventsFromSongkick(s.id)}else document.getElementById("toastNoArtist").show()}else console.log(t),document.getElementById("toastAPIError").show()},error:function(e){console.log(e.message||e.statusText),document.getElementById("toastAPIError").show()},fail:function(e){console.log(e.message||e.statusText),document.getElementById("toastAPIError").show()}})}else console.log("Not query string provided")},e.isThereArtist=ko.computed(function(){return e.currentArtist()instanceof Artist}),e.filteredEventList=ko.computed(function(){return ko.utils.arrayFilter(e.eventList(),function(t){var n=new Date,s=new Date(t.date);switch(e.dateFilter()){case"today":return s.getDate()===n.getDate();case"month":return s.getMonth()===n.getMonth();case"year":return s.getFullYear()===n.getFullYear();default:return!0}})}),e.updateMarkerList=ko.computed(function(){MapsService.clearMarkers(),ko.utils.arrayForEach(e.filteredEventList(),function(e){MapsService.getMarkers().push(MapsService.createMarker(e))}),MapsService.fitBounds()}),e.searchEvents=function(){""!==e.searchText()&&("lastfm"===e.apiEngine()?(e.loadEventsFromLastFm(e.searchText(),1),e.getArtistInfoFromLastFm(e.searchText())):e.getArtistInfoFromSongkick(e.searchText(),1))},e.isLastPage=function(){return e.currentPage()===e.totalPages()},e.loadNextPage=function(){e.currentPage()<e.totalPages()&&e.loadEventsFromLastFm(e.searchText(),parseInt(e.currentPage())+1)},e.selectMarker=function(t){var n=ko.utils.arrayIndexOf(e.filteredEventList(),t);MapsService.selectMarker(n,e.apiEngine())},e.showResultList=ko.observable(!0),e.updateResultList=ko.computed(function(){e.showResultList()?$("#results-list").show():$("#results-list").hide()})};$(function(){"use strict";ko.applyBindings(new OnTheRoadVM),MapsService.initializeMap(),MapsService.initializeInfoWindow(),$("#progress-bar").hide()});