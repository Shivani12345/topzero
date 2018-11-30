import React, {Component} from "react";
import {
    DatePickerAndroid,
    DatePickerIOS,
    Dimensions,
    Image,
    Keyboard,
    KeyboardAvoidingView,
    Platform,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    TouchableHighlight,
    View
} from "react-native";
import moment from "moment";
import {Button, ButtonGroup} from "react-native-elements";

import Consts from "../consts/Consts";
import Backend from "../core/Backend";
import Memory from "../core/Memory";
import { GoogleAnalyticsTracker, GoogleAnalyticsSettings, GoogleTagManager } from 'react-native-google-analytics-bridge';

const {height, width} = Dimensions.get('window');

export default class UserConfirmDetails extends Component {

    static navigationOptions = {
        gesturesEnabled: false,
        header: null
    };

    constructor(props) {
        super(props);

        this.params = props.navigation.state.params;

        this.popUpZIndex = -10;


        // Memory().userObject = {
        //     picture: {
        //         data: {
        //             url: ""
        //         }
        //     },
        //     name: "Anand",
        //     email: "abundavia@gmail.oom"
        // };


        this.state = {
            showImage: true,
            selectedIndex: 1,
            date: moment(new Date()).format("MMMM DD[,] YYYY"),
            iosDate: new Date()
        };

        console.log(this.params);
        this.tracker = new GoogleAnalyticsTracker(Consts.GA_KEY);

    }

    /**
     * Shows the date picker to select the date
     * @returns {Promise.<void>}
     */
    showPicker = async () => {

        try {
            const {action, year, month, day} = await DatePickerAndroid.open({day: this.state.date});
            if (action !== DatePickerAndroid.dismissedAction) {
                this.setState({
                    date: moment(day + "/" + (month + 1) + "/" + year,
                        'DD/MM/YYYY').format("MMMM Do[,] YYYY")
                });
            }
        } catch ({code, message}) {
            console.warn('Cannot open date picker', message);
        }

    };

    keyboardDidShow = () => {
        //console.log("Image should be hidden");
        this.setState({
            showImage: false
        })
    };

    keyboardDidHide = () => {
        //console.log("Image should ne shown");
        this.setState({
            showImage: true
        })
    };


    /**
     * Check all the information and save it into the database.
     * Go to dashboard afterwards
     */
    updateUserInformation = () => {
        this.tracker.trackEvent(Consts.analyticEvent.loginEvent, Consts.analyticEvent.clickEvent, Consts.analyticEvent.loginLabel);

        Keyboard.dismiss();
        this.setLoadingTextViewVisibility(true);
        Backend.getBackendAccessToken(Backend.syncUserInfo, () => {
            this.setLoadingTextViewVisibility(false);
            this.keyboardDidShowListener.remove();
            this.keyboardDidHideListener.remove();
            console.log("Synced the info");
            if (this.params && this.params.toPage) {
                console.log("Going to specific page");
                //TODO: Should remove this page from stack
                this.props.navigation.navigate(Consts.SCREEN_TITLES.DASHBOARD);
                // this.props.navigation.navigate(
                //     // this.params.toPage,
                //     // {...this.params}
                // );
            } else {
                console.log("naaaah, goiunt to notmal dashboard");
                this.props.navigation.navigate(Consts.SCREEN_TITLES.DASHBOARD);
            }
        });
    };


    /**
     * Returns the user image if the keyboard is not on focus.
     * Returns nothing otherwise
     * @returns {XML}
     */
    loadUserProfile = () => {
        if (this.state.showImage) {
            return <View style={styles.profilePicContainer}>
                <Image
                    source={require("../icons/background_ivory.png")}
                    style={styles.profilePicUpper}/>

                <Image
                    style={styles.profilePic}
                    source={{uri: Memory().userObject.picture.data.url}}/>

                <View style={styles.profilePicLower}/>

                <Text style={styles.userName}>
                    {Memory().userObject.name.toUpperCase()}
                </Text>

            </View>;
        }
    };


