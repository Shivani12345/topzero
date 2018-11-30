import React, { Component } from "react";

import {
  Dimensions,
  Image,
  PanResponder,
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
  ScrollView
} from "react-native";
import Memory from "../core/Memory";
import Backend from "../core/Backend";

import Consts from "../consts/Consts";
import {
  GoogleAnalyticsTracker,
  GoogleAnalyticsSettings,
  GoogleTagManager
} from "react-native-google-analytics-bridge";

const { height } = Dimensions.get("window");

let movedPlaceList = [];

export default class PlaceAddPopUp extends Component {
  static navigationOptions = {
    gesturesEnabled: false,
    header: null
  };

  constructor(props) {
    super(props);
    // The view which will be dragged
    this.currentPlace = null;

    this.allPlaces = [];

    // The index of the object in the lists array.
    this.listIndex = -1;

    // The array index of the place in the list.
    this.placeIndex = -1;

    // Whether the user has already dropped the place or not
    this.currentPlaceDropped = false;

    // In memory place holder for the place array on which the changes are to be made
    this.tempPlaceArray = null;

    this.tempUserObject = JSON.parse(JSON.stringify(Memory().userObject));

    this.listPlaceObject = null;
    this.listPlaceIndex = null;

    this.tempFontStyle = { color: "black" };

    this.currentViewProps = {
      style: {
        top: 0,
        zIndex: 1
      }
    };
    this.params = props.navigation.state.params;

    if (this.params.isAdded !== null) {
      this.currentPlaceDropped = true;
    }
    this.tracker = new GoogleAnalyticsTracker(Consts.GA_KEY);
  }

  /**
     * Hide the popUp.
     * This function is called as the onPress on back button
     */
  hidePopUp = () => {
    this.props.navigation.goBack();
  };

  async googlePhoto(refrence) {
    console.log("MY FUN ");
    let string = "http";
    if (refrence.indexOf(string) === -1) {
      let apicall =
        Consts.API_URLS.GOOGLE_PHOTO_API_BASE +
        "maxwidth=400&photoreference=" +
        refrence +
        "&key=" +
        Consts.KEYS.GOOGLE_API_KEY;
      // let response = await axios.get(apicall);

      console.log("==== response axios ====");
      console.log(response);
      if (response.status === 200) {
        // ("Temp:");
        // console.log(JSON.stringify(this.tempUserObject));console.log
        Memory().userObject = this.tempUserObject;
        // console.log("memory:");
        // console.log(JSON.stringify(Memory().userObject));

        let numberRated;
        let weightedRating;

        if (Memory().userObject.expert) {
          numberRated = "numberOfExpertRated";
          weightedRating = "expertTotalWeightedRating";
        } else {
          numberRated = "numberOfUserRated";
          weightedRating = "userTotalWeightedRating";
        }

        let number;
        if (this.params.isAdded) {
          number = 0;
        } else {
          number = 1;
        }

        Memory().commonRequest = {
          userDetails: Memory().userObject,
          place: {
            id: this.params.markerObject.id,
            name: this.params.markerObject.name,
            types: [this.params.markerObject.type],
            phoneNumber: this.params.markerObject.phoneNumber,
            setting: "both",
            googlePhotoRef: response.url,
            priceLevel: this.params.markerObject.priceLevel != null ? this.params.markerObject.priceLevel : 0,
            location: {
              city: this.params.markerObject.location.city,
              state: this.params.markerObject.location.state,
              country: this.params.markerObject.location.country,
              cityLatitude: this.params.markerObject.coordinate.latitude,
              cityLongitude: this.params.markerObject.coordinate.longitude,
              zoomingIndex: Memory().currentCity.zoomingIndex
            },

            rating: this.params.markerObject.rating,
            [numberRated]: number,
            [weightedRating]: 10 - this.placeIndex
          }
        };

        console.log("COMMON REQUEST ");
        console.log(JSON.stringify(Memory().commonRequest));

        Backend.updateUserInformation(() => {
          this.setLoadingTextViewVisibility(false);
          this.props.navigation.state.params.onGoBack();
          this.props.navigation.goBack();
        });
      }
    } else {
      // ("Temp:");
      // console.log(JSON.stringify(this.tempUserObject));console.log
      Memory().userObject = this.tempUserObject;
      // console.log("memory:");
      // console.log(JSON.stringify(Memory().userObject));

      let numberRated;
      let weightedRating;

      if (Memory().userObject.expert) {
        numberRated = "numberOfExpertRated";
        weightedRating = "expertTotalWeightedRating";
      } else {
        numberRated = "numberOfUserRated";
        weightedRating = "userTotalWeightedRating";
      }

      let number;
      if (this.params.isAdded) {
        number = 0;
      } else {
        number = 1;
      }

      Memory().commonRequest = {
        userDetails: Memory().userObject,
        place: {
          id: this.params.markerObject.id,
          name: this.params.markerObject.name,
          types: [this.params.markerObject.type],
          phoneNumber: this.params.markerObject.phoneNumber,
          setting: "both",
          googlePhotoRef: refrence,
          priceLevel: this.params.markerObject.priceLevel != null ? this.params.markerObject.priceLevel : 0,
          location: {
            city: this.params.markerObject.location.city,
            state: this.params.markerObject.location.state,
            country: this.params.markerObject.location.country,
            cityLatitude: this.params.markerObject.coordinate.latitude,
            cityLongitude: this.params.markerObject.coordinate.longitude,
            zoomingIndex: Memory().currentCity.zoomingIndex
          },

          rating: this.params.markerObject.rating,
          [numberRated]: number,
          [weightedRating]: 10 - this.placeIndex
        }
      };

      console.log("COMMON REQUEST ");
      console.log(JSON.stringify(Memory().commonRequest));

      Backend.updateUserInformation(() => {
        this.setLoadingTextViewVisibility(false);
        this.props.navigation.state.params.onGoBack();
        this.props.navigation.goBack();
      });
    }
  }

  /**
   * Function used to create a new list of UserPlaces includes GoogleImageReference
   * @param isVisible
   */
  createListButtonPressed = () => {
    console.log("CREATE BUTTON PRESSED ");
    this.setLoadingTextViewVisibility(true);

    Memory().updateLeaderboard = true;

    let url = this.params.markerObject.icon.uri;
    let index = url.indexOf("photoreference=") + "photoreference=".length;
    let end = url.indexOf("&key=");

    let reference = url.substring(index, end);

    // ("Temp:");
    // console.log(JSON.stringify(this.tempUserObject));console.log
    Memory().userObject = this.tempUserObject;
    // console.log("memory:");
    // console.log(JSON.stringify(Memory().userObject));

    let numberRated;
    let weightedRating;

    if (Memory().userObject.expert) {
      numberRated = "numberOfExpertRated";
      weightedRating = "expertTotalWeightedRating";
    } else {
      numberRated = "numberOfUserRated";
      weightedRating = "userTotalWeightedRating";
    }

    let number;
    if (this.params.isAdded) {
      number = 0;
    } else {
      number = 1;
    }

    console.log("::::: CREATE LIST :::::")

    Memory().commonRequest = {
      userDetails: Memory().userObject,
      place: {
        id: this.params.markerObject.id,
        name: this.params.markerObject.name,
        types: [this.params.markerObject.type],
        phoneNumber: this.params.markerObject.phoneNumber,
        setting: "both",
        googlePhotoRef: reference,
        priceLevel: this.params.markerObject.priceLevel != null ? this.params.markerObject.priceLevel : 0,
        location: {
          city: this.params.markerObject.location.city,
          state: this.params.markerObject.location.state,
          country: this.params.markerObject.location.country,
          cityLatitude: this.params.markerObject.coordinate.latitude,
          cityLongitude: this.params.markerObject.coordinate.longitude,
          zoomingIndex: Memory().currentCity.zoomingIndex
        },
        rating: this.params.markerObject.rating,
        [numberRated]: number,
        [weightedRating]: 10 - this.placeIndex
      }
    };

    console.log(JSON.stringify(Memory().commonRequest));

    Backend.updateUserInformation(() => {
      this.setLoadingTextViewVisibility(false);
      this.props.navigation.state.params.onGoBack();
      this.props.navigation.navigate(Consts.SCREEN_TITLES.DASHBOARD);
      // this.props.navigation.goBack();
    });
  };

  /**
     * Function used to edit a list of UserPlaces excludes GoogleImageReference
     * @param isVisible
     */
  editListButtonPressed = () => {
    console.log("CHECK STATES FOR UPDATE PLACES ");
    console.log(JSON.stringify(this.state));
    console.log("EDIT BUTTON PRESSED ");
    this.setLoadingTextViewVisibility(true);

    Memory().updateLeaderboard = true;

    // ("Temp:");
    // console.log(JSON.stringify(this.tempUserObject));
    Memory().userObject = this.tempUserObject;
    // console.log("memory:");
    // console.log(JSON.stringify(Memory().userObject));

    let numberRated;
    let weightedRating;

    if (Memory().userObject.expert) {
      numberRated = "numberOfExpertRated";
      weightedRating = "expertTotalWeightedRating";
    } else {
      numberRated = "numberOfUserRated";
      weightedRating = "userTotalWeightedRating";
    }

    let number;
    if (this.params.isAdded) {
      number = 0;
    } else {
      number = 1;
    }

    console.log(" EDIT UPDATE ID" + this.params.markerObject.id);
    console.log(" EDIT UPDATE NAME" + this.params.markerObject.name);

    console.log(JSON.stringify(Memory().userObject));

    Memory().commonRequest = {
      userDetails: Memory().userObject,
      place: {
        id: movedPlaceList.id,//this.params.markerObject.id,
        name: movedPlaceList.name,//this.params.markerObject.name,
        types: [this.params.markerObject.type],
        phoneNumber: this.params.markerObject.phoneNumber,
        setting: "both",
        // priceLevel: this.params.markerObject.priceLevel != null ? this.params.markerObject.priceLevel : 0,
        priceLevel: movedPlaceList.priceLevel != null ? movedPlaceList.priceLevel : 0,
        location: {
          city: this.params.markerObject.location.city,
          state: this.params.markerObject.location.state,
          country: this.params.markerObject.location.country,
          zoomingIndex: Memory().currentCity.zoomingIndex
        },
        rating: this.params.markerObject.rating,
        [numberRated]: number,
        [weightedRating]: 10 - this.placeIndex
      }
    };

    console.log(" EDIT UPDATE " + JSON.stringify(Memory().commonRequest));

    Backend.updateUserInformation(() => {
      this.setLoadingTextViewVisibility(false);
      this.props.navigation.state.params.onGoBack();
      this.props.navigation.navigate(Consts.SCREEN_TITLES.DASHBOARD);
      // this.props.navigation.goBack();
    });
  };

  /**
     * Helper function to hide or show the loading text view.
     * The loading text for current screen is 'synchronizing...'
     * @param isVisible
     */
  setLoadingTextViewVisibility = isVisible => {
    this.loadingText.setNativeProps({
      style: {
        bottom: isVisible ? 12 : -100,
        elevation: 20
      }
    });
  };

  /**
     * Once the user drops the place, push down the places according to the logic
     * The places should be pushed down until an empty location is found or to the end.
     * If no empty location is found, the last element from the list will be removed.
     */
     dropReleased = () => {
       // The placeIndex will be -1 if the place is not currentPlaceDropped anywhere.
       // No need to execute the function in that case.
       // Just return!
       if (this.placeIndex < 0) return;

       // console.log("Previous Index: " + this.listPlaceIndex + ", New Index: " + this.placeIndex);

       let temp = this.tempPlaceArray.reverse();

       let t; // temporary var
       let index = this.placeIndex;
       //let newPlace = {id: this.params.markerObject.id, name: this.params.markerObject.name};
       console.log("DROP RELEASED");
       let newPlace = this.listPlaceObject;

       console.log(":: listPlaceIndex :: ");
       console.log(this.listPlaceIndex);

       console.log("::: placeIndex :::");
       console.log(index);

       console.log(":: CHECK INDEX ::");
       console.log(temp)

       console.log("::::: temp[index] :::::");
       console.log(temp[index]);

       console.log("this.listPlaceIndex");
       console.log(this.listPlaceIndex);
       if (
         this.listPlaceIndex !== null &&
         this.listPlaceIndex !== this.placeIndex
       // ||
       // temp[this.placeIndex] !== null

       ) {
         temp[this.listPlaceIndex] = { id: null, name: null };
       }

      /*
        Manage when place is new
      */
       if(this.listPlaceIndex === null){
         while (
           index !== this.listPlaceIndex &&
           index < temp.length &&
           temp[index].id
         ) {
           t = temp[index];
           temp[index] = newPlace;
           newPlace = t;
           index++;
         }
       }

       /*
        The following while loop 'pushes' the elements down
        till the end of the array or till it finds an empty location
        */
        if(this.listPlaceIndex > index){
          while (
            index !== this.listPlaceIndex &&
            index < temp.length &&
            temp[index].id
          ) {
            t = temp[index];
            temp[index] = newPlace;
            newPlace = t;
            index++;
          }
        }
        /*
         The following while loop 'pushes' the elements up
         till the end of the array or till it finds an empty location
         */
        if(this.listPlaceIndex < index){
          while (
            index !== this.listPlaceIndex &&
            index < temp.length &&
            temp[index].id
          ) {
            t = temp[index];
            temp[index] = newPlace;
            newPlace = t;
            index--;
          }
        }

        temp[index] = newPlace;

        // For update purpose we need place id and name
        movedPlaceList = temp[index];

       // Take the first three elements and add last three as empty
       // This needs to be done because we are adding 10 places in the user object
       temp = temp.splice(0, 7).concat([{},{},{}]);
       this.tempPlaceArray = temp.reverse();

       // Save the reversed temporary array.

       if (!this.tempUserObject.lists) {
         // console.log("Yeah. No more null pointer");
         this.tempUserObject.lists = [];
         this.tempUserObject.lists[this.listIndex] = this.getEmptyListObject(
           this.getListID()
         );
       }

       if (!this.tempUserObject.lists[this.listIndex]) {
         this.tempUserObject.lists[this.listIndex] = this.getEmptyListObject(
           this.getListID()
         );
       }
       this.tempUserObject.lists[this.listIndex].places = this.tempPlaceArray;

       // The place is now currentPlaceDropped. Update the state variables

       if (this.listPlaceIndex !== null) {
         console.log("::: LIST PLACE INDEX NOT NULL ");
         this.allPlaces[this.listPlaceIndex].setNativeProps({
           style: styles.userListPlaceNameContainerPopUp
         });
       } else {
         console.log("::: LIST PLACE INDEX NULL ");
         this.currentPlaceDropped = true;
         this.currentPlace.setNativeProps({
           style: {
             backgroundColor: "rgba(0,0,0,0)",
             zIndex: 1,
             borderBottomWidth: 0,
             position: "absolute"
           }
         });
       }

       this.tempFontStyle = { color: "black" };

       this.setState({});
     };

  /**
     * The component should follow the drag!
     * The method will set the decide the index of the object being dragged
     * @param event
     * @param gestureState
     */
  dragStarted = (event, gestureState) => {
    // y0 is the loaction where the touch started..
    // If the y0 is less than 30% of height, then the default selected place component is being moved.
    // Else, any component from list is being moved.
    // Is the component being moved is current selected place?

    let limit;
    if (this.currentPlaceDropped) {
      limit = 0.2 * height;
    } else {
      limit = 0.3 * height;
    }
    if (gestureState.y0 <= limit) {
      // Yes it it. Drag it.
      /*
             The list starts from the 30% of the height and then
             spans over the full height.
             Thus, the list is of 70% of height of whole screen
             Thus, each restaurant will be of 10% of height.
             Please note that due to margin of the component, the 10% height might not be exact.

             If the y is the height of current touch, then
             y = 30% of height + currentIndex * 10 % of height
             (the offset is 30% height)

             so, currentIndex = ( y - 30% of height ) / ( 10% of height )
             */
      let y = (gestureState.moveY - 0.3 * height) / (0.1 * height);
      if (y >= 0) {
        // index >=0 means the drag touch is in the list somewhere
        // set the top to follow the touch
        // added 7.25% of the height as offset so that the component almost
        // follows the drag
        this.currentViewProps.style.top = y * 0.1 * height + 0.075 * height;
        this.placeIndex = Math.floor(y);
      } else {
        // If the index is out of the list, then the current place should be on the
        // location. which is relative top = 0
        this.currentViewProps.style.top = 0;
        this.placeIndex = -1;
      }
      let priceLevel = this.params.markerObject.priceLevel != null ? this.params.markerObject.priceLevel : 0;
      this.listPlaceObject = {
        id: this.params.markerObject.id,
        name: this.params.markerObject.name,
        priceLevel: priceLevel
      };
      // setting the native props will kinda sorta refresh the view 'lightly'
      this.currentPlace.setNativeProps(this.currentViewProps);

      // Unsetting the set flag, if any
      this.listPlaceIndex = null;
    } else {
      // No it is a component from the list.
      // Index is the index of the component being moved
      // This is the index of the place which is being dragged
      let index;
      //The top value.
      let top;
      if (this.currentPlaceDropped) {
        index = parseInt((gestureState.y0 - 0.2 * height) / (0.1 * height));
        top = gestureState.moveY - 0.2 * height - 0.1 * index * height;
      } else {
        index = parseInt((gestureState.y0 - 0.3 * height) / (0.1 * height));
        top = gestureState.moveY - 0.3 * height - 0.1 * index * height;
      }

      // This is the gonna be new index for that place
      let newIndex = top / (0.1 * height);

      let newFinalIndex;
      // Is the place being dragged above its old position ?
      if (newIndex <= 0) {
        // Yes it is, take the ceil value
        newFinalIndex = Math.ceil(newIndex);

        //console.log("Index: " + newIndex + ", Refined: " + newFinalIndex);
      } else {
        // Nope. Keep taking floor value
        newFinalIndex = Math.floor(newIndex);
        //console.log("Index: " + newIndex + ", Refined: " + newFinalIndex);
      }
      let tempArr = this.tempPlaceArray.slice(3).reverse();
      this.listPlaceObject = {
        id: tempArr[index].id,
        name: tempArr[index].name,
        priceLevel: tempArr[index].priceLevel
      };
      this.listPlaceIndex = index;
      this.placeIndex = this.listPlaceIndex + newFinalIndex;

      this.allPlaces[index].setNativeProps({
        style: {
          top: top,
          backgroundColor: "rgba(0,0,0,0.4)",
          zIndex: 1,
          borderBottomWidth: 0
        }
      });
      this.tempFontStyle = { color: "black" };
    }
  };

  /**
     * Helper function to generate possible list id for the user.
     * list id = userID_city_state_country_type
     * @returns {string}
     */
  getListID = () => {
    return (
      this.tempUserObject.id +
      "_" +
      this.params.markerObject.location.city +
      "_" +
      // this.params.markerObject.location.state + "_" +
      // this.params.markerObject.location.country + "_" +
      this.params.markerObject.type
    );
  };

  /**
     * Helper function to create the empty list object with given id
     * The type and location of the object will be taken directly from the marker object
     */
  getEmptyListObject = listID => {
    let emptyArray = [];
    //Push 10 empty objects.
    // TODO: This is soon gonna be 7 :P
    for (let i = 0; i < 10; i++) {
      emptyArray.push({});
    }

    return {
      listID: listID,
      listType: this.params.markerObject.type,
      location: this.params.markerObject.location,
      places: emptyArray
    };
  };

  /**
     * Precompute the list information
     */
  precomputeListInformation = () => {
    console.log(":::::: PRE COMPUTE :::::: ");
    // getting the list id
    let listID = this.getListID();

    //console.log("List id is  "+listID);

    let found = false;
    let index = -1;

    for (
      let i = 0;
      this.tempUserObject.lists && i < this.tempUserObject.lists.length;
      i++
    ) {
      if (this.tempUserObject.lists[i].listID === listID) {
        found = true;
        index = i;
        break;
      }
    }

    // The list can not be found when
    // 1. The list array itself does not exist
    // 2. The list exists, but the list array does not have the object with same id
    if (!found) {
      // Taking care of the case where the list array itself not exists
      if (!this.tempUserObject.lists) {
        this.tempUserObject.lists = [];
      }

      // List array exists, but not the object with given id, so create it.
      this.tempUserObject.lists.push(this.getEmptyListObject(listID));

      //If the list is not found. Then the index would be the size - 1
      index = this.tempUserObject.lists.length - 1;
    }

    this.tempPlaceArray = this.tempUserObject.lists[index].places;
    this.listIndex = index;
  };

  /**
     * Sets up the dragging.
     */
  setUpDragging = () => {
    this.panResponder = PanResponder.create({
      onStartShouldSetPanResponder: (evt, gestureState) => true,
      onMoveShouldSetPanResponder: (evt, gestureState) => true,
      onPanResponderRelease: this.dropReleased,
      onPanResponderMove: this.dragStarted
    });
  };

  /**
     * Removes the place from the given index and sets it to
     * {id:null, name:null}
     * Then synchronizes the information with backend
     * @param index
     */
  removePlace = index => {
    this.tracker.trackEvent(
      Consts.analyticEvent.deletePlaceEvent,
      Consts.analyticEvent.clickEvent,
      Consts.analyticEvent.deletePlaceLabel
    );

    this.tempPlaceArray[this.tempPlaceArray.length - 1 - index] = {
      id: null,
      name: null
    };

    let isEmpty = true;

    // Let us check if all the places from this array has been removed
    // If all are empty, just delete that list
    for (let i in this.tempPlaceArray) {
      // The object can be empty if it is {}
      // or it is {id:null, name:null}
      // (Null Object pattern is looking batter and batter, eh?)
      let place = this.tempPlaceArray[i];
      if (
        Object.keys(place).length !== 0 &&
        (place.id !== null && place.name !== null)
      ) {
        // Yeah found one object that is not empty.
        // Set the flag and break the loop!
        isEmpty = false;
        break;
      }
    }

    // is the list empty?
    if (isEmpty) {
      // Yes the list is empty. Delete the list object from the user altogether
      // this.tempUserObject.lists.splice(this.listIndex, 1);
      // Does user have any more lists?
      // if (this.tempUserObject.lists.length === 0) {
      //     // Nope he does not. Delete the whole key of list.
      //     delete this.tempUserObject.lists;
      // }
    } else {
      // No the list has other elements, set the temp place array to the listIndex
      this.tempUserObject.lists[this.listIndex].places = this.tempPlaceArray;
    }
    this.setState({});
  };

  /**
     * Creates and returns the top bar with back and OK button
     */
  getTopBarView = () => {
    return (
      <View style={styles.topBarContainerPopUp}>
        {/*back button*/}
        <TouchableHighlight
          onPress={this.hidePopUp}
          underlayColor={"#c5b167"}
          style={styles.buttonContainerPopUp}
        >
          <Image
            style={styles.topBarIcon}
            source={require("../icons/back_with_white_bg.png")}
          />
        </TouchableHighlight>

        {/*ok button*/}

      </View>
    );
  };

  /**
     * Creates and returns the view used to display the name of list
     * The format is Top7 {type}S, {city}
     * @returns {XML}
     */
  getCurrentListNameView = () => {
    let type = this.params.markerObject.type;
    let cityName;
    let searchCity = this.params.markerObject.location.city
      ? this.params.markerObject.location.city
      : Memory().leaderBoardFilters.city;

    if (Memory().allCities) {
      for (let i = 0; i < Memory().allCities.length; i++) {
        if (Memory().allCities[i].city === searchCity) {
          cityName = Memory().allCities[i].displayCityName;
          break;
        }
      }
    } else {
      cityName = searchCity;
    }

    let typeName = type.charAt(0).toUpperCase() + type.slice(1);
    console.log("RRRRRRRRRRR ::::: "+typeName);
    if (typeName == "Bars" || typeName == "bars" || typeName == "Bar") {
      typeName = "Bar Scene";
    }

    return (
      <View style={styles.placeNameContainerPopUp}>
        <Text style={styles.placeNamePopUp}>
          {typeName}s in {cityName}
        </Text>
      </View>
    );
  };

  /**
     * Gets the current selected place if not dragged and currentPlaceDropped yet
     * @returns {XML}
     */
  getCurrentPlaceView = () => {
    if (!this.currentPlaceDropped && !this.params.isAdded) {
      return (
        <View
          ref={currentPlace => (this.currentPlace = currentPlace)}
          style={styles.currentPlaceContainerPopUp}
          {...this.panResponder.panHandlers}
        >
          <Image
            source={require("../icons/drag_black.png")}
            // style={styles.dragImageContainerPopUp}
          />
          <Text style={styles.dragPlaceNamePopUp}>
            {this.params.markerObject.name}
          </Text>
        </View>
      );
    }
  };

  /**
     * Creates and returns the view of the current list of the user
     * @returns {XML}
     */
     getCurrentListView = () => {
       /*
            The reverse is unnecessary but, There are only 7 places max.
            So it is okay. May be you want to do something about to increase the
            performance by a couple of milliseconds ?
            Slice(3) is to take the subset from 3 to array.length-1
            */
       let listView = this.tempPlaceArray
         .slice(3)
         .reverse()
         .map((value, key) => {
           let border = {};
           if (key === 0) {
             border = { borderTopWidth: 1 };
           }
           let name = value.id ? value.name : null;
           let view;
           if (name) {
             view = (
               <Image
                  {...this.panResponder.panHandlers}
                 key={key}
                 style={{ marginLeft: 5, marginRight: 10, width: 15, height: 15 }}
                 source={require("../icons/drag_white.png")}
               />
             );
           } else {
             view = (
               <View
                 style={{
                   marginLeft: 5,
                   marginRight: 10,
                   width: 15,
                   height: 15,
                   backgroundColor: "rgba(0,0,0,0)"
                 }}
               />
             );
           }

           return (
             <View
               ref={view => (this.allPlaces[parseInt(key)] = view)}
               key={key}
               style={[styles.userListPlaceNameContainerPopUp, border]}
             >
               {view}

            <View style={styles.placeRankContainerPopUp}>
              <Text style={styles.placeViewRankPopUp}>#{key + 1}</Text>
            </View>

               {name && (
                 <Text
                   {...this.panResponder.panHandlers}
                   numberOfLines={1}
                   style={[styles.userListPlaceNamePopUp, this.tempFontStyle]}
                 >
                   {name}
                 </Text>
               )}

               {name && (
                 <TouchableHighlight
                   underlayColor={"#c5b167"}
                   onPress={() => this.removePlace(key)}
                   style={styles.removePlacePopUp}
                 >
                   <Image source={require("../icons/close_white.png")} />
                 </TouchableHighlight>
               )}
             </View>
           );
         });
       return (
         <View style={{width:"100%",height:"100%",marginLeft:3,marginRight:3}}>
           <View style={[styles.userListsContainerPopUp, { zIndex: 3 }]}>
             {listView}
           </View>
           <View>
             <TouchableHighlight
              onPress={
                this.params.markerObject.hasOwnProperty("icon")
                  ? this.createListButtonPressed
                  : this.editListButtonPressed
              }
              underlayColor={"#c5b167"}
              style={styles.saveButtonPopUp}
            >
              {/*<Image style={styles.submitButtonPopUp}
                     source={require('../images/back1600.png')}/>*/}
              <Text style={styles.submitButtonPopUp}>SAVE</Text>
            </TouchableHighlight>
           </View>
         </View>
       );
     };

  /**
     * Creates and returns the view for the loading text.
     * This view is displayed when the user taps on the okay button
     */
  getLoadingTextView = () => {
    return (
      <View
        ref={loadingText => (this.loadingText = loadingText)}
        style={styles.loadingTextContainer}
      >
        <Text style={styles.loadingText}>Synchronizing...</Text>
      </View>
    );
  };

  componentWillMount() {
    console.log(":::: COMPONENT WILL MOUNT :::: ");
    // this.setUpPopUp();
    this.precomputeListInformation();
    this.setUpDragging();
  }

