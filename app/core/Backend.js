import Consts from "../consts/Consts";
import Memory from "../core/Memory";
import {AsyncStorage} from "react-native";

export default class Backend {


    /**
     * Calls the /syncuserinfo api of the backend.
     * Called when the user loads the app initially
     * Synchronizes the data of the user received from Facebook with backend.
     * Calls any callback function on successful synchronization of data.
     * @param callback
     * @param args
     */
    static syncUserInfo = (callback, ...args) => {
        console.log("SYNC USER INFO");
        console.log(JSON.stringify(Memory().userObject));
        fetch(Consts.BACKEND.SYNC_USER_INFO, {
            method: "post",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "bearer " + Memory().oAuth.access_token
            },
            body: JSON.stringify(Memory().userObject)
        }).then((response) => {
            if (response.status === 200) {
                return response;
            } else {
                return new Error(response.statusText)
            }
        }).then((response) => {
            //console.log(JSON.stringify(response));


            //console.log(JSON.stringify(response.json()));
            // Is something wrong with access token?
            // if something is wrong with the access token then the response
            // object will be empty
            if (response instanceof Error || Object.keys(response).length === 0) {
                // Yes. Something wrong with access token,
                // Get a new one and attempt to update the information again
                AsyncStorage.removeItem(Consts.STORAGE_KEYS.ACCESS_TOKEN_KEY);
                Backend.getBackendAccessToken(Backend.syncUserInfo, callback, ...args);
            } else {
                // Access token is good! resolve the promise
                return response.json();
            }
        }).then((response) => {
            Memory().userObject = response.user;
            // console.log("Received first time::: "+JSON.stringify(Memory().userObject));
            callback(response.userNew, ...args);
        }).catch((data) => {
            console.log(data);
        });
    };

    static getPhotoUrl = (refrence) =>{
        console.log("GET CALL FOR PHOTO URL");
        let apicall = Consts.API_URLS.GOOGLE_PHOTO_API_BASE + "maxwidth=400&photoreference=" + refrence + "&key=" +
            Consts.KEYS.GOOGLE_API_KEY;
        fetch(apicall, {
            method: "get",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "bearer " + Memory().oAuth.access_token
            },
            // body: JSON.stringify(Memory().commonRequest)
        }).then((response) => {
            if (response.status === 200) {
                return response.url;
            } else {
                return new Error(response.statusText)
            }
        })
    }



    /**
     * Update the user information to the backend.
     * This function is called
     *  1. When the onPress of ok button
     *  2. When the user removes the place
     * calls the /updateuserinfo api endpoint of the API
     */
    static updateUserInformation = (callback, ...args) => {
        console.log(":::: COMMON REQUEST ::::")
        console.log(JSON.stringify(Memory().commonRequest))
        if(Memory().commonRequest.place.priceLevel == '' || Memory().commonRequest.place.priceLevel == null){
          Memory().commonRequest.place.priceLevel = 0;
        }
        // console.log("UPDATE USER INFO");
        // console.log(callback);
        // console.log(args);
        fetch(Consts.BACKEND.UPDATE_USER_INFO, {
            method: "post",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "bearer " + Memory().oAuth.access_token
            },
            body: JSON.stringify(Memory().commonRequest)
        }).then((response) => {
            // console.log("Update URL:   "+Consts.BACKEND.UPDATE_USER_INFO);
            // console.log("Update JSON:   "+JSON.stringify(Memory().commonRequest));
            // console.log("Update RESPONSE:   "+JSON.stringify(response));
            if (response.status === 200) {
                return response;
            } else {
                return new Error(response.statusText)
            }
        }).then((response) => {
            // Is something wrong with access token?
            // if something is wrong with the access token then the response
            // object will be empty
            if (response instanceof Error || Object.keys(response).length === 0) {
                // Yes. Something wrong with access token,
                // Get a new one and attempt to update the information again
                AsyncStorage.removeItem(Consts.STORAGE_KEYS.ACCESS_TOKEN_KEY);
                Backend.getBackendAccessToken(Backend.updateUserInformation, callback, ...args);
            } else {
                // Access token is good! resolve the promise
                return response.json();
            }
        }).then((response) => {
            if (response) {
                if(response.responseStatus === true){
                  // console.log("SUCCESS RESULT UPDATE USER INFO");
                  // console.log(JSON.stringify(response.userDetails));
                    Memory().userObject = response.userDetails;
                }
                callback(...args);
            } else {
                // TODO: What if there are errors in the server and the user information is
                // not saved ?
            }
        }).catch((data) => {
            console.warn(data);
        });
    };


    static getBackendAccessToken = (callback, ...args) => {
        AsyncStorage.getItem(Consts.STORAGE_KEYS.ACCESS_TOKEN_KEY, (error, data) => {
            // Do we have any backend access token saved in the database?
            if (!error && data) {
                // Yes we do have the access token saved in database
                // Save that access token in memory and execute the callback
                // No need to make the network call to backend to get a new token
                Memory().oAuth = (JSON.parse(data));
                //Do we have any callback to execute?
                if (callback) {
                    //Yes We do!
                    callback(...args);
                }
            } else {
                // Nope. We do not have access token saved or we have some error.
                // Get the new access token altogether from backend
                fetch(Consts.BACKEND.OAUTH_ACCESS_TOKEN, {
                    method: "post",
                    headers: {
                        "Authorization": "Basic " + Consts.BACKEND.CLIENT_KEY
                    },
                }).then((response) => {
                    if (response.status === 200) {
                        return response;
                    } else {
                        return new Error(response.statusText)
                    }
                }).then((response) => {
                    return response.json();
                }).then((response) => {
                    Memory().oAuth = response;
                    AsyncStorage.setItem(Consts.STORAGE_KEYS.ACCESS_TOKEN_KEY, JSON.stringify(response));
                    //Do we have any callback to execute?
                    if (callback) {
                        //Yes We do!
                        callback(...args);
                    }
                }).catch((data) => {
                    console.log(data);
                })
            }
        });
    };

    static getUserPrefrence(callback, ...args) {
      // console.log("getUserPrefrence=====>");
        let apicall = Consts.BACKEND.USER_PREFRENCE + "?userId=" + Memory().userObject.id + "&macId="+Memory().userIp
        // console.log("apicall===> "+ apicall);
        fetch(apicall, {
            method: "get",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "bearer " + Memory().oAuth.access_token
            },
        }).then((response) => {
            if (response.status === 200) {
                return response;
            } else {
                return new Error(response.statusText)
            }
        }).then((response) => {
            // Is something wrong with access token?
            // if something is wrong with the access token then the response
            // object will be empty
            if (response instanceof Error || Object.keys(response).length === 0) {
                // Yes. Something wrong with access token,
                // Get a new one and attempt to update the information again
                AsyncStorage.removeItem(Consts.STORAGE_KEYS.ACCESS_TOKEN_KEY);
                Backend.getBackendAccessToken(Backend.getUserPrefrence, callback, ...args);
            } else {
                // Access token is good! resolve the promise
                return response.json();
            }
        }).then((response) => {
            if (response) {
                Memory().userPrefrence = response.userPreferenceList;
                if (callback)
                    callback(...args);
            }
        }).catch((data) => {
            console.warn(data);
        });
    };

    static getAllCity(callback, ...args) {
      // console.log("getAllCity =====>");
        fetch(Consts.BACKEND.GET_ALL_CITY, {
            method: "get",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "bearer " + Memory().oAuth.access_token
            },
        }).then((response) => {
            if (response.status === 200) {
                return response;
            } else {
                return new Error(response.statusText)
            }
        }).then((response) => {

            // Is something wrong with access token?
            // if something is wrong with the access token then the response
            // object will be empty
            if (response instanceof Error || Object.keys(response).length === 0) {
                // Yes. Something wrong with access token,
                // Get a new one and attempt to update the information again
                AsyncStorage.removeItem(Consts.STORAGE_KEYS.ACCESS_TOKEN_KEY);
                Backend.getBackendAccessToken(Backend.getAllCity, callback, ...args);
            } else {
                // Access token is good! resolve the promise
                return response.json();
            }
        }).then((response) => {
            if (response) {
                // console.log(JSON.stringify(response));
                Memory().allCities = response;
                Memory().allCities.map((value, key) => {
                    if (value.city === Consts.DEFAULT_CITY) {
                        Memory().currentCity = value;
                    }
                });
                if (callback)
                    callback(...args);
            }
        }).catch((data) => {
            console.warn(data);
        });
    };


    static getLeaderBoard(callback, ...args) {
      console.log(":::: LEADER BOARD CALL :::: ");
      if(Memory().leaderBoardFilters.types == "Bar Scene"){
        Memory().leaderBoardFilters.types = "bar";
      }
      if(Memory().leaderBoardFilters.types == "Restaurants"){
        Memory().leaderBoardFilters.types = "restaurant";
      }
      if(Memory().leaderBoardFilters.types == "Clubs"){
        Memory().leaderBoardFilters.types = "club";
      }

      if(Memory().leaderBoardFilters.city == "Miami"){
        Memory().leaderBoardFilters.city = "Miami-Dade County";
      }
      if(Memory().leaderBoardFilters.city == "New York"){
        Memory().leaderBoardFilters.city = "New York County";
      }
      if(Memory().leaderBoardFilters.city == "Los Angeles"){
        Memory().leaderBoardFilters.city = "Los Angeles County";
      }

      // For set default current city
      Memory().allCities.map((value, key) => {
          if (value.city === Memory().leaderBoardFilters.city) {
              Memory().currentCity = value;
          }
      });

    fetch(Consts.BACKEND.LEADERBOARD, {
            method: "post",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "bearer " + Memory().oAuth.access_token
            },
            body: JSON.stringify(Memory().leaderBoardFilters)
        }).then((response) => {
            if (response.status === 200) {
                return response;
            } else {
                return new Error(response.statusText)
            }
        }).then((response) => {

            // Is something wrong with access token?
            // if something is wrong with the access token then the response
            // object will be empty
            if (response instanceof Error || Object.keys(response).length === 0) {
                // Yes. Something wrong with access token,
                // Get a new one and attempt to update the information again
                AsyncStorage.removeItem(Consts.STORAGE_KEYS.ACCESS_TOKEN_KEY);
                Backend.getBackendAccessToken(Backend.getLeaderBoard, callback, ...args);
            } else {
                // Access token is good! resolve the promise
                return response.json();
            }
        }).then((response) => {
          // console.log("LEADER BOARD RESPONSE");
          // console.log(JSON.stringify(response));
            if (response) {
                Memory().leaderboard = response;
                Memory().markers = [];
                response.map((value, key) => {
                    let string = 'http';
                    let icon;
                    if(value.googlePhotoRef.indexOf(string) === -1){
                        icon = Consts.API_URLS.GOOGLE_PHOTO_API_BASE +
                            "maxwidth=400&photoreference=" +
                            value.googlePhotoRef +
                            "&key=" +
                            Consts.KEYS.GOOGLE_API_KEY;
                    }else{
                        icon = value.googlePhotoRef;
                    }
                    // console.log(":::: VALUE OF GOOGLE ::::")
                    // console.log(JSON.stringify(value))
                    Memory().markers[parseInt(key)] = {
                        id: value.id,
                        priceLevel: value.priceLevel,
                        icon: {uri:icon},
                        name: value.name,
			                  phoneNumber:value.phoneNumber,
                        number: parseInt(key + 1),
                        type: value.types[0],
                        location: {
                            city: value.location.city,
                            state: value.location.state,
                            country: value.location.country
                        },
                        coordinate: {
                            latitude: parseFloat(value.location.cityLatitude),
                            longitude: parseFloat(value.location.cityLongitude),
                            latitudeDelta: parseFloat(Memory().currentCity.zoomingIndex),
                            longitudeDelta: parseFloat(Memory().currentCity.zoomingIndex),
                        },
                        reviews: [],
                        rating: value.rating
                    }
                });
                // console.log(":::: LEADER BOARD MARKER OBJECT ::::")
                // console.log(JSON.stringify(Memory().markers));
                if (callback) callback(...args);
            }
        }).catch((data) => {
            console.warn(data);
        });

    }


    static getReviews(placeid, callback) {
        fetch(Consts.API_URLS.GOOGLE_SEARCH_API_BASE + "placeid=" + placeid + "&key=" + Consts.KEYS.GOOGLE_API_KEY, {
            method: "get",
        }).then((response) => {
            if (response.status === 200) {
                return response;
            } else {
                return new Error(response.statusText);
            }
        }).then((response) => {
            if (!(response instanceof Error)) {
                return response.json();
            } else {
                console.log("ERROR: " + JSON.stringify(response));
            }
        }).then((response) => {
            //Create the review array.
            let reviews = [];
            for (let i = 0; i < response.result.reviews.length; i++) {
                let review = response.result.reviews[i];
                reviews.push({
                    author_name: review.author_name,
                    profile_photo_url: review.profile_photo_url,
                    text: review.text
                });
            }

            callback(reviews);
        }).catch((error) => {
            console.log(JSON.stringify(error));
        })
    }


    static getFriendsRank(req, callback, ...args) {
        fetch(Consts.BACKEND.FRIENDS_RANK, {
            method: "post",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "bearer " + Memory().oAuth.access_token
            },
            body: JSON.stringify(req)
        }).then((response) => {
            if (response.status === 200) {
                return response;
            } else {
                return new Error(response.statusText);
            }
        }).then((response) => {
            // Is something wrong with access token?
            // if something is wrong with the access token then the response
            // object will be empty
            if (response instanceof Error || Object.keys(response).length === 0) {
                // Yes. Something wrong with access token,
                // Get a new one and attempt to update the information again
                AsyncStorage.removeItem(Consts.STORAGE_KEYS.ACCESS_TOKEN_KEY);
                Backend.getBackendAccessToken(Backend.getFriendsRank, req, callback, ...args);
            } else {
                // Access token is good! resolve the promise
                return response.json();
            }
        }).then((response) => {
            callback(response, ...args);
        }).catch((error) => {

            console.log(JSON.stringify(error));
        })
    }


    static getPlaceDetails(placeID, callback, ...args) {
        fetch(Consts.BACKEND.PLACE_DETAILS, {
            method: "post",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "bearer " + Memory().oAuth.access_token
            },
            body: JSON.stringify({id: placeID})
        }).then((response) => {
            if (response.status === 200) {
                return response;
            } else {
                return new Error(response.statusText);
            }
        }).then((response) => {
            // console.log('GOOGLE SEARCH ERROR');
            // Is something wrong with access token?
            // if something is wrong with the access token then the response
            // object will be empty
            if (response instanceof Error || Object.keys(response).length === 0) {
                // console.log('GOOGLE SEARCH ERROR ::1');
                // Yes. Something wrong with access token,
                // Get a new one and attempt to update the information again
                AsyncStorage.removeItem(Consts.STORAGE_KEYS.ACCESS_TOKEN_KEY);
                Backend.getBackendAccessToken(Backend.getPlaceDetails, placeID, callback, ...args);
            } else {
                // console.log('ACCESS TOKEN IS GOOD');
                // Access token is good! resolve the promise
                // console.log(response);
                return response.json();
            }
        }).then((response) => {
            // console.log('CALL BACK PART');
            // console.log(response);
            // console.log('GOOGLE SEARCH ERROR');
            callback(response, ...args);
        }).catch((error) => {
            console.log(JSON.stringify(error));
        })
    }
}