    // TODO: Load the city name once the App has permissions
    loadCityName = () => {
        return <View style={styles.inputContainer}>
            <Image
                source={require("../icons/address_black.png")}
                style={styles.inputIcon}/>
            <TextInput
                style={styles.input}
                placeholder="CITY"
                onSubmitEditing={() => this.emailInput.focus()} // This is done so that when user hits done, It focuses on next TextInput
                blurOnSubmit={false}
            />
        </View>;
    };


    loadEmailAddress = () => {
        let email = "";
        if (Memory().userObject.email) {
            email = Memory().userObject.email;
        }
        return <View style={styles.inputContainer}>
            <Image
                source={require("../icons/sms_black.png")}
                style={styles.inputIcon}/>
            <TextInput
                ref={emailInput => this.emailInput = emailInput}
                style={styles.input}
                placeholder="EMAIL"
                blurOnSubmit={false}
                keyboardType="email-address"
                onSubmitEditing={() => Keyboard.dismiss()}
                value={email}/>
        </View>;
    };

    loadBirthdate = () => {
        let datePicker = null;
        if (Platform.OS === 'ios') {
            datePicker = <TouchableHighlight style={styles.datePicker}
                                             onPress={this.togglePopUp}
            ><Text style={styles.datePickerText}>{moment(this.state.iosDate).format("MMMM DD[,] YYYY")}</Text>
            </TouchableHighlight>
        } else {
            datePicker = <Button
                buttonStyle={styles.datePicker}
                textStyle={styles.datePickerText}
                title={this.state.date}
                onPress={this.showPicker}
            />
        }

        return <View style={styles.inputContainer}>
            <Image
                source={require("../icons/date_black.png")}
                style={styles.inputIcon}/>
            {datePicker}
        </View>;
    };


    loadGenderButton = () => {
        const gender = ['MALE', 'FEMALE'];
        return <View style={styles.inputContainer}>
            <Image
                source={require("../icons/sex_black.png")}
                style={styles.inputIcon}/>
            <ButtonGroup
                selectedIndex={this.state.selectedIndex}
                buttons={gender}
                textStyle={styles.genderButtonText}
                selectedTextStyle={styles.genderButtonSelectedText}
                containerStyle={ styles.genderButtonContainer}
                selectedBackgroundColor={"black"}
                onPress={(selectedIndex) => {
                    this.setState({
                        selectedIndex: selectedIndex
                    })
                }}
            />
        </View>
    };

    loadConfirmButton = () => {
        let margin = {
            marginTop: 10
        };
        return <TouchableHighlight
            style={[styles.confirmButtonContainer, margin]}
            onPress={this.updateUserInformation}>
            <Text style={styles.confirmButton}>CONFIRM</Text>
        </TouchableHighlight>;
    };


    togglePopUp = () => {
        Keyboard.dismiss();
        if (this.popUpZIndex < 0) {
            this.popUpZIndex = 10;
        } else {
            this.popUpZIndex = -10;
        }
        this.setState({});
    };

    getPopUpView = () => {

        // Check if Platform is IOS then  only return IOSDatePicker
        if (Platform.OS === 'ios') {
            return <View style={[styles.popUpContainer, {
                zIndex: this.popUpZIndex,
                top: (height / 2 - 100),
            }]}>
                <TouchableHighlight
                    underlayColor={"#c5b167"}
                    style={[styles.closeButton, {zIndex: this.popUpZIndex}]}
                    onPress={this.togglePopUp}>
                    <Text style={{color: "black",  fontFamily: 'Museo Sans Cyrl'}}>OK</Text>
                </TouchableHighlight>

                <DatePickerIOS
                    mode={'date'}
                    date={this.state.iosDate}
                    style={styles.datePickerIOS}
                    onDateChange={(e) => this.setState({iosDate: e})}/>
            </View>
        }
        else {
            return null
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
                style={styles.loadingText}>Synchronizing...</Text>
        </View>
    };


    /**
     * When component is gonna mount, attach the listener
     */
    componentWillMount() {
        //console.log("Adding the listener...");
        this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this.keyboardDidShow);
        this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this.keyboardDidHide);
    }


    /**
     * de-attach the listener when the component is unmount
     * If you do not do this, you will be in Memory-Leak Hell!
     */
    componentWillUnmount() {
        //console.log("Removing the listener...");
        this.keyboardDidShowListener.remove();
        this.keyboardDidHideListener.remove();
    }


    render() {
        return (
            <KeyboardAvoidingView behavior="padding" style={styles.container}>
                <View style={[styles.mainView, {opacity: this.popUpZIndex > 0 ? 0.3 : 1}]}>
                    <StatusBar hidden/>
                    {this.loadUserProfile()}
                    <View style={{height: 30}}/>
                    {this.loadCityName()}
                    {this.loadEmailAddress()}
                    {this.loadBirthdate()}
                    {this.loadGenderButton()}
                    {this.loadConfirmButton()}
                </View>
                {this.getPopUpView()}
                {this.getLoadingTextView()}
            </KeyboardAvoidingView>
        )
    }


}

