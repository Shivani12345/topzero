import {LoginManager, LoginButton} from "react-native-fbsdk";
import React, {Component} from "react";
import {Image, StatusBar, StyleSheet, Text, TouchableHighlight, View} from "react-native";

import Consts from "../consts/Consts";
import Facebook from "../core/Facebook";
import Memory from "../core/Memory";
import Backend from "../core/Backend";
import { GoogleAnalyticsTracker, GoogleAnalyticsSettings, GoogleTagManager } from 'react-native-google-analytics-bridge';


export default class Login extends Component {

    static navigationOptions = {
        gesturesEnabled: false,
        header: null
    };

    constructor(props) {
        super(props);
        this.params = props.navigation.state.params;
        this.state = {
            isAccessTokenChecked: false,
            isUserLoggedIn: false,
        }
        this.tracker = new GoogleAnalyticsTracker(Consts.GA_KEY);
    }

    /**
     * Handle the data of user received from Graph Manager
     * @param error
     * @param result
     */
    handleData = (error, result) => {
        if (!error) {
            Memory().userObject = result;
            Backend.syncUserInfo((isUserNew) => {
                this.setLoadingTextViewVisibility(false);
                if (isUserNew) {
                    this.props.navigation.navigate(
                        Consts.SCREEN_TITLES.USER_CONFIRM_DETAILS,
                        // TODO: PLEASE TEST
                        {...this.params}
                    );
                } else {
                    if (this.params && this.params.toPage) {
                        this.props.navigation.state.params.onGoBack();
                        this.props.navigation.goBack();
                    } else {
                        this.props.navigation.navigate(Consts.SCREEN_TITLES.DASHBOARD);
                    }

                }
            })
        } else {
            console.log(error)
        }
    };


    /**
     * Once the login is done ( or cancelled ) handle the flow
     * @param result
     */
    handleLogIn = (result) => {
        if (result.isCancelled) {
            alert("Login was cancelled");
        } else {
            this.setLoadingTextViewVisibility(true);
            Facebook.makeGraphRequest(this.handleData);
        }
    };


    /**
     * Initiate the facebook login flow using LoginManager of Facebook
     */
    initLogIn = () => {
        this.tracker.trackEvent(Consts.analyticEvent.loginButtonEvent,Consts.analyticEvent.clickEvent, Consts.analyticEvent.loginButtonLabel);

        LoginManager.logInWithReadPermissions(['public_profile', 'email', 'user_friends'])
            .then(this.handleLogIn, (error) => alert(error))
            .catch((error) => {
                console.error(error)
            });
        Backend.getBackendAccessToken(() => {
        });
    };


    /**
     * Skip the login and go to dashboard when the user does not want to login
     */
    skipLogIn = () => {
        this.tracker.trackEvent(Consts.analyticEvent.loginSkipEvent,Consts.analyticEvent.clickEvent, Consts.analyticEvent.loginSkipLabel);

        this.setLoadingTextViewVisibility(true);
        Backend.getBackendAccessToken(() => {
            Memory().userObject = Consts.GUEST_USER;
            this.setLoadingTextViewVisibility(false);
            this.props.navigation.navigate(Consts.SCREEN_TITLES.DASHBOARD);
        });
    };


    /**
     * Helper function to hide or show the loading text view.
     * The loading text for current screen is 'synchronizing...'
     * @param isVisible
     */
    setLoadingTextViewVisibility = (isVisible) => {
        this.loadingText.setNativeProps({
            style: {
                bottom: isVisible ? 20 : -100,
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
                style={styles.loadingText}>Please wait...</Text>
        </View>
    };


    getSkipLoginView = () => {
        if (!(this.params && this.params.toPage)) {
            return <TouchableHighlight
                onPress={this.skipLogIn}
                underlayColor={"#c5b167"}
                style={styles.skipLoginContainer}>
                <Text style={styles.skipLoginText}>
                    skip login
                </Text>
            </TouchableHighlight>
        }
    };

    getBackButton = () => {
        if (Memory().userObject && Memory().userObject.isGuest) {
            return <TouchableHighlight
                onPress={() => this.props.navigation.goBack()}
                underlayColor={"#c5b167"}
                style={styles.buttonContainerPopUp}>
                <Image
                    style={{marginLeft: -3}}
                    source={require('../icons/back_black.png')}/>
            </TouchableHighlight>
        }
    };


    render() {
        console.log("Login: Render called");
        return (
            <Image
                source={require("../icons/background.png")}
                style={styles.container}>
                {this.getBackButton()}
                <StatusBar hidden={true}/>

                <TouchableHighlight
                    onPress={this.initLogIn}
                    style={styles.facebookLoginContainer}>
                    <Text
                        style={styles.facebookLoginText}>
                        LOGIN WITH FACEBOOK
                    </Text>
                </TouchableHighlight>

                {this.getSkipLoginView()}

                {/*<LoginButton/>*/}

                <View style={styles.declarationTextContainer}>
                    <Text style={styles.declarationText}>I agree to Top7's terms of service and privacy policy</Text>
                </View>

                {this.getLoadingTextView()}

            </Image>
        )
    }
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: null,
        height: null,
        resizeMode: "cover",
        alignItems: "center",
        justifyContent: "center",
    },

    appLogo: {
        marginBottom: 60,
        alignSelf: "center"
    },

    buttonContainerPopUp: {
        position: "absolute",
        left: 5,
        top: 5,
        height: 40,
        width: 40,
        borderRadius: 20,
        justifyContent: "center",
        alignItems: "center",
        //borderWidth: 1
    },


    facebookLoginContainer: {
        width: "80%",
        height: "8%",
        borderRadius: 50,
        backgroundColor: "#3B5999",
        alignItems: "center",
        justifyContent: "center",
        position: "absolute",
        bottom: 120,
    },

    facebookLoginText: {
        fontWeight: "bold",
        color: "white",
        fontFamily: 'Museo Sans Cyrl'
    },

    skipLoginContainer: {
        position: "absolute",
        bottom: 85,
        height: 25,
        width: 100,
        borderRadius: 10,
        alignItems: "center",
        justifyContent: "center",
        //borderWidth: 1,
    },

    skipLoginText: {
        color:"white",
        textDecorationLine: "underline",
        fontSize: 12,
        fontFamily: 'Museo Sans Cyrl'
    },

    declarationTextContainer: {
        backgroundColor: "rgba(0,0,0,0)",
        position: "absolute",
        bottom: 10,
    },

    declarationText: {fontFamily: 'Museo Sans Cyrl',color: "white",},

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
        borderColor: "rgba(0,0,0,0.5)",
        backgroundColor: "rgba(0,0,0,0.5)",
        elevation: 20,
        zIndex: 100,

    },
});
