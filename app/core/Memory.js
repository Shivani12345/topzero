export default function Memory() {
    if (typeof Memory.instance === 'object') {
        return Memory.instance
    } else {
        Memory.instance = this;
        // Memory.instance.allCities = [{
        //     "id": "5939226be4b09de63c139f5b",
        //     "city": "Miami-Dede County",
        //     "cityLatitude": "25.761681",
        //     "cityLongitude": "-80.191788",
        //     "zoomingIndex": "5",
        //     "state": null,
        //     "country": null,
        //     "continent": null
        // }, {
        //     "id": "59392289e4b09de63c139f5c",
        //     "city": "New York County",
        //     "cityLatitude": "40.730610",
        //     "cityLongitude": "-73.935242",
        //     "zoomingIndex": "4",
        //     "state": null,
        //     "country": null,
        //     "continent": null
        // }, {
        //     "id": "593922a7e4b09de63c139f5d",
        //     "city": "New Jersey",
        //     "cityLatitude": "40.72518",
        //     "cityLongitude": "-74.0783557",
        //     "zoomingIndex": "4",
        //     "state": null,
        //     "country": null,
        //     "continent": null
        // }];
        //
        // Memory.instance.currentCity = {
        //     "id": "5939226be4b09de63c139f5b",
        //     "city": "Miami-Dede County",
        //     "cityLatitude": "25.761681",
        //     "cityLongitude": "-80.191788",
        //     "zoomingIndex": "5",
        //     "state": null,
        //     "country": null,
        //     "continent": null
        // };

        Memory.instance.markers  = [];
        return this;
    }
}