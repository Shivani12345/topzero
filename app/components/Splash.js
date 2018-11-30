import React, {Component} from "react";
import {Animated, Dimensions, Image, Platform, StatusBar, StyleSheet, Text, View} from "react-native";
import {AccessToken} from "react-native-fbsdk";
import Facebook from "../core/Facebook";
import Memory from "../core/Memory";
import Backend from "../core/Backend";

import Consts from "../consts/Consts";

const {width} = Dimensions.get('window');

export default class Splash extends Component {

    static navigationOptions = {
        gesturesEnabled: false,
        header: null
    };

    constructor(props) {
        super(props);
        this.loadingBarWidth = new Animated.Value(0);
        this.state = {
            isAccessTokenChecked: false,
            isUserLoggedIn: false
        }
    }


    /**
     * Synchronizes the user information received from Facebook
     * to top7backend
     */
    syncUserInfo = () => {
        this.updateLoadingBar(80);
        Backend.syncUserInfo(() => {
                this.updateLoadingBar(120);
                this.props.navigation.navigate(Consts.SCREEN_TITLES.DASHBOARD);
            }
        );
    };


    /**
     * Handles the user data received from the facebook
     * @param error
     * @param result
     */
    handleData = (error, result) => {
        this.updateLoadingBar(40);
        // Do we have any error?
        if (!error) {
            // No we don't. Save the data in memory and sync the information
            // with top7backend as well
            if(result.friends !== undefined){
                let friendList = result.friends.data;
                delete result.friends;
                result['friendsList'] = friendList;
            }
            Memory().userObject = result;
            Backend.getBackendAccessToken(this.syncUserInfo);
        } else {
            // Yes. We do have some error
            // TODO: This error should be handled nicely
            // I do not know what will cause this error
            console.log(error);
        }
    };


    /**
     * Updates the loading bar to the given value with nice animations.
     * @param value value of bar in percentage to be set. updateLoadingBar(10) means 10% loading
     * and updateLoadingBar(80) means 80% of loading.
     */
    updateLoadingBar = (value) => {
        Animated.timing(this.loadingBarWidth, {
            // value is in percentage so converting it into dimensions.
            toValue: value * width / 100,
            // To make it look like starting slow, ending fast.
            // The lower the value, the the higher the duration and vice versa
            // Thus, it feels like loading is getting faster as time passes by
            duration: 1000 - value * 10 + 1
        }).start();
    };


    /**
     * Checks the facebook access token to determine whether the user is logged in or not
     */
    checkAccessToken = () => {
        AccessToken.getCurrentAccessToken().then((data) => {
            let valid = !!data; // which means valid = data? true : false;
            this.updateLoadingBar(20);
            //Is access token valid?
            if (valid) {
                // Yes. it is. Meaning that user has already logged in
                // Fetch the latest data of user from facebook and sync it with
                // server
                Facebook.makeGraphRequest(this.handleData);
            } else {
                // Nope the access token is not valid.
                // The user is not logged in. The user has to log in
                this.props.navigation.navigate(Consts.SCREEN_TITLES.LOG_IN);
            }
        }).catch((error) => {
            // This error will show up only and only if there are some issues in linking of Facebook SDK.
            console.error(error);
        });
    };

    render() {

        let fontStyle;
        if (Platform.OS === 'ios') {
            fontStyle = {fontFamily: 'Museo Sans Cyrl'}
        } else {
            fontStyle = {fontFamily: 'MuseoSansCyrl'}
        }

        return (
            <Image
                source={require("../icons/background.png")}
                style={styles.container}>
                <StatusBar hidden/>
                <View style={styles.loadingTextContainer}>
                    <Text
                        style={fontStyle}
                        ref={loadingText => this.loadingText = loadingText}>
                        Please wait...
                    </Text>
                </View>
                <Animated.View
                    ref={loadingBar => this.loadingBar = loadingBar}
                    style={[styles.loadingBar, {width: this.loadingBarWidth}]}/>
            </Image>
        )
    }


    componentDidMount() {
        if (!this.state.isAccessTokenChecked) {
            this.checkAccessToken();
        }
    }
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: null,
        height: null,
        resizeMode: "cover",
        justifyContent: "center",
    },

    appLogo: {
        marginBottom: 60,
        alignSelf: "center"
    },


    loadingTextContainer: {
        backgroundColor: "rgba(0,0,0,0)",
        position: "absolute",
        bottom: width * 0.05,
        alignSelf: "center",

    },


    loadingBar: {
        position: "absolute",
        bottom: 0,
        left: -5,
        height: 10,
        backgroundColor: "black",
        borderWidth: 1,
        borderRadius: 10,
    }
});
