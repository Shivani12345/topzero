import React, {Component} from "react";
import {AppRegistry} from "react-native";
import {StackNavigator} from "react-navigation";
import Consts from "./app/consts/Consts";
import Splash from "./app/components/Splash";


// For Testing, set this to the screen you are working on. Saves the time of Navigation.
// To test the whole app, uncomment the next line
const HomeScreen = {screen: Splash};

//const HomeScreen = {screen: Consts.SCREENS.LOG_IN};



export default class IOSTop7 extends Component {

    static navigationOptions = {
        title: 'Welcome',
        header: null
    };

    render() {
        return <Top7 onNavigationStateChange={null}/>
    }
}

const Top7 = StackNavigator({
    "Home": HomeScreen,
    [Consts.SCREEN_TITLES.SPLASH]: {screen: Consts.SCREENS.SPLASH},
    [Consts.SCREEN_TITLES.LOG_IN]: {screen: Consts.SCREENS.LOG_IN},
    [Consts.SCREEN_TITLES.USER_CONFIRM_DETAILS]: {screen: Consts.SCREENS.USER_CONFIRM_DETAILS},
    [Consts.SCREEN_TITLES.DASHBOARD]: {screen: Consts.SCREENS.DASHBOARD},
    [Consts.SCREEN_TITLES.PLACE_DETAILS]: {screen: Consts.SCREENS.PLACE_DETAILS},
    [Consts.SCREEN_TITLES.PLACE_ADD_POP_UP]: {screen: Consts.SCREENS.PLACE_ADD_POP_UP},
    [Consts.SCREEN_TITLES.SEARCH_SCREEN]: {screen: Consts.SCREENS.SEARCH_SCREEN},
    [Consts.SCREEN_TITLES.FILTER_SCREEN]: {screen: Consts.SCREENS.FILTER_SCREEN},

});

AppRegistry.registerComponent('IOSTop7', () => IOSTop7);