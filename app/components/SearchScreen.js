import React, {Component} from "react";
import {Image, StyleSheet, Alert, TouchableHighlight,View} from "react-native";
import {GooglePlacesAutocomplete} from "react-native-google-places-autocomplete";

import Consts from "../consts/Consts";
import Memory from "../core/Memory";
import Backend from "../core/Backend";
import { GoogleAnalyticsTracker, GoogleAnalyticsSettings, GoogleTagManager } from 'react-native-google-analytics-bridge';

export default class SearchScreen extends Component {

    constructor() {
        super();
        this.tracker = new GoogleAnalyticsTracker(Consts.GA_KEY);
    }

    static navigationOptions = {
        gesturesEnabled: false,
        header: null
    };

    dataReceived = (data, placeData, details) => {
        if (data.Status === 'success') {
            this.tracker.trackEvent(Consts.analyticEvent.searchFromDBEvent, Consts.analyticEvent.clickEvent, Consts.analyticEvent.searchFromDBLabel);

            // let icon = Consts.API_URLS.GOOGLE_PHOTO_API_BASE + "maxwidth=400&photoreference=" + data.place.googlePhotoRef + "&key=" +
            //     Consts.KEYS.GOOGLE_API_KEY;
            let newMaker = {
                id: data.place.id,
                priceLevel: data.place.priceLevel,
                icon: {uri: data.place.googlePhotoRef},
                name: data.place.name,
                phoneNumber: data.place.phoneNumber,
                number: 3, // So that PriceRange in PlaceDetails does not break
                type: [data.place.types[0]],
                location: {
                    city: data.place.location.city,
                    state: data.place.location.state,
                    country: data.place.location.country
                },
                coordinate: {
                    latitude: parseFloat(data.place.location.cityLatitude),
                    longitude: parseFloat(data.place.location.cityLongitude),
                    latitudeDelta: 0.15,
                    longitudeDelta: 0.15,
                },
                reviews: [],
                rating: data.place.rating
            };
            this.props.navigation.navigate(
                Consts.SCREEN_TITLES.PLACE_DETAILS,
                {
                    markerObject: newMaker,
                    onGoBack: () => {
                    }
                }
            );
        } else {
            this.detailsFromGoogle(placeData, details);
        }
    };


    detailsFromGoogle = (data, details) => {
        this.tracker.trackEvent(Consts.analyticEvent.searchDirectEvent, Consts.analyticEvent.clickEvent, Consts.analyticEvent.searchDirectLabel);

        // console.log("::::: CREATE MARKER :::::: ");
        // console.log(JSON.stringify(details));
        // console.log("+++++++++++++++++++++++++++++++++++++++++")
        // console.log(JSON.stringify(newMaker));

        let type = [];
        if (details.types) {
            for (let i = 0; i < details.types.length; i++) {
                if (details.types[i] === Consts.PLACE_TYPES.RESTAURANT) {
                    type.push(Consts.PLACE_TYPES.RESTAURANT);
                } else if (details.types[i] === "night_club") {
                    type.push(Consts.PLACE_TYPES.CLUB);
                } else if (details.types[i] === "bar") {
                    type.push(Consts.PLACE_TYPES.BAR);
                }
            }
        } else {
            console.warn("Google has no types!");
        }
        // If the place is neither restaurant nor club nor bar, do not show the marker
        // Should show a message or something to user about why the marker is not loaded
        if (!type) {
            return;
        }

        //check if the details have address component
        let city = null;
        let state = null;
        let country = null;

        if (details.address_components) {
            for (let i = 0; i < details.address_components.length; i++) {
                let types = details.address_components[i].types;
                if (!city && types.includes("administrative_area_level_2")) {
                    city = details.address_components[i].short_name;
                } else if (!state && types.includes("administrative_area_level_1")) {
                    state = details.address_components[i].long_name;
                } else if (!country && types.includes("country")) {
                    country = details.address_components[i].long_name;
                }
            }
            //console.log(city, state, country);
        } else {
            // console.warn("Google has no address component!..");
        }


        //Check if the place details have photos array
        //TODO: What if there are no images? Find a way to handle that case.
        let ref = null;
        let placeImage = null;
        if (details.photos && details.photos.length !== 0) {
            //Pick the first photo to show
            ref = details.photos[0].photo_reference;
            // Google API need reference of the image to get the full image.
            placeImage = Consts.API_URLS.GOOGLE_PHOTO_API_BASE + "maxwidth=400&photoreference=" + ref + "&key=" +
                Consts.KEYS.GOOGLE_API_KEY;
        } else {
          // Alert.alert(Consts.WRONG_PLACE_MESSAGES.TITLE, Consts.WRONG_PLACE_MESSAGES.MESSAGE)
          // console.warn("Google has no images of this place. Marker will not be loaded..");
            placeImage = "/default-placeholder.png";
        }

        // console.log(JSON.stringify(details));
        //Create the review array.
        let reviews = [];
        for (let i = 0; i < details.reviews.length; i++) {
            let review = details.reviews[i];
            reviews.push({
                author_name: review.author_name,
                profile_photo_url: review.profile_photo_url,
                text: review.text
            });
        }


        let cities = Memory().allCities;

        let cityExists = false;
        for (let i = 0; i < cities.length; i++) {
            if (cities[i].city === city) {
                cityExists = true;
                break;
            }
        }


        let typeExists = false;
        for (let i = 0; i < type.length && !typeExists; i++) {
            switch (type[i]) {
                case Consts.PLACE_TYPES.BAR : {
                    typeExists = true;
                    break;
                }
                case Consts.PLACE_TYPES.CLUB : {
                    typeExists = true;
                    break;
                }
                case Consts.PLACE_TYPES.RESTAURANT : {
                    typeExists = true;
                    break;
                }
            }
        }

        if (typeExists && cityExists) {

            let newMaker = {
                id: data.place_id,
                priceLevel: details.price_level != null ? details.price_level : 1,
                icon: {uri: placeImage},
                name: details.name,
                phoneNumber: details.international_phone_number,
                type: type,
                location: {
                    city: city,
                    state: state,
                    country: country
                },
                coordinate: {
                    latitude: details.geometry.location.lat,
                    longitude: details.geometry.location.lng,
                    latitudeDelta: 0.15,
                    longitudeDelta: 0.15,
                },
                reviews: reviews,
                rating: details.rating
            };
            // if(placeImage !=null) {
            //     newMaker.icon: {uri: placeImage}
            // }


            // console.log("::::: CREATE MARKER :::::: ");
            // console.log(JSON.stringify(details));
            // console.log("+++++++++++++++++++++++++++++++++++++++++")
            // console.log(JSON.stringify(newMaker));
            this.props.navigation.navigate(
                Consts.SCREEN_TITLES.PLACE_DETAILS,
                {
                    markerObject: newMaker,
                    onGoBack: () => {
                    }
                }
            );
        } else {
            this.tracker.trackEvent(Consts.analyticEvent.clickEvent, Consts.analyticEvent.wrongSearchEvent,Consts.analyticEvent.wrongSearchLabel);
            Alert.alert(Consts.WRONG_PLACE_MESSAGES.TITLE, Consts.WRONG_PLACE_MESSAGES.MESSAGE)
        }
    };

