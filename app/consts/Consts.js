import React from "react";
import Splash from "../components/Splash";
import Login from "../components/Login";
import UserConfirmDetails from "../components/UserConfirmDetails";
import Main from "../components/Main";
import Dashboard from "../components/Dashboard";
import PlaceDetails from "../components/PlaceDetails";
import PlaceAddPopUp from "../components/PlaceAddPopUp";
import SearchScreen from "../components/SearchScreen";
import FilterScreen from "../components/FilterScreen";

export default class Consts {



    // static GRAPH_REQ = {
    //     GET_ALL_DETAILS: "getAllDetails",
    //     GET_USER_NAME: "getUserName"
    // };


    //static NAVIGATION_OPTIONS = {header: null};


    static WRONG_PLACE_MESSAGES = {
        TITLE: "Select Another Place",
        MESSAGE: "The place you selected does not belong to either the types or the cities enabled by the system"
    };

    static NETWORK_STATUS = {
        NONE: "none",
        WIFI: "wifi",
        CELL: "cell",
        MOBILE: "MOBILE",
        UNKNOWN: "unknown"
    };

    static PLACE_TYPES = {
        RESTAURANT: "restaurant",
        CLUB: "club",
        BAR: "bar",
        BAR_EQUAL: "Bar Scene"
    };


    static PRICE_LEVEL = {
        AFFORDABLE_LIMIT: 3,
        AFFORDABLE: "affordable",
        EXPENSIVE: "expensive"
    };

    static DEFAULT_CITY = "Miami-Dade County";
    static DEFAULT_CITY_DISPLAY_NAME = "Miami"

    static DEFAULT_LEADERBOARD_FILTERS = {
        types: "restaurant",
        city: Consts.DEFAULT_CITY,
        setting: "both",
        priceLevel: 0,
        ratedBy: "all",
        maxPriceLevel:1
    };

    static DEFAULT_REGION = {
        latitude: 25.766911,
        longitude: -80.201676,
        latitudeDelta: 0.06,
        longitudeDelta: 0.06,
    };

    static STORAGE_KEYS = {
        ACCESS_TOKEN_KEY: "0",
    };

    static SCREENS = {
        SPLASH: Splash,
        LOG_IN: Login,
        USER_CONFIRM_DETAILS: UserConfirmDetails,
        MAIN: Main,
        DASHBOARD: Dashboard,
        PLACE_DETAILS: PlaceDetails,
        PLACE_ADD_POP_UP: PlaceAddPopUp,
        SEARCH_SCREEN: SearchScreen,
        FILTER_SCREEN: FilterScreen,
    };

    static SCREEN_TITLES = {
        SPLASH: "Splash",
        LOG_IN: "Login",
        USER_CONFIRM_DETAILS: "UserConfirmDetails",
        MAIN: "Main",
        DASHBOARD: "Dashboard",
        PLACE_DETAILS: "PlaceDetails",
        PLACE_ADD_POP_UP: "PlaceAddPopUp",
        SEARCH_SCREEN: "SearchScreen",
        FILTER_SCREEN: "FilterScreen"
    };

    static KEYS = {
        // This is the new key. Belongs to atmayfair@gmail.com
        // GOOGLE_API_KEY: "AIzaSyCZSiIcUdMKgD6LZ0P7S7kgOA12U4A31d8",
        GOOGLE_API_KEY: "AIzaSyASI8vI91mLFkRr_OjGKooY2uXOrEuOEv8",


        // Down below is the old key belongs to abundavia@gmail.com
        // GOOGLE_API_KEY: "AIzaSyBE1gCW9Ai1LJXcEfHal9mu8DYK8QycoCo",
    };

    static API_URLS = {
        GOOGLE_PHOTO_API_BASE: "https://maps.googleapis.com/maps/api/place/photo?",
        GOOGLE_SEARCH_API_BASE: "https://maps.googleapis.com/maps/api/place/details/json?",
        FACEBOOK_URL: {
            parameters: {
                fields: {
                    string: 'email,name,picture.redirect(false).type(large),location,hometown,friends.limit(5000)'
                }
            },
        },

    };


    //staging
    //static BACKEND_BASE = "http://top7apistaging.innovify.com/top7backend/";

    //Live
    static BACKEND_BASE = "http://api.top7.guide/top7backend/";

    //dev
    // static BACKEND_BASE = "http://top7api.innovify.com/top7backend/";

    static GA_KEY = 'UA-42396538-5';//UA-101876038-1


