import React, {Component} from "react";
import {AppRegistry, NetInfo, StyleSheet, Text, View} from "react-native";

import Consts from "../consts/Consts";

// For Testing, set this to the screen you are working on. Saves the time of Navigation.
// To test the whole app, uncomment the next line
// const INITIAL_SCREEN = {
//     component: Consts.SCREENS.SPLASH,
//     title: Consts.SCREEN_TITLES.SPLASH
// };

// const INITIAL_SCREEN = {
//     component: Login,
//     title: Consts.SCREEN_TITLES.USER_CONFIRM_DETAILS
// };

//const INITIAL_SCREEN = {name: Consts.SCREEN_TITLES.LOG_IN};

/**
 * Entry point of the application.
 * This component is rendered first in the application every time.
 */
export default class Main extends Component {

    static navigationOptions = {
        gesturesEnabled: false,
        header: null
    };

    //
    // sceneChanger = (route, navigator) => {
    //     console.info("Navigator: Going to '" + route.name + "' screen");
    //     switch (route.title) {
    //         case Consts.SCREEN_TITLES.LOG_IN :
    //             return <Login navigator={navigator}/>;
    //             break;
    //         case Consts.SCREEN_TITLES.SPLASH :
    //             return <Splash navigator={navigator}/>;
    //             break;
    //         case Consts.SCREEN_TITLES.NETWORK :
    //             return <Network navigator={navigator}/>;
    //             break;
    //         case Consts.SCREEN_TITLES.USER_CONFIRM_DETAILS :
    //             return <UserConfirmDetails navigator={navigator}/>;
    //             break;
    //         case Consts.SCREEN_TITLES.DASHBOARD :
    //             return <Dashboard navigator={navigator}/>;
    //             break;
    //         case Consts.SCREEN_TITLES.PLACE_DETAILS:
    //             return <PlaceDetails
    //                 navigator={navigator}
    //                 markerObject={route.markerObject}
    //             />;
    //             break;
    //         case Consts.SCREEN_TITLES.PLACE_ADD_POP_UP:
    //             return <PlaceAddPopUp
    //                 navigator={navigator}
    //                 markerObject={route.markerObject}
    //             />;
    //         case Consts.SCREEN_TITLES.SEARCH_SCREEN:
    //             return <SearchScreen
    //                 navigator={navigator}
    //             />;
    //         default:
    //             console.log("Navigator WARNING: SCENE NOT FOUND!")
    //     }
    // };


    networkStatusChanged = (status) => {
        switch (status) {
            case Consts.NETWORK_STATUS.WIFI : {
                this.setLoadingTextViewVisibility(false);
                break;
            }
            case Consts.NETWORK_STATUS.CELL: {
                this.setLoadingTextViewVisibility(false);
                break;
            }
            case Consts.NETWORK_STATUS.MOBILE: {
                this.setLoadingTextViewVisibility(false);
                break;
            }
            case Consts.NETWORK_STATUS.NONE: {
                this.setLoadingTextViewVisibility(true);
                break;
            }
            default : {
                this.setLoadingTextViewVisibility(true);
                break;
            }
        }
    };


    /**
     * Helper function to hide or show the loading text view.
     * The loading text for current screen is 'synchronizing...'
     * @param isVisible
     */
    setLoadingTextViewVisibility = (isVisible) => {
        this.loadingText.setNativeProps({
            style: {
                bottom: isVisible ? 12 : -100,
                elevation: 20
            }
        });
    };


    /**
     * Creates and returns the view for the loading text.
     * This view is displayed when the user taps on the okay button
     */
    getLoadingTextView = () => {
        return <View
            ref={loadingText => this.loadingText = loadingText}
            style={styles.loadingTextContainer}>
            <Text
                style={styles.loadingText}>No network connection!</Text>
        </View>
    };


    render() {
        return (
            <View style={styles.mainContainer}>
                {this.getLoadingTextView()}
            </View>
        )
    }


    componentDidMount() {
        // Attaching a listener for network changes.
        NetInfo.addEventListener('change', this.networkStatusChanged);
        // This is for your info
        // If you want to remove the listener,
        // NetInfo.removeEventListener( 'change', callback );

        // Go to Splash!
        this.props.navigation.navigate(Consts.SCREEN_TITLES.SPLASH);
    }
}

styles = StyleSheet.create({
    mainContainer: {
        flex: 1
    },

    loadingText: {
        color: "white",
        fontFamily: 'Museo Sans Cyrl'
        //borderWidth: 1
    },

    loadingTextContainer: {
        position: 'absolute',
        alignSelf: 'center',
        bottom: -100,
        borderWidth: 1,
        width: 180,
        height: 30,
        borderRadius: 10,
        justifyContent: "center",
        alignItems: "center",
        borderColor: "rgba(255,0,0,0.5)",
        backgroundColor: "rgba(255,0,0,0.6)",
        elevation: 20

    }
});

AppRegistry.registerComponent('Main', () => Main);