    /**
     * Called When any place from auto complete bar is tapped.
     * Changes the state as required.
     * @param data
     * @param details
     */
    suggestedPlaceOnPress = (data, details = null) =>
    {
        this.tracker.trackEvent(Consts.analyticEvent.clickEvent, Consts.analyticEvent.searchClickEvent,Consts.analyticEvent.searchEventLabel);

        Backend.getPlaceDetails(data.place_id, this.dataReceived, data, details);
    };


    /**
     * Creates the Google Auto-complete component required for search.
     * @returns {XML}
     */
    getGoogleAutoCompleteView = () => {
        // Need API key and type of the place you want to search.
        // Read: https://github.com/FaridSafi/react-native-google-places-autocomplete
        const query = {
            key: Consts.KEYS.GOOGLE_API_KEY,
            types: "establishment",
            components: "country:us"
        };

        return <GooglePlacesAutocomplete
            placeholder='Enter a place'
            minLength={2} // minimum length of text to search
            autoFocus={true}
            listViewDisplayed='false' // true/false/undefined
            fetchDetails={true}
            renderDescription={(row) => row.description}
            onPress={this.suggestedPlaceOnPress}
            getDefaultValue={() => ""}
            query={query}
            styles={autoCompleteStyle}
            currentLocationLabel="Current location"
            nearbyPlacesAPI="GooglePlacesSearch"
        />
    };

    render() {
        return (
            <View
                // source={require("../icons/background_ivory.png")}
                style={styles.container}>
                {this.getGoogleAutoCompleteView()}
                <TouchableHighlight
                    style={{width: 25, height: 80, justifyContent: "center", marginTop:"5%"}}
                    underlayColor={"rgba(0,0,0,0)"}
                    onPress={() => {
                        this.props.navigation.state.params.onGoBack();
                        this.props.navigation.goBack()
                    }}>
                    <Image
                        style={{marginLeft: 5}}
                        source={require("../icons/back_black.png")}/>
                </TouchableHighlight>
            </View>
        )
    }
}
const autoCompleteStyle = {

    container: {
        position: "absolute",
        top: "3%",
        left: 0,
        right: 0,

    },

    description: {
        width: 100,
        color: "black",
        fontFamily:"Museo Sans Cyrl"
    },

    listView: {
        backgroundColor: "white",
        elevation: 15,
    },

    textInputContainer: {
        height: 80,
        // alignItems: 'center',
        backgroundColor: '#DCC670',
        // elevation: 15,

    },

    textInput: {
        //marginTop: 0,
        height: 50,
        fontSize: 18,
        marginLeft: 25,
        marginTop: 13,
        fontFamily:"Museo Sans Cyrl"
    },

};
const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: null,
        height: null,
        backgroundColor: "#DCC670"
        // resizeMode: "cover",
    }
});
