var Place = function(data) {
    this.type = data.type;
    this.category = data.category;
    this.name = data.name;
    this.address = data.address;
    this.phone = data.phone;
    this.website = data.website;
    this.email = data.email;
    this.coordinates = data.coordinates;
};

var appViewModel = function() {
    var self = this;

    self.placesList = ko.observableArray([]);
    self.searchText = ko.observable('');
    self.showRestaurants = ko.observable(true);
    self.showHotels = ko.observable(true);
    self.showOthers = ko.observable(true);

    self.placeTypeFilter = ko.computed(function() {
        var filter = [];
        if (self.showHotels()) {
            filter.push("hotel");
        }
        if (self.showRestaurants()) {
            filter.push("restaurant");
        }
        if (self.showOthers()) {
            filter.push("other");
        }
        return filter;
    });

    self.filteredPlacesList = ko.computed(function() {
        var textFilter = self.searchText().toLowerCase();
        var placeTypeFilter = self.placeTypeFilter();

        if (!textFilter && placeTypeFilter.length === 3) {
            return self.placesList();
        }

        // Filter results
        return ko.utils.arrayFilter(self.placesList(), function(placesListItem) {
            return placesListItem.name.toLowerCase().indexOf(textFilter) >= 0 && placeTypeFilter.indexOf(placesListItem.type) > -1;
        });
    });
};