  render() {
    console.log("PopUp: Render called");

    return (
      <View
        // source={require("../icons/background_ivory.png")}
        style={styles.popUpContainer}
      >
        {/*The top bar for back and ok buttons*/}
        {this.getTopBarView()}

        {/*View to represent the current list name*/}
        {this.getCurrentListNameView()}

        {/*View for current place selected by the user to be added in the list*/}
        {this.getCurrentPlaceView()}

        {/*The view for the current top7 list of user*/}

        {this.getCurrentListView()}

        {/*The view for the loading text*/}
        {this.getLoadingTextView()}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  popUpContainer: {
    flex: 1,
    width: null,
    height: null,
    // resizeMode: "cover",
    alignItems: "center",
    backgroundColor: "rgba(219,199,130,1)",

    // justifyContent: "center",
    // paddingLeft: 10,
    // paddingRight: 10,
  },

  topBarContainerPopUp: {
    height: 40,
    // paddingLeft: -20,
    // paddingRight: -20,
    //marginTop: 5,
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between"
    //borderWidth: 1,
  },

  topBarIcon: {
    width: 30,
    height: 30
  },

  buttonContainerPopUp: {
    marginTop: 8,
    marginLeft: 5,
    height: 40,
    width: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center"
    //borderWidth: 1
  },

  saveButtonPopUp: {
    height: 40,
    width: "95%",
    borderRadius: 10,
    marginTop: 8,
    justifyContent: "center",
    alignSelf:"center",
    alignItems: "center",
    backgroundColor: "black"
    //borderWidth: 1
  },

  backButtonPopUp: {
    // IDK why but flex:1 does not work.
    height: "100%",
    width: "100%"
  },

  submitButtonPopUp: {
    fontSize: 14,
    color: "white",
    fontFamily: "Museo Sans Cyrl"
  },

  placeNameContainerPopUp: {
    marginTop: 5,
    height: "10%",
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0)"
    //borderWidth: 1,
  },

  placeNamePopUp: {
    fontSize: 28,
    fontWeight: "bold",
    color: "black",
    fontFamily: "Museo Sans Cyrl",
    marginLeft: 8,
    marginRight: 8,
    textAlign: "center"
    //borderWidth: 1,
  },

  currentPlaceContainerPopUp: {
    marginTop: 5,
    height: "10%",
    width: "90%",
    borderRadius: 10,
    flexDirection: "row",
    paddingLeft: 20,
    paddingRight: 20,
    //marginLeft: 20,
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.8)"
    // borderWidth: 1,
    //elevation: 10,
  },

  dragImageContainerPopUp: {
    width: 40,
    height: 40
    //borderWidth: 1,
  },

  dragPlaceNamePopUp: {
    fontSize: 18,
    flex: 1,
    textAlign: "center",
    elevation: 10,
    color: "#B0B0B0",
    fontWeight: "bold",
    fontFamily: "Museo Sans Cyrl"
    //borderWidth: 1,
  },

  userListsContainerPopUp: {
    alignSelf:"center",
    marginTop: 5,
    height: "70%",
    width: "95%",
    marginBottom: 5
  },

  userListPlaceNameContainerPopUp: {
    top: 0,
    zIndex: 0,
    flex: 1,
    flexDirection: "row",
    borderRadius: 10,
    marginTop: 4,
    marginBottom: 4,
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0)",
    // borderWidth: 1,
    borderBottomWidth: 1,
    borderColor: "white"
  },

  userListPlaceNamePopUp: {
  flex:2,
    fontSize: 20,
    marginLeft: 10,
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    color: "black",
    fontFamily: "Museo Sans Cyrl"
    //borderWidth: 1,
  },

  removePlacePopUp: {
    flex:0.2,
    height: 40,
    width: 40,
    justifyContent: "center",
    alignItems: "center"
    //borderWidth:1,
  },

  placeRankContainerPopUp: {
    height: 30,
    width: 30,
    borderRadius: 15,
    backgroundColor: "black",
    //marginLeft: 10,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center"
    // borderWidth: 1,
  },

  placeViewRankPopUp: {
    fontSize: 14,
    fontWeight: "bold",
    color: "white",
    fontFamily: "Museo Sans Cyrl"
    //borderWidth: 1,
  },

  placeRankTHPopUp: {
    fontSize: 9,
    color: "white",
    marginTop: -7,
    fontFamily: "Museo Sans Cyrl"
  },

  loadingText: {
    color: "white",
    fontFamily: "Museo Sans Cyrl"
    //borderWidth: 1
  },

  loadingTextContainer: {
    position: "absolute",
    alignSelf: "center",
    bottom: -100,
    borderWidth: 1,
    width: 150,
    height: 30,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    borderColor: "rgba(0,0,0,0.5)",
    backgroundColor: "rgba(0,0,0,0.5)",
    elevation: 20
  }
});