    static  BACKEND = {
        CLIENT_KEY: "d2VidWk6d2VidWlzZWNyZXQ=",

        OAUTH_ACCESS_TOKEN: Consts.BACKEND_BASE + "oauth/token?username=top7backendadmin&password=inno@top7backendadmin&grant_type=password",

        SYNC_USER_INFO: Consts.BACKEND_BASE + "api/syncuserinfo",
        UPDATE_USER_INFO: Consts.BACKEND_BASE + "api/updateuser",
        GET_ALL_CITY: Consts.BACKEND_BASE + "api/getallcity",
        // LEADERBOARD: Consts.BACKEND_BASE + "api/leaderBoard",
        // LEADERBOARD: Consts.BACKEND_BASE + "api/v2/leaderBoard",
        LEADERBOARD: Consts.BACKEND_BASE + "api/v3/leaderBoard",
        FRIENDS_RANK: Consts.BACKEND_BASE + "api/friendsrank",
        PLACE_DETAILS: Consts.BACKEND_BASE + "api/getplacedetails",
        USER_PREFRENCE: Consts.BACKEND_BASE + "api/getUserPreference",

    };

      static PLACE_COUNT = [
           {
              value: 3
            }, {
              value: 7
            }, {
              value: 10
            }
          ];

      static PLACE_CITY = [{
          value: 'Miami'
        }, {
          value: 'New York'
        }, {
          value: 'Los Angeles'
        }
      ];

      static TYPES = [
        {
          value: 'Restaurants'
          }, {
            value: 'Clubs'
          }, {
            value: 'Bar Scene'
          }
        ];

    static GUEST_USER = {
        "isGuest": "true",
        "id": "guestUser",
        "name": "Guest User",
        "picture": {
            "data": {
                "is_silhouette": true,
                "url": "https://scontent.xx.fbcdn.net/v/t1.0-1/s200x200/10354686_10150004552801856_220367501106153455_n.jpg?oh=8eba33d5cd9b44273f78c1511e2d6359&oe=59D7DD50"
            }
        },
        "status": null,
        "city": null,
        "gender": null,
        "dateOfBirth": null,
        "lists": null,
        "friendsList": null,
        "expert": false
    };


    /**
     * This little function returns just the 'th' string :P
     *
     */
    static getTHString = (number) => {
        switch (number) {
            case 1:
                return "st";
                break;
            case 2:
                return "nd";
                break;
            case 3:
                return "rd";
                break;
            default:
                return "th";
                break;
        }
    };

    static analyticEvent = {
        "clickEvent":"click",

        "showMapEvent": "showMap",
        "mapViewLabel": "Map View on Dashboard",

        "showListEvent": "showList",
        "listViewLabel": {
            "label":"List View on Dashboard"
        },

        "leftSideBarEvent": "OpenFilter",
        "showSideBarLabel": {
            "label":"OpenFilter"
        },

        "applyFilterEvent":"applyFilter",
        "applyFilterLabel":{
            "label":"Filter Applied"
        },

        "rightSideBarEvent": "UserProfile",
        "showRightSideBarLabel":{
            "label":"User's Top7 List"
        },

        "searchClickEvent":"search",
        "searchEventLabel":{
            "label":"Search place"
        },

        "wrongSearchEvent":"wrong place and type search",
        "wrongSearchLabel":{
            "label":"This wrong place Search = "
        },

        "searchFromDBEvent":"SearchFromDB",
        "searchFromDBLabel":{
            "label":"Place Search from the Database = "
        },

        "searchDirectEvent":"SearchDirect",
        "searchDirectLabel":{
            "label":"Place Search Direct From Google = "
        },

        "showPlaceDetailsEvent":"PlaceDetailView",
        "showPlaceDetailsLabel":{
            "label":"Show Place Detail View from Leader board of = "
        },
        "showPlaceDetailSearchLabel":{
            "label":"Show Place Detail View from Search of = "
        },

        "addPlaceInListEvent":" AddPlaceInList",
        "addPlaceInListLabel":{
            "label":"Place add In List = "
        },

        "updatePlaceInListEvent":"UpdatePlaceInList",
        "updatePlaceInListLabel":{
            "label":"Place update in List = "
        },

        "updateListEvent":"listUpdate",
        "updateListLabel":{
            "label":"List Update"
        },

        "deletePlaceEvent":"deletePlace",
        "deletePlaceLabel":{
            "label":"Place Delete from the list ="
        },

        "loginButtonEvent":"loginButton",
        "loginButtonLabel":{
            "label":"User Click on login Button"
        },

        "loginSkipEvent":"skipLogin",
        "loginSkipLabel":{
            "label":"User Click on Skip Login"
        },

        "loginEvent":"Login",
        "loginLabel":{
            "label":"User Login in system"
        },

        "openMapEvent":"openMapFromPlaceDetail",
        "openMapLabel":{
            "label":"User Redirect on Map"
        },
    }
}