const styles = StyleSheet.create({


    closeButton: {
        height: 30,
        width: 30,
        position: "absolute",
        right: 5,
        top: 5,
        borderRadius: 15,
        justifyContent: "center",
        alignItems: "center",
    },

    view: {
        width: "100%",
        height: 300,
        backgroundColor: "white"
    },

    popUpContainer: {
        position: "absolute",
        height: 200,
        width: "80%",
        borderRadius: 20,
        backgroundColor: '#DCC670',
        elevation: 20,
    },
    container: {
        zIndex: 1,
        flex: 1,
        alignItems: "center",
    },
    mainView: {
        zIndex: 1,
        height: "100%",
        width: "100%",
        alignItems: "center",
        backgroundColor: "white",
    },

    datePickerText: {
        color: "white",
        fontSize: 18,
        marginLeft: 4,
        fontFamily: 'Museo Sans Cyrl'
    },

    datePicker: {
        marginLeft: 4,
        width: "90%",
        height: width * 0.12,
        borderRadius: 4,
        marginTop: 8,
        marginBottom: 8,
        backgroundColor: "black",
        justifyContent: "center"
    },

    confirmButtonContainer: {
        width: "60%",
        height: 60,
        borderRadius: 25,
        backgroundColor: "black",
        alignItems: "center",
        justifyContent: "center",
    },

    confirmButton: {
        fontSize: 16,
        color: "white",
        fontWeight: "bold",
        fontFamily: 'Museo Sans Cyrl'
    },

    genderButtonText: {
        opacity: 0.5,
        paddingTop: 13,
        color: "black"
    },

    genderButtonSelectedText: {
        opacity: 1,
        fontWeight: "bold",
        color: "white",
    },

    genderButtonContainer: {
        width: "90%",
        height: 50,
        borderWidth: 2,
        margin: 4,
        marginLeft: 4,
        //backgroundColor: "black"
    },

    inputContainer: {
        flexDirection: "row",
        width: "90%",
        height: width * 0.15,
        alignItems: "center",
    },

    inputIcon: {
        height: 20,
        width: 20,
        resizeMode: "contain",
        margin: 4,

    },

    input: {
        fontSize: 18,
        width: "90%",
        margin: 4,
        color: '#313030',
        // borderWidth: 1,
    },

    userName: {
        position: "absolute",
        bottom: 12,
        fontSize: 20,
        alignSelf: "center",
        color: "black",
        fontFamily: 'Museo Sans Cyrl'
    },

    profilePicContainer: {
        width: "100%",
        height: "33%",
    },

    profilePicUpper: {
        flex: 1,
    },

    // profilePicxx: {
    //     position: "absolute",
    //     borderRadius: 75,
    //     height: 110,
    //     width: 110,
    //     bottom: 58,
    //     alignSelf: "center",
    //     elevation: 30,
    //     borderWidth:3,
    //     borderColor:"red"
    // },

    profilePic: {
        // borderRadius: 75,

        position: "absolute",
        borderRadius: 55,
        height: 110,
        width: 110,
        bottom: 58,
        alignSelf: "center",
    },

    profilePicLower: {
        flex: 1,
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
        borderColor: "rgba(0,0,0,0.5)",
        backgroundColor: "rgba(0,0,0,0.5)",
        elevation: 20,
        zIndex: 100,

    },


});
