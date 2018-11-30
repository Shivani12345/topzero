/**
 * This the screen comes up every time when the user comes back to app after logging in
 */
import React, { Component } from "react";
import {
  Dimensions,
  Animated,
  Image,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableHighlight,
  View,
  Slider,
  RefreshControl
} from "react-native";
import MapView from "react-native-maps";
import SideMenu from "react-native-side-menu";
import ScrollableTabView from "react-native-scrollable-tab-view";
import { LoginManager, LoginButton } from "react-native-fbsdk";
import Facebook from "../core/Facebook";
import { Dropdown } from 'react-native-material-dropdown';
import MultiSlider from '@ptomasroos/react-native-multi-slider';
import Drawer from 'react-native-drawer';
import { NetworkInfo } from 'react-native-network-info';
import ModalDropdown from 'react-native-modal-dropdown';

import CustomMarker from './CustomMarker';


import {
  GoogleAnalyticsTracker,
  GoogleAnalyticsSettings,
  GoogleTagManager
} from "react-native-google-analytics-bridge";


import Marker from "./Marker";
import PlaceList from "./PlaceList";
import Consts from "../consts/Consts";
import Backend from "../core/Backend";
import Memory from "../core/Memory";

const { height, width } = Dimensions.get("window");

let displayCity;
let typeTosendPlaceList;
let type;
let string;
let usersCurrentList;
let apiPlaceType;

const COUNTER = [1, 2, 3, 4, 5, 6, 7,];

const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 0.04;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

export default class Dashboard extends Component {
  static navigationOptions = {
    gesturesEnabled: false,
    header: null
  };

  constructor(props) {
    super(props);
    this.sideMenu = null;

    this.viewTop = new Animated.Value(80);
    this.viewLeft = new Animated.Value(0);
    this.viewRight = new Animated.Value(0);
    this.viewBottom = new Animated.Value(-80);

    this.onChangeText = this.onChangeText.bind(this);

    this.placeCountRef = this.updateRef.bind(this, 'placeCount');
    this.placeTypeRef = this.updateRef.bind(this, 'placeType');
    this.placeCityRef = this.updateRef.bind(this, 'placeCity');

    this.animatedDesign = {
      top: this.viewTop,
      left: this.viewLeft,
      right: this.viewRight,
      bottom: this.viewBottom
    };

    this.state = {
      showOverlay: false,
      loadMapView: false,
      placeCount: 7,
      placeType: "Restaurants",
      placeCity: "Miami",
      sliderGoogleChanging: false,
      sliderGoogleValue: [1],
      sliderFacebookChanging: false,
      sliderFacebookValue: [1],
      sliderExpertChanging: false,
      sliderExpertValue: [1],
      sliderAllUserChanging: false,
      sliderAllUserValue: [1],
      priceRangeValue: [1, 2],
      rankedBy:"ALL",
      displayCityName:"Miami-Dade County",
      refreshing: false,
    };

    if(this.state.placeCity == 'Miami'){
        this.displayCityName = "Miami-Dade County";
    }
    if(this.state.placeCity == 'New York'){
        this.displayCityName = "New York County";
    }
    if(this.state.placeCity == 'Los Angeles'){
        this.displayCityName = "Los Angeles County";
    }

    this.apiPlaceType = "restaurant";

    this.tracker = new GoogleAnalyticsTracker(Consts.GA_KEY);
    // let tracker1 = new GoogleAnalyticsTracker('UA-42396538-5');

    // console.log("::: USER OBJECT :::");
    // console.log(Memory().userObject.lists);

  }

  /* FILTER VIEW START */
  /* Google Slider Start */
  sliderGoogleChangeFinish = (values) => {
    let newValues = [0];
    newValues[0] = values[0];
    this.setState({
      sliderGoogleValue: newValues,
      sliderGoogleChanging: false,
      scrollEnabled: true
    });
  }

  sliderGoogleChange = () => {
    this.setState({
      scrollEnabled: false
    });
  }
  /* Google Slider End */

  /* Facebook Slider Start */
  sliderFacebookChangeFinish = (values) => {
    let newValues = [0];
    newValues[0] = values[0];
    this.setState({
      sliderFacebookValue: newValues,
      sliderFacebookChanging: false,
      scrollEnabled: true
    });
  }

  sliderFacebookChange = () => {
    this.setState({
      scrollEnabled: false
    });
  }
  /* Facebook Slider End */

  /* Expert Slider Start */
  sliderExpertChangeFinish = (values) => {
    let newValues = [0];
    newValues[0] = values[0];
    this.setState({
      sliderExpertValue: newValues,
      sliderExpertChanging: false,
      scrollEnabled: true
    });
  }

  sliderExpertChange = () => {
    this.setState({
      scrollEnabled: false
    });
  }
  /* Expert Slider End */

  /* AllUser Slider Start */
  sliderAllUserChangeFinish = (values) => {
    let newValues = [0];
    newValues[0] = values[0];
    this.setState({
      sliderAllUserValue: newValues,
      sliderAllUserChanging: false,
      scrollEnabled: true
    });
  }

  sliderAllUserChange = () => {
    this.setState({
      scrollEnabled: false
    });
  }
  /* All Slider End */

  /* Price Range Slider Start */
  priceRangeValuesChangeFinish = (values) => {
    this.setState({
      priceRangeValue: values,
      scrollEnabled: true
    });
  }

  priceRangeValuesChange = () => {
    this.setState({
      scrollEnabled: false
    });
  }
  /* Price Range Slider End */


filterView = () => {

    return <View style={[styles.filterParameterContainer]}>
    <ScrollView scrollEnabled={this.state.scrollEnabled}>
    <Text style={styles.textLarge}>BUILD YOUR SEARCH</Text>

    <Text style={styles.textRegular}>DATA MINING OPTIONS</Text>
    <View style={[styles.textBorder]}></View>
    <Text style={styles.textSmall}>TELL US HOW IMPORTANT EACH OF </Text>
    <Text style={styles.textSmall}>THE OPINIONS ARE BELOW</Text>
      <View style={styles.sliders}>
        <View style={styles.sliderIcons}>
          <Image source={require('../icons/g.png')}/>
        </View>
        <MultiSlider
          selectedStyle={{
            backgroundColor: "rgba(188,165,98,1)",
          }}
          unselectedStyle={{
            backgroundColor: 'white',
         }}
          trackStyle={{
            height:5,
          }}
          values={this.state.sliderGoogleValue}
          sliderLength={200}
          onValuesChangeStart={this.sliderGoogleChangeStart}
          onValuesChange={this.sliderGoogleChange}
          onValuesChangeFinish={this.sliderGoogleChangeFinish}
          customMarker={CustomMarker}
          min={1}
          max={100}
          step={1}
        />
        <View style={styles.sliderOne}>
          <Text style={styles.text}>GOOGLE</Text>
        </View>
        <View style={styles.sliderIcons}>
          <Image source={require('../icons/fb.png')}/>
        </View>
        <MultiSlider
          selectedStyle={{
            backgroundColor: "rgba(188,165,98,1)",
          }}
          unselectedStyle={{
            backgroundColor: 'white',
          }}
          trackStyle={{
            height:5
          }}
          values={this.state.sliderFacebookValue}
          sliderLength={200}
          onValuesChangeStart={this.sliderFacebookChangeStart}
          onValuesChange={this.sliderFacebookChange}
          onValuesChangeFinish={this.sliderFacebookChangeFinish}
          customMarker={CustomMarker}
          min={1}
          max={100}
          step={1}
        />
        <View style={styles.sliderOne}>
          <Text style={styles.text}>FACEBOOK FRIENDS</Text>
        </View>
        <View style={styles.sliderIcons}>
          <Image source={require('../icons/u1.png')}/>
        </View>
        <MultiSlider
          selectedStyle={{
            backgroundColor: "rgba(188,165,98,1)",
          }}
          unselectedStyle={{
            backgroundColor: 'white',
          }}
          trackStyle={{
            height:5
          }}
          values={this.state.sliderExpertValue}
          sliderLength={200}
          onValuesChangeStart={this.sliderExpertChangeStart}
          onValuesChange={this.sliderExpertChange}
          onValuesChangeFinish={this.sliderExpertChangeFinish}
          customMarker={CustomMarker}
          min={1}
          max={100}
          step={1}
        />
        <View style={styles.sliderOne}>
          <Text style={styles.text}>EXPERTS USERS</Text>
        </View>
        <View style={styles.sliderIcons}>
          <Image source={require('../icons/users.png')}/>
        </View>
        <MultiSlider
          selectedStyle={{
            backgroundColor: "rgba(188,165,98,1)",
          }}
          unselectedStyle={{
            backgroundColor: 'white',
          }}
          trackStyle={{
            height:5
          }}
          values={this.state.sliderAllUserValue}
          sliderLength={200}
          onValuesChangeStart={this.sliderAllUserChangeStart}
          onValuesChange={this.sliderAllUserChange}
          onValuesChangeFinish={this.sliderAllUserChangeFinish}
          customMarker={CustomMarker}
          min={1}
          max={100}
          step={1}
        />
        <View style={styles.sliderOne}>
          <Text style={styles.text}>ALL USERS</Text>
        </View>
        </View>

        <Text style={[styles.textRegular, {marginTop: 20}]}>PRICE RANGE</Text>
        <View style={[styles.textBorder]}></View>
        <Text style={styles.textSmall}>TELL US THE PRICE RANGE YOU</Text>
        <Text style={styles.textSmall}>ARE INTERESTED IN SEEING</Text>

        <View style={[styles.sliders, {marginTop: 0}]}>
        <MultiSlider
          selectedStyle={{
            backgroundColor: "rgba(188,165,98,1)",
          }}
          unselectedStyle={{
            backgroundColor: 'white',
          }}
          trackStyle={{
            height:5,
            backgroundColor: 'red',
          }}
          values={[this.state.priceRangeValue[0], this.state.priceRangeValue[1]]}
          sliderLength={200}
          onValuesChangeFinish={this.priceRangeValuesChangeFinish}
          onValuesChange={this.priceRangeValuesChange}
          customMarker={CustomMarker}
          min={1}
          max={5}
          step={1}
          allowOverlap
          snapped
        />
      </View>
      </ScrollView>
    </View>
};

convertDollar = (value) => {
  if(value === 1){
    return "$";
  }
  if(value === 2){
    return "$$";
  }
  if(value === 3){
    return "$$$";
  }
  if(value === 4){
    return "$$$$";
  }
  if(value === 5){
    return "$$$$$";
  }
}

convertDollarToName = (value) => {
  if(value === 1){
    return " Bargain";
  }
  if(value === 2){
    return " Economical";
  }
  if(value === 3){
    return " Mid range";
  }
  if(value === 4){
    return " Fine Dining";
  }
  if(value === 5){
    return " Luxurious";
  }
}
  /* FILTER VIEW END */

  // /**
  //  * Used to find out the current location of the user.
  //  * enableHighAccuracy: true always times out. There is open issue on github.
  //  * enableHighAccuracy: false is workable though.
  //  * Visit : https://github.com/facebook/react-native/issues/7495
  //  */
  // findAndSetCurrentLocation = () => {
  //     //console.log("Dashboard: fetching location. please wait...");
  //     navigator.geolocation.getCurrentPosition(
  //         (position) => {
  //             //let initialPosition = JSON.stringify(position);
  //             this.setState({
  //                 longitude: position.coords.longitude,
  //                 latitude: position.coords.latitude,
  //             })
  //         },
  //         (error) => console.log(JSON.stringify(error)),
  //         {enableHighAccuracy: false, timeout: 20000, maximumAge: 1000}
  //     );
  // };

  getListName = index => {
    let type = Memory().userObject.lists[index].listType;

    typeTosendPlaceList = type.toLowerCase();

    if (type == "Bar" || type == "bar") {
      type = "Bar Scene";
    }
    type = type.charAt(0).toUpperCase() + type.slice(1);

    // alert(type);

    let city;
    if (Memory().allCities) {
      for (let i = 0; i < Memory().allCities.length; i++) {
        if (
          Memory().allCities[i].city ===
          Memory().userObject.lists[index].location.city
        ) {
          city = Memory().allCities[i].displayCityName;
          if (city == null) {
            city = Memory().userObject.lists[index].location.city;
          }
          break;
        }
      }
      // To match the dummy city which is truncated in our dummy data
      if (city == null) {
        city = Memory().userObject.lists[index].location.city;
      }
    } else {
      city = Memory().userObject.lists[index].location.city;
    }

    return type + "s in " + city;
  };

  /**
     * Renders the top7 lists of the user.
     * @param value
     * @param key
     * @returns {XML}
     */
  renderList = (value, key) => (
    <PlaceList
      addPlace={this.addPlace}
      key={key}
      value={value}
      listName={this.getListName(key)}
      names={this.setList(key)}
    />
  );

  /*
    Function that decode how many places comes from the server and how to handle them
  */
  setList = (key) => {
    let creteList;
    if(Memory()
    .userObject.lists[key].places.length == 10){
      creteList = Memory()
      .userObject.lists[key].places
      .slice(3)
      .reverse();
    }else{
      creteList = Memory()
      .userObject.lists[key].places
      .reverse();
    }
    return creteList;
  }

  addPlace = (value, name, id) => {
    value.type = typeTosendPlaceList;
    value.id = id;
    value.name = name;

    this.props.navigation.navigate(Consts.SCREEN_TITLES.PLACE_ADD_POP_UP, {
      markerObject: value,
      isAdded: this.isAdded,
      onGoBack: () => this.setState({})
    });
  };


  setListName = data => {
    return this.nameContainer.setNativeProps({
      text: data.ref.props.listName
    });
  };

  showSearchOverlay = () => {
    this.sideMenu.openMenu(false);
    this.props.navigation.navigate(Consts.SCREEN_TITLES.SEARCH_SCREEN, {
      onGoBack: () => {
        this.refreshDashboard();
        this.sideMenu.openMenu(true);
      }
    });
  };

  getTabBar = () => {
    let edit;
    if (!Memory().userObject.isGuest) {
      usersCurrentList = (usersCurrentList == undefined) ? 0 : usersCurrentList;
      if(Memory().userObject.lists && Memory().userObject.lists[usersCurrentList].length != 1){
          edit = <TouchableHighlight onPress={this.editPlaceList} underlayColor={"rgba(0,0,0,0)"}><Image source={require("../icons/rytedit.png")} /></TouchableHighlight>;
      }else{
        edit = <TouchableHighlight underlayColor={"rgba(0,0,0,0)"}><Image source={require("../icons/rytedit.png")} /></TouchableHighlight>;
      }
    }

    return (
      <View style={styles.currentListNameContainer}>
        <TouchableHighlight
          onPress={this.showSearchOverlay}
          underlayColor={"rgba(0,0,0,0)"}
        >
          <Image source={require("../icons/rytplus.png")} />
        </TouchableHighlight>
        <TextInput
          ref={view => (this.nameContainer = view)}
          style={styles.currentListName}
          multiline={true}
          numberOfLines={2}
          editable={false}
          caretHidden={true}
        />
        {edit}
      </View>
    );
  };

  cleanArray = (key) => {
    let list;
    Memory().userObject.lists[key].places.map((i, j) => {
      if (i.name != null) {
        list.name = i.name;
        // list.id = i.id;
      }
    });
    return list;
  }

  editPlaceList = () => {
      if(usersCurrentList == undefined){
        usersCurrentList = 0;
      }
      let value = Memory().userObject.lists[usersCurrentList];
      value.type = typeTosendPlaceList;
      // this.props.navigation.navigate(Consts.SCREEN_TITLES.FILTER_SCREEN, {
      //   markerObject: value,
      //   isAdded: true,
      //   onGoBack: () => this.setState({})
      // });
      //
      this.props.navigation.navigate(Consts.SCREEN_TITLES.PLACE_ADD_POP_UP, {
        markerObject: value,
        isAdded: true,
        onGoBack: () => this.setState({})
      });
  }

  swipeLeft = () => {
    let currentPageIndex = this.scrollView.state.currentPage;
    if (currentPageIndex !== 0) {
      currentPageIndex--;
      this.scrollView.goToPage(currentPageIndex);
      this.getListName(currentPageIndex);
      usersCurrentList = currentPageIndex;
    }
  };

  swipeRight = () => {
    let currentPageIndex = this.scrollView.state.currentPage;
    if (Memory().userObject.lists) {
      let totalPages = Memory().userObject.lists.length;
      if (currentPageIndex !== 2) {
        currentPageIndex++;
        this.scrollView.goToPage(currentPageIndex);
        this.getListName(currentPageIndex);
        usersCurrentList = currentPageIndex;
      }
    }
  };

  toggelListData = () => {
    console.log("Toggle List Data");
    var tempZeroIndex = [];
    var tempOtherIndex = [];
    var tempZeroIndexForType = [];
    var tempOtherIndexForType = [];
    var keyTofind;
    var keyTofindForType;

    if(this.state.placeCity == 'Miami'){
        this.displayCityName = "Miami-Dade County";
    }
    if(this.state.placeCity == 'New York'){
        this.displayCityName = "New York County";
    }
    if(this.state.placeCity == 'Los Angeles'){
        this.displayCityName = "Los Angeles County";
    }

    if(this.state.placeType == "Restaurants"){
        this.apiPlaceType = "restaurant";
    }
    if(this.state.placeType == "Clubs"){
        this.apiPlaceType = "club";
    }
    if(this.state.placeType == "Bar Scene"){
        this.apiPlaceType = "bar";
    }

    console.log("USER LIST");
    console.log(JSON.stringify(Memory().userObject.lists));

    // find selected city for display specific city list
    for (var key = 0; key < Memory().userObject.lists.length; key++) {
      if(Memory().userObject.lists[key].location.city == this.displayCityName){
          keyTofind = key;
          break;
      }
    }

    if (keyTofind != null) {
      // if (keyTofind != 0) {

        tempZeroIndex[0] = Memory().userObject.lists[0];
        tempZeroIndex[1] = Memory().userObject.lists[1];
        tempZeroIndex[2] = Memory().userObject.lists[2];

        tempOtherIndex[0] = Memory().userObject.lists[keyTofind];
        tempOtherIndex[1] = Memory().userObject.lists[keyTofind + 1];
        tempOtherIndex[2] = Memory().userObject.lists[keyTofind + 2];

        Memory().userObject.lists[0] = tempOtherIndex[0];
        Memory().userObject.lists[1] = tempOtherIndex[1];
        Memory().userObject.lists[2] = tempOtherIndex[2];

        Memory().userObject.lists[keyTofind] = tempZeroIndex[0];
        Memory().userObject.lists[keyTofind + 1] = tempZeroIndex[1];
        Memory().userObject.lists[keyTofind + 2] = tempZeroIndex[2];


        for (var keyForType = 0; keyForType < tempOtherIndex.length; keyForType++) {
          if(tempOtherIndex[keyForType].listType == this.apiPlaceType){
              keyTofindForType = keyForType;
              break;
          }
        }

        tempZeroIndexForType[0] = Memory().userObject.lists[0];

        tempOtherIndexForType[0] = Memory().userObject.lists[keyTofindForType];

        Memory().userObject.lists[0] = tempOtherIndexForType[0];
        Memory().userObject.lists[keyTofindForType] = tempZeroIndexForType[0];

        // if(keyTofindForType !=0){
        //     Memory().userObject.lists.unshift(Memory().userObject.lists[keyTofindForType]);
        // }

      // }
      // else {

        // tempOtherIndex[0] = Memory().userObject.lists[keyTofind];
        // tempOtherIndex[1] = Memory().userObject.lists[keyTofind + 1];
        // tempOtherIndex[2] = Memory().userObject.lists[keyTofind + 2];
        //
        // for (var keyForType = 0; keyForType < tempOtherIndex.length; keyForType++) {
        //   if(tempOtherIndex[keyForType].listType == this.apiPlaceType){
        //       keyTofindForType = keyForType;
        //       break;
        //   }
        // }
        //
        // if(keyTofindForType !=0){
        //     Memory().userObject.lists.unshift(Memory().userObject.lists[keyTofindForType]);
        // }

      // }

      // console.log("TEMP OTHER INDEX :::: "+ JSON.stringify(tempOtherIndex));


      // console.log("USEROBJECT LIST TYPE WISE ====> " + JSON.stringify(Memory().userObject.lists));
      // if(keyTofindForType != 0){
      //   Memory().userObject.lists.unshift(Memory().userObject.lists[keyTofindForType]);
      //
      //   // Memory().userObject.lists[0] = tempOtherIndex[0];
      //   // Memory().userObject.lists[1] = tempOtherIndex[1];
      //   // Memory().userObject.lists[2] = tempOtherIndex[2];
      // }

      // console.log("KEY FIND FOR LIST TYPE");
      // console.log(JSON.stringify(tempOtherIndex));
      // console.log(keyTofindForType);

    } else {
      // tempZeroIndex = Memory().userObject.lists[0];
      // /*tempOtherIndex = tempZeroIndex;
      //
      //        tempOtherIndex.listType = this.getTopBarString().split("_")[0];
      //        tempOtherIndex.location.city = this.getTopBarString().split("_")[1];*/
      //
      // //alert(displayCity)
      // Memory().userObject.lists[
      //   Memory().userObject.lists.length
      // ] = tempZeroIndex;
      // Memory().userObject.lists[0] = this.getEmptyObj(type, displayCity);
      // // this.setListName(Memory().userObject.lists[0]);
      //
      // var tempListTitle = this.getListName(0);
      // console.log("tempListTitle  " + tempListTitle);
      //
      // if (this.nameContainer) {
      //   this.nameContainer.setNativeProps({
      //     text: tempListTitle
      //   });
      // }
    }
  };

  removeEmptyData = () => {
    var isAllNull = false;
    for (var key = 0; key < Memory().userObject.lists.length; key++) {
      isAllNull = false;

      Memory().userObject.lists[key].places.map((i, j) => {
        // console.log("Memory().userObject.lists[key].places ===>");
        // console.log(JSON.stringify(Memory().userObject.lists[key].places));
        if (i.name != null) {
          isAllNull = true;
        }
      });
      // if (!isAllNull) {
      //   Memory().userObject.lists.splice(key, 1);
      // }
    }
  };

  getEmptyObj = (type, city) => {
    let emptyObj = {
      listID: "120085658744116_Miami-Dade County_restaurant",
      listType: type,
      location: {
        city: city,
        cityLatitude: null,
        cityLongitude: null,
        continent: null,
        country: "United States",
        created: null,
        displayCityName: city,
        id: null,
        state: "Florida",
        updated: null,
        zoomingIndex: null
      },
      places: [
        {
          id: null,
          name: null,
          priceLevel: 0
        },
        {
          id: null,
          name: null,
          priceLevel: 0
        },
        {
          id: null,
          name: null,
          priceLevel: 0
        },
        {
          id: null,
          name: null,
          priceLevel: 0
        },
        {
          id: null,
          name: null,
          priceLevel: 0
        },
        {
          id: null,
          name: null,
          priceLevel: 0
        },
        {
          id: null,
          name: null,
          priceLevel: 0
        },
        {
          id: null,
          name: null,
          priceLevel: 0
        },
        {
          id: null,
          name: null,
          priceLevel: 0
        },
        {
          id: null,
          name: null,
          priceLevel: 0
        }
      ]
    };

    return emptyObj;
  };
  /**
     * Creates the left side bar of the dashboard.
     * @returns {XML}
     */
  getSideBar = () => {
    console.log("GET SIDE BAR");
    let userListView;
    let navigation;
    //Does user have any lists?

    if (
      Memory().userObject.lists !== null &&
      Memory().userObject.lists.length > 0
    ) {
      //Yes he does! Create the component for views
      this.toggelListData();

        // console.log("UserObjects:::: "+ JSON.stringify(Memory().userObject));
        // console.log("Markers: "+Memory().markers);

      userListView = Memory().userObject.lists.map(this.renderList);
      if (Memory().userObject.lists.length > 1) {
        navigation = (
          <View style={styles.listNavigationContainer}>
            <TouchableHighlight
              underlayColor={"#c5b167"}
              onPress={this.swipeLeft}
              style={styles.leftButton}
            >
              <Image source={require("../icons/back_black.png")} />
            </TouchableHighlight>

            <TouchableHighlight
              underlayColor={"#c5b167"}
              onPress={this.swipeRight}
              style={styles.rightButton}
            >
              <Image source={require("../icons/back_right.png")} />
            </TouchableHighlight>
          </View>
        );

      } else {

        navigation = null;
      }
    } else {

      // Nope he does not. show message that he does not.
        if (this.nameContainer) {
            this.nameContainer.setNativeProps({
                text: ""
            });
        }
      userListView = (
        <View style={styles.listContainer}>
          <Text
            style={{
              color: "black",
              fontSize: 14,
              fontFamily: "Museo Sans Cyrl"
            }}
          >
            You can start creating your lists of Top7 Restaurants, Clubs & Bars
            by Pressing the + Button on Top
          </Text>
        </View>
      );
      navigation = null;
    }

    let userImageSource;
    let loginButton;
    let topText;
    if (Memory().userObject.isGuest) {
      userImageSource = require("../icons/guest_user_image_black.png");
      loginButton = (
        <TouchableHighlight
          onPress={this.initLogIn}
          style={styles.facebookLogin}
        >
          <Text style={styles.facebookLoginText}>LOGIN WITH FACEBOOK</Text>
        </TouchableHighlight>
      );
    } else {
      topText = <Text style={styles.listTitleText}>MY PERSONAL TOP7 LIST</Text>;
      userImageSource = { uri: Memory().userObject.picture.data.url };
      loginButton = null;
    }

    return (
      <View
         // source={require("../icons/background_ivory.png")}
        style={styles.drawerContainer}
      >
        {/*View for user details => Profile pic and name*/}
        <View style={styles.userDetailsContainer}>
          {topText}
          <Image source={userImageSource} style={styles.userProfilePic} />
          <View style={styles.userNameContainer}>
            <Text style={styles.userName}>{Memory().userObject.name}</Text>
          </View>
          {/*<LoginButton/>*/}
          {loginButton}
          <View style={styles.horizontalLine} />
        </View>

        {/*The horizontal scroll list of user*/}
        <ScrollableTabView
          ref={view => (this.scrollView = view)}
          onChangeTab={this.setListName}
          tabBarTextStyle={styles.listName}
          renderTabBar={this.getTabBar}
          tabBarUnderlineStyle={{ height: 0 }}
        >
          {userListView}
        </ScrollableTabView>
        {navigation}
      </View>
    );
  };

  /**
     * Handle the data of user received from Graph Manager
     * @param error
     * @param result
     */
  handleData = (error, result) => {
    if (!error) {
      Memory().userObject = result;
      Backend.syncUserInfo(isUserNew => {
        this.setLoadingTextViewVisibility(false);
        if (isUserNew) {
          this.props.navigation.navigate(
            Consts.SCREEN_TITLES.USER_CONFIRM_DETAILS,
            // TODO: PLEASE TEST
            { ...this.params }
          );
        } else {
          if (this.params && this.params.toPage) {
            this.props.navigation.state.params.onGoBack();
            this.props.navigation.goBack();
          } else {
            this.props.navigation.navigate(Consts.SCREEN_TITLES.DASHBOARD);
          }
        }
      });
    } else {
      console.log(error);
    }
  };

  /**
     * Once the login is done ( or cancelled ) handle the flow
     * @param result
     */
  handleLogIn = result => {
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
    LoginManager.logInWithReadPermissions([
      "public_profile",
      "email",
      "user_friends"
    ])
      .then(this.handleLogIn, error => alert(error))
      .catch(error => {
        console.error(error);
      });
    Backend.getBackendAccessToken(() => {});
  };

  /**
     * @param value
     * @param key
     * @returns {XML}
     */
  loadMarkers = (value, key) => {
    console.log(JSON.stringify(value));
    return (
      <Marker
        key={key}
        markerObject={value}
        refreshDashboard={this.refreshDashboard}
        navigation={this.props.navigation}
      />
    );
  };

  regionChanged = (region) => {
    // console.log("Me called");
  };

  refreshDashboard = () => this.setState({});

  /**
     * Creates and return the map container on the screen
     * @returns {XML}
     */
  getMainMapView = () => {
    let regionToLoad;
    if (Memory().currentCity) {
      regionToLoad = {
        latitude: parseFloat(Memory().currentCity.cityLatitude),
        longitude: parseFloat(Memory().currentCity.cityLongitude),
        latitudeDelta: parseFloat(Memory().currentCity.zoomingIndex),
        longitudeDelta: parseFloat(Memory().currentCity.zoomingIndex)
        // latitudeDelta: LATITUDE_DELTA,
        // longitudeDelta: LONGITUDE_DELTA
        // latitudeDelta: 0.06,
        // longitudeDelta: 0.06
      };
    } else {
      regionToLoad = Consts.DEFAULT_REGION;
    }

    // console.log(regionToLoad);

    return (
      <Animated.View style={[styles.mainViewContainer, this.animatedDesign]}>
        <TouchableHighlight
          //underlayColor={"#c5b167"}
          onPress={() => {this._drawer.open()}}
          style={styles.tabIconContainerLeft}
        >
          <Image
            style={styles.tabIconLeft}
            source={require("../icons/sdbr_left.png")}
          />
        </TouchableHighlight>
        {this.getBottomBarView()}
        <MapView.Animated
          // minZoomLevel = {10}
          // maxZoomLevel = {20}
          fitToElements = {true}
          region={regionToLoad}
          style={styles.map}
          onRegionChangeComplete={this.regionChanged}
        >
          {Memory().markers.map(this.loadMarkers)}
        </MapView.Animated>
        <TouchableHighlight
          //underlayColor={"#c5b167"}
          onPress={() => this.sideMenu.openMenu(true)}
          style={styles.tabIconContainer}
        >
          <Image
            style={styles.tabIcon}
            source={require("../icons/sdbr_right.png")}
          />
        </TouchableHighlight>
      </Animated.View>
    );
  };

  /**
     * This function loads all the view required for list view and returns them
     * It takes the data from markers variable in state
     */
  loadPlaces = () =>
    Memory().markers.map((value, key) => {
      let icon =
        Consts.API_URLS.GOOGLE_PHOTO_API_BASE +
        "maxwidth=400&photoreference=" +
        value.icon +
        "&key=" +
        Consts.KEYS.GOOGLE_API_KEY;
      if (value.number) {
        // if number is not set, then it means they are searched markers.
        let rating = Math.floor(value.rating);
        let diff = value.rating - rating;

        let stars = [];

        let index;

        for (index = 0; index < rating; index++) {
          stars.push(
            <Image
              style={styles.star}
              key={index}
              source={require("../icons/star-fill.png")}
            />
          );
        }

        if (0 < diff && diff < 0.5) {
          stars.push(
            <Image
              style={styles.star}
              key={index}
              source={require("../icons/star-half.png")}
            />
          );
        } else if (0.5 <= diff) {
          stars.push(
            <Image
              style={styles.star}
              key={index}
              source={require("../icons/star-fill.png")}
            />
          );
        }

        if (diff === 0) index--;

        // Add required blank stars
        while (++index < 5) {
          stars.push(
            <Image
              style={styles.star}
              key={index}
              source={require("../icons/star.png")}
            />
          );
        }

        let typeIcon;
        let type;
        switch (value.type) {
          case Consts.PLACE_TYPES.BAR:
            typeIcon = (
              <Image
                style={styles.placeDetailsIcon}
                source={require("../icons/dining.png")}
              />
            );
            type = (
              <Text style={styles.placeDetailsText}>
                {Consts.PLACE_TYPES.BAR_EQUAL.toUpperCase()}
              </Text>
            );
            break;
          case Consts.PLACE_TYPES.CLUB:
            typeIcon = (
              <Image
                style={styles.placeDetailsIcon}
                source={require("../icons/club_black.png")}
              />
            );
            type = (
              <Text style={styles.placeDetailsText}>
                {Consts.PLACE_TYPES.CLUB.toUpperCase()}
              </Text>
            );
            break;
          default:
            typeIcon = (
              <Image
                style={styles.placeDetailsIcon}
                source={require("../icons/restaurant_black.png")}
              />
            );
            type = (
              <Text style={styles.placeDetailsText}>
                {Consts.PLACE_TYPES.RESTAURANT.toUpperCase()}
              </Text>
            );
            break;
        }

        let priceLevelIcon;
        let priceLevel;
        let limit = 0;
        // console.log("PRICE LEVEL ::::: " + JSON.stringify(value));
        if (value.priceLevel == 1) {
          priceLevelIcon = (
            <Image
              style={styles.placeDetailsIcon}
              source={require("../icons/affordable_black.png")}
            />
          );
          priceLevel = (
            <Text style={styles.placeDetailsText}>
              BARGAIN
            </Text>
          );
        }
        if (value.priceLevel == 2 ) {
          priceLevelIcon = (
            <Image
              style={styles.placeDetailsIcon}
              source={require("../icons/2d.png")}
            />
          );
          priceLevel = (
            <Text style={styles.placeDetailsText}>
              ECONOMICAL
            </Text>
          );
        }
        if (value.priceLevel == 3 ) {
          priceLevelIcon = (
            <Image
              style={styles.placeDetailsIcon}
              source={require("../icons/3d.png")}
            />
          );
          priceLevel = (
            <Text style={styles.placeDetailsText}>
              MID RANGE
            </Text>
          );
        }
        if (value.priceLevel == 4 ) {
          priceLevelIcon = (
            <Image
              style={styles.placeDetailsIcon}
              source={require("../icons/4d.png")}
            />
          );
          priceLevel = (
            <Text style={styles.placeDetailsText}>
              FINE DINING
            </Text>
          );
        }
        if (value.priceLevel == 5 ) {
          priceLevelIcon = (
            <Image
              style={styles.placeDetailsIcon}
              source={require("../icons/5d.png")}
            />
          );
          priceLevel = (
            <Text style={styles.placeDetailsText}>
              LUXURIOUS
            </Text>
          );
        }
        let lastObjectStyle = {};
        if (key === Memory().markers.length - 1) {
          lastObjectStyle = {
            marginBottom: 150
          };
        }

        return (
          <TouchableHighlight
            key={key}
            onPress={() => {
              this.props.navigation.navigate(
                Consts.SCREEN_TITLES.PLACE_DETAILS,
                {
                  onGoBack: () => this.refreshDashboard(),
                  markerObject: value
                }
              );
            }}
          >
            <View style={[styles.listViewPlaceNameContainer, lastObjectStyle]}>
              <Image style={styles.listViewPlaceIcon} source={value.icon} />
                <Image style={styles.listViewBadgeIcon} source={require('../icons/badge.png')}/>
                <Text style={styles.listViewPlaceRank}>#{value.number}</Text>
              <View style={styles.listViewPlaceNameAndRankContainer}>
                <View style={styles.listViewPlaceName}>
                  <Text style={styles.listViewPlaceNameText}>{value.name}</Text>
                </View>
              </View>
              <View style={styles.listViewPlaceDetailsContainer}>
                <View style={styles.listViewRatingsContainer}>
                  <Text style={styles.title}>Google Rating</Text>
                  <View style={styles.listViewRatings}>
                    {stars}
                  </View>
                </View>
                <View style={styles.listViewPlaceDetails}>
                  <View style={styles.listViewPlaceDetailsIconContainer}>
                    {typeIcon}
                    {type}
                  </View>
                  <View style={styles.listViewPlaceDetailsIconContainer}>
                    {priceLevelIcon}
                    {priceLevel}
                  </View>
                </View>
              </View>
            </View>
          </TouchableHighlight>
        );
      }
    });

    _onRefresh() {
      this.setState({refreshing: true});
      Memory().updateLeaderboard = true;
      Backend.syncUserInfo();
      this.setState({refreshing: false});
    }

  getListView = () => {
    return (
      <Animated.View style={[styles.mainViewContainer, this.animatedDesign]}>
        <TouchableHighlight
          underlayColor={"#c5b167"}
          onPress={() => {this._drawer.open()}}
          style={styles.tabIconContainerLeft}
        >
          <Image
            style={styles.tabIconLeft}
            source={require("../icons/sdbr_left.png")}
          />
        </TouchableHighlight>
        <ScrollView
          style={styles.listViewLeaderboradContainer}
          showsVerticalScrollIndicator={false}

          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this._onRefresh.bind(this)}
            />
          }
        >
          {this.listHeaderView()}
          {this.loadPlaces()}
        </ScrollView>
        <TouchableHighlight
          underlayColor={"#c5b167"}
          onPress={() => this.sideMenu.openMenu(true)}
          style={styles.tabIconContainer}
        >
          <Image
            style={styles.tabIcon}
            source={require("../icons/sdbr_right.png")}
          />
        </TouchableHighlight>
      </Animated.View>
    );
  };

  openFilterScreen = () => {
    this.tracker.trackEvent(
      Consts.analyticEvent.applyFilterEvent,
      Consts.analyticEvent.clickEvent,
      Consts.analyticEvent.applyFilterLabel
    );
    this.props.navigation.navigate(Consts.SCREEN_TITLES.FILTER_SCREEN, {
      updateLeaderBoard: this.updateLeaderBoard
    });
  };

  getTopBarString = () => {
    if (!Memory().leaderBoardFilters) {
      Memory().leaderBoardFilters = Consts.DEFAULT_LEADERBOARD_FILTERS;
      displayCity = Memory().leaderBoardFilters.city;
      string = Memory().leaderBoardFilters.types;
      type = string.charAt(0).toUpperCase() + string.slice(1);
    } else {
      string = Memory().leaderBoardFilters.types;
      type = string.charAt(0).toUpperCase() + string.slice(1);
      if (Memory().allCities) {
        for (let i = 0; i < Memory().allCities.length; i++) {
          if (Memory().allCities[i].city === Memory().leaderBoardFilters.city) {
            displayCity = Memory().allCities[i].displayCityName;
            break;
          }
          if (
            Memory().allCities[i].displayCityName ===
            Memory().leaderBoardFilters.city
          ) {
            displayCity = Memory().leaderBoardFilters.city;
            break;
          }
        }
      }
    }
    typeTosendPlaceList = type.toLowerCase();
    if (type == "Bar" || type == "bar") {
      type = "Bar Scene";
    }
    let displayString = type + "s in " + displayCity;
    return displayString;
  };
  /**
     * Helper function to get tab bar on the top
     * @returns {XML}
     */
  getTopBarView = () => {
    let displayCity;
    let type;
    let string;
    if (!Memory().leaderBoardFilters || !Memory().allCities) {
      Memory().leaderBoardFilters = Consts.DEFAULT_LEADERBOARD_FILTERS;
      displayCity = Consts.DEFAULT_CITY_DISPLAY_NAME;
      string = Memory().leaderBoardFilters.types;
      type = string.charAt(0).toUpperCase() + string.slice(1);
    } else {
      string = Memory().leaderBoardFilters.types;
      type = string.charAt(0).toUpperCase() + string.slice(1);
      if (Memory().allCities) {
        for (let i = 0; i < Memory().allCities.length; i++) {
          if (Memory().allCities[i].city === Memory().leaderBoardFilters.city) {
            displayCity = Memory().allCities[i].displayCityName;
            break;
          }
          if (
            Memory().allCities[i].displayCityName ===
            Memory().leaderBoardFilters.city
          ) {
            displayCity = Memory().leaderBoardFilters.city;
            break;
          }
        }
      }
    }
    typeTosendPlaceList = type.toLowerCase();
    if (type == "Bar" || type == "bar") {
      type = "Bar Scene";
    }
    //let displayString = type + "s in " + displayCity;
    // let displayString = "Top " + "7 " + type + "s in " + displayCity;

    let { placeCount, placeType, placeCity } = this.state;

    return (
      <View style={styles.topBarContainer}>
          <View style={styles.topLogo}>
            <Image
                style={styles.topBarIcon}
                source={require('../icons/top7.png')}/>
          </View>
          <View style={styles.topTextContainer}>
            <Text style={styles.cityName}> Top </Text>
            <View style={styles.placeCount}>
              <Dropdown
                label=""
                dropdownPosition = {-4}
                fontSize ={18}
                ref={this.placeCountRef}
                value={placeCount}
                textColor = "#DCC670"
                baseColor = "#DCC670"
                onChangeText={this.onChangeText}
                data={Consts.PLACE_COUNT}
              />
            </View>

            <View style={styles.placeType}>
            <Dropdown
              label=""
              dropdownPosition = {-4}
              fontSize ={18}
              ref={this.placeTypeRef}
              value={placeType}
              // containerStyle={styles.placeTypeText}
              // pickerStyle={styles.placeTypepickerStyle}
              //itemTextStyle = {styles.placeTypeText}
              textColor = "#DCC670"
              baseColor = "#DCC670"
              onChangeText={this.onChangeText}
              data={Consts.TYPES}
            />
            </View>

            <Text style={styles.cityName}> in </Text>

            <View style={styles.placeCity}>
            <Dropdown
              label=""
              dropdownPosition = {-4}
              fontSize ={18}
              ref={this.placeCityRef}
              value={placeCity}
              pickerStyle={styles.placeCitypickerStyle}
              textColor = "#DCC670"
              baseColor = "#DCC670"
              onChangeText={this.onChangeText}
              data={Consts.PLACE_CITY}
            />
            </View>
            </View>
      </View>
    );
  };

  onChangeText(text) {
    ['placeCount', 'placeType', 'placeCity']
      .map((name) => ({ name, ref: this[name] }))
      .filter(({ ref }) => ref && ref.isFocused())
      .forEach(({ name, ref }) => {
        this.setState({ [name]: text });
      });

      let level = 0;

      if(Memory().leaderboard.priceLevel !== undefined){
          level = Memory().leaderboard.priceLevel;
      }
      if(this.state.placeCity == 'Miami'){
          this.displayCityName = "Miami-Dade County";
      }
      if(this.state.placeCity == 'New York'){
          this.displayCityName = "New York County";
      }
      if(this.state.placeCity == 'Los Angeles'){
          this.displayCityName = "Los Angeles County";
      }

      if(this.state.placeType == "Restaurants"){
          this.apiPlaceType = "restaurant";
      }
      if(this.state.placeType == "Clubs"){
          this.apiPlaceType = "club";
      }
      if(this.state.placeType == "Bar Scene"){
          this.apiPlaceType = "bar";
      }

      let ip;
      let userId;
      if(Memory().userObject.isGuest){
        ip =  Memory().userIp;
        userId = "";
      }else{
        ip =  "";
        userId = Memory().userObject.id;
      }

      Memory().leaderBoardFilters = {
          types: this.state.placeType,
          city: this.displayCityName,
          numberOfTopPlaces: this.state.placeCount,
          priceLevel: this.state.priceRangeValue[0],
          setting: "both",
          userId: userId,
          macId: ip,
          maxPriceLevel : this.state.priceRangeValue[1],
          googleRatingMultiplier: this.state.sliderGoogleValue * 0.25 / 100,
          facebookFriendMultiplier: this.state.sliderFacebookValue * 0.25 / 100,
          expertUsreMultiplier: this.state.sliderExpertValue * 0.25 / 100,
          allUserMultiplier: this.state.sliderAllUserValue * 0.25 / 100,
      };
      Memory().updateLeaderboard = true;
      this.updateLeaderBoard();
      Backend.syncUserInfo();
      this.refreshDashboard();
    }

    updateRef(placeCount, ref) {
      this[placeCount] = ref;
        console.log("UPDATE REFRENCE :: "+ this[placeCount]);
    }


  listViewButtonPressed = () => {
    this.tracker.trackEvent(
      Consts.analyticEvent.showListEvent,
      Consts.analyticEvent.clickEvent,
      Consts.analyticEvent.listViewLabel
    );

    this.setState({
      loadMapView: true
    });
  };

  findRank = () => {
    let rankedArray = [
      {
        'key':'GOOGLE',
        'value': this.state.sliderGoogleValue[0]
      },{
        'key':'FB FRIENDS',
        'value': this.state.sliderFacebookValue[0]
      },{
        'key':'EXPERT USER',
        'value': this.state.sliderExpertValue[0]
      },{
        'key':'ALL USERS',
        'value': this.state.sliderAllUserValue[0]
      }];

    let maxValue = 0;
    let keyValue = "ALL";
    rankedArray.map((i,j) => {
        if(maxValue < i.value) {
            maxValue = i.value;
            keyValue = i.key
        }
    });
    this.setState({
      rankedBy : keyValue
    });
  }
  /**
     * As the name says...
     * @returns {XML}
     */
  getBottomBarView = () => {
    return (
      <View style={styles.topTextForMapContainer}>
        <View style={styles.topTextForMap}>
            <View style={styles.topPriceText}>
              <Text style={styles.baseText}>PRICE RANGE:</Text>
              <TouchableHighlight
                underlayColor={"rgba(0,0,0,0.2)"}
                onPress={this.openControlPanel}
              >
                <Text style={styles.valueText}> {this.convertDollarToName(this.state.priceRangeValue[0])} - {this.convertDollarToName(this.state.priceRangeValue[1])}</Text>
              </TouchableHighlight>
            </View>
            <View style={styles.topRankText}>
              <Text style={styles.baseText}>RANKED BY:</Text>
              <TouchableHighlight
                underlayColor={"rgba(0,0,0,0.2)"}
                onPress={this.openControlPanel}
              >
                <Text style={styles.valueText}> {this.state.rankedBy}</Text>
              </TouchableHighlight>
            </View>
        </View>
        <View style={styles.bottomBarContainer} >
              <TouchableHighlight
                style={styles.filterIconContainer}
                underlayColor={"rgba(0,0,0,0.2)"}
                onPress={this.loadListView}
              >
              <Image source={require("../icons/list.png")} />
              </TouchableHighlight>
              <Text style={styles.baseText}>LIST VIEW</Text>
        </View>
      </View>
    );
  };


  listHeaderView = () => {
    return (
      <View style={styles.listbottomBarContainerMain}>
        <View style={styles.topText}>
            <View style={styles.topPriceText}>
              <Text style={styles.baseText}>PRICE RANGE:</Text>
              <TouchableHighlight
                underlayColor={"rgba(0,0,0,0.2)"}
                onPress={this.openControlPanel}
              >
                <Text style={styles.valueText}> {this.convertDollarToName(this.state.priceRangeValue[0])} - {this.convertDollarToName(this.state.priceRangeValue[1])}</Text>
              </TouchableHighlight>
            </View>
            <View style={styles.topRankText}>
              <Text style={styles.baseText}>RANKED BY:</Text>
              <TouchableHighlight
                underlayColor={"rgba(0,0,0,0.2)"}
                onPress={this.openControlPanel}
              >
                <Text style={styles.valueText}> {this.state.rankedBy}</Text>
              </TouchableHighlight>
            </View>
        </View>
        <View style={styles.listbottomBarContainer}>
              <TouchableHighlight
                style={styles.listIconContainer}
                underlayColor={"rgba(0,0,0,0.2)"}
                onPress={this.listViewButtonPressed}
              >
                <Image source={require("../icons/map.png")} />
              </TouchableHighlight>
              <Text style={styles.baseText}>MAP VIEW</Text>
        </View>
      </View>
    );
  };

  loadListView = () => {
    this.setState({
      loadMapView: false
    });
  }

  getMainView = () => {

    if (this.state.loadMapView) {
      return this.getMainMapView();
    } else {
      return this.getListView();
    }
  };

  /**
     * Helper function to hide or show the loading text view.
     * The loading text for current screen is 'synchronizing...'
     * @param isVisible
     */
  setLoadingTextViewVisibility = isVisible => {
    this.loadingText.setNativeProps({
      style: {
        bottom: isVisible ? 70 : -100,
        elevation: 20
      }
    });
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
        <Text style={styles.loadingText}>Fetching leaderboard...</Text>
      </View>
    );
  };

  updateLeaderBoard = () => {
    if (Memory().updateLeaderboard) {
      Memory().updateLeaderboard = false;
      this.setLoadingTextViewVisibility(true);
      Backend.getLeaderBoard(() => {
        this.setLoadingTextViewVisibility(false);
        this.setState({});
      });
    }
  };

  //DOWN BELOW IS THE COMPONENT LIFE CYCLE METHODS
  componentDidMount() {
    //console.log("COMPONENT DID MOUNT :::: ");
    // console.log(JSON.stringify(Memory().userObject));
    // Get Local IP
    NetworkInfo.getIPAddress(ip => {
      //console.log("::::: IP ADDRESS :::: ");
       Memory().userIp = ip;
       console.log(ip);
    });
    let ip;
    let userId;
    if(Memory().userObject.isGuest){
      ip =  Memory().userIp;
      userId = "";
    }else{
      ip =  "";
      userId = Memory().userObject.id;
    }
    this.setLoadingTextViewVisibility(true);
    Backend.getAllCity(() =>
      Backend.getUserPrefrence(() =>
        {
          Memory().leaderBoardFilters = {
                numberOfTopPlaces: Memory().userPrefrence[0].numberOfTopPlaces,
                types: Memory().userPrefrence[0].types,
                priceLevel: Memory().userPrefrence[0].priceLevel,
                city: Memory().userPrefrence[0].city,
                ratedBy: "all",
                setting: "both",
                userId: userId,
                macId: ip,
                maxPriceLevel : Memory().userPrefrence[0].maxPriceLevel,
                googleRatingMultiplier: Memory().userPrefrence[0].googleRatingMultiplier,
                facebookFriendMultiplier: Memory().userPrefrence[0].facebookFriendMultiplier,
                expertUsreMultiplier: Memory().userPrefrence[0].expertUsreMultiplier,
                allUserMultiplier: Memory().userPrefrence[0].allUserMultiplier,
            };
            Backend.getLeaderBoard(() => {
              this.setLoadingTextViewVisibility(false);
              let dropDownCity;
              if(Memory().userPrefrence[0].city.indexOf("Miami") !== -1){
                  dropDownCity = "Miami";
              }
              if(Memory().userPrefrence[0].city.indexOf("New") !== -1){
                  dropDownCity = "New York";
              }
              if(Memory().userPrefrence[0].city.indexOf("Los") !== -1){
                  dropDownCity = "Los Angeles";
              }

              let dropDownPlaceType;
              if(Memory().userPrefrence[0].types == "bar"){
                  dropDownPlaceType = "Bar Scene";
              }else{
                  dropDownPlaceType = Memory().userPrefrence[0].types.charAt(0).toUpperCase() + Memory().userPrefrence[0].types.slice(1) + "s";
              }
              this.setState({
                placeType: dropDownPlaceType,
                placeCity: dropDownCity,
                placeCount: Memory().userPrefrence[0].numberOfTopPlaces,
                sliderGoogleValue:[Memory().userPrefrence[0].googleRatingMultiplier * 100 / 0.25],
                sliderFacebookValue: [Memory().userPrefrence[0].facebookFriendMultiplier * 100 / 0.25],
                sliderExpertValue: [Memory().userPrefrence[0].expertUsreMultiplier * 100 / 0.25],
                sliderAllUserValue: [Memory().userPrefrence[0].allUserMultiplier * 100 / 0.25],
                priceRangeValue: [Memory().userPrefrence[0].priceLevel, Memory().userPrefrence[0].maxPriceLevel],
              });
            })
            this.findRank();
        }
      )
    );
  }

  componentDidUpdate() {
    if (
      Memory().userObject.lists !== null &&
      Memory().userObject.lists.length > 0 &&
      this.nameContainer
    ) {
      this.nameContainer.setNativeProps({
        text: this.getListName(0)
      });
      this.scrollView.goToPage(0);
    }
    this.updateLeaderBoard();
  }

  closeControlPanel = () => {
      console.log("DRAWER CLOSE ::::: ")
      this._drawer.close();
      let ip;
      let userId;
      if(Memory().userObject.isGuest){
        ip =  Memory().userIp;
        userId = "";
      }else{
        ip =  "";
        userId = Memory().userObject.id;
      }
      Memory().leaderBoardFilters = {
                types: this.state.placeType,
                priceLevel: this.state.priceRangeValue[0],
                city: this.state.placeCity,
                ratedBy: "all",
                setting: "both",
                userId: userId,
                macId: ip,
                maxPriceLevel : this.state.priceRangeValue[1],
                googleRatingMultiplier: this.state.sliderGoogleValue * 0.25 / 100,
                facebookFriendMultiplier: this.state.sliderFacebookValue * 0.25 / 100,
                expertUsreMultiplier: this.state.sliderExpertValue * 0.25 / 100,
                allUserMultiplier: this.state.sliderAllUserValue * 0.25 / 100,
                numberOfTopPlaces: this.state.placeCount,
            };
            Memory().updateLeaderboard = true;
            this.updateLeaderBoard();
            Backend.syncUserInfo();
            this.setState({drawerOpen: false});

            this.findRank();
    };
    openControlPanel = () => {
      this._drawer.open()
    };

  /* sync user info */
  openLeftMenu = (isOpen) => {
    console.log("OPEN MENU ::::::");
    this.setState({ isOpen, });
    Backend.syncUserInfo();
  }

  toggle() {
        this.setState({
        isOpen: !this.state.isOpen,
        });
    }

  render() {
    console.log("Dashboard: Render() called");

    return (
      <SideMenu
        // this.getSideBar does not work
        // Why ?
        // Because menu expects a component not a callback function
        // That component will be returned when YOU CALL that function
        // Thus, you have to call getSideBar()
        //                              - I know how that feels
        menu={this.getSideBar()}
        ref={menu => (this.sideMenu = menu)}
        openMenuOffset={width * 0.9}
        menuPosition="right"
        disableGestures = {true}
        // onChange={(isOpen) => this.openLeftMenu(isOpen)}

      >
        <View style={styles.container}>
        <Drawer
          width="70%"
          type="displace"
          tapToClose={true}
          openDrawerOffset={0.1}
          style={styles.leftDrawerContainer}
          ref={(ref) => this._drawer = ref}
          content={this.filterView()}
          closedDrawerOffset={-3}
          onClose={this.closeControlPanel}
          >
          <StatusBar hidden />
          {this.getTopBarView()}
          {this.getMainView()}
          {/*this.getBottomBarView()*/}
          {this.getLoadingTextView()}
          </Drawer>
        </View>

      </SideMenu>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white"
  },
  placeCount : {
    width : "10%",
  },
  placeType : {
    width : "30%"
  },
  placeCity : {
    width : "20%"
  },
  drawerContainer: {
    height: "100%",
    width: "100%",
    backgroundColor: "#DCC670"
  },
  facebookLogin: {
    width: "60%",
    height: "10%",
    borderRadius: 50,
    backgroundColor: "#3B5999",
    alignItems: "center",
    justifyContent: "center"
  },
  facebookLoginText: {
    fontWeight: "bold",
    color: "white",
    fontFamily: "Museo Sans Cyrl"
  },

  listNavigationContainer: {
    justifyContent: "space-between",
    flexDirection: "row",
    height: "8%",
    // borderColor: "green"
  },

  leftButton: {
    width: "20%",
    borderRadius: 30,
    marginRight: 30,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 5,
    marginBottom: 5
    //borderWidth:1
  },

  editButton: {
    flex: 1,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 5
    //borderWidth:1
  },

  rightButton: {
    width: "20%",
    borderRadius: 30,
    marginLeft: 30,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 5,
    marginBottom: 5
    //borderWidth:1
  },

  userDetailsContainer: {
    marginTop:20,
    paddingLeft: 20,
    alignItems: "center",
    // borderWidth: 1
  },

  listTitleText:{
    fontSize: 25,
    fontWeight: 'bold',
    marginTop: 10,
    color: "black",
    fontFamily: "Museo Sans Cyrl"
  },

  userProfilePic: {
    borderRadius: 50,
    height: 100,
    width: 100,
    marginTop: 15
  },

  userNameContainer: {
    backgroundColor: "rgba(0,0,0,0)"
  },

  userName: {
    fontSize: 25,
    marginTop: 10,
    color: "black",
    fontFamily: "Museo Sans Cyrl"
  },

  currentListNameContainer: {
    flexDirection: "row",
    marginLeft: 20,
    height: "auto",
    width: width,
    alignItems: "center",
    // borderWidth:1
  },

  currentListName: {
    textAlign:"center",
    flexDirection: "row",
    paddingLeft: 3,
    paddingRight: 3,
    alignItems: "center",
    width: width * 0.65,
    fontSize: 19,
    fontWeight: "bold",
    color: "black",
    fontFamily: "Museo Sans Cyrl",
    // borderWidth:1
  },
  horizontalLine: {
    height: 3,
    width: "90%",
    marginTop: 8,
    marginBottom: 8,
    backgroundColor: "black"
  },

  listName: {
    fontSize: 20,
    marginTop: 10,
    marginBottom: 10,
    color: "black",
    fontWeight: "bold"
  },

  listContainer: {
    width: width * 0.9,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "rgba(0,0,0,0)"
  },
  topTextContainer:{
    display: "flex",
    flexDirection: "row",
    position: "relative",
    top: 45,
    height: 30,
    // borderWidth: 1,
    // borderColor: "pink"
  },
  topLogo:{
    position: "absolute",
    // marginLeft:"50%",
    alignItems: "center",
    justifyContent: "center",
    height: 50,
    width: "100%",
    top:35,
    zIndex: -999,
    // borderWidth: 1,
    // borderColor: "red"
  },
  topBarContainer: {
    display: "flex",
    flexDirection: "row",
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 120,
    backgroundColor: "#000000",//DCC670 #000000
    alignItems: "center",
    justifyContent: "center",
    zIndex: 15,
    paddingLeft: 10,
    paddingRight: 10,
    // borderWidth: 1,
    // borderColor: "green"
    // fontSize: 20
  },
  tabIconContainer: {
    position: "absolute",
    top: "35%",
    height: "10%",
    width: "7%",
    backgroundColor: "#DCC670",
    borderRadius: 7,
    right:-4,
  },
  tabIcon: {
    height: '100%',
    width: "100%",
    position:"relative",
    left:2
  },
  tabIconContainerLeft: {
    position: "absolute",
    top: "35%",
    height: "10%",
    width: "7%",
    backgroundColor: "#DCC670",
    borderRadius: 7,
    left:-4,
    zIndex:1
  },
  tabIconLeft: {
    height: "100%",
    width: "100%",
    position:"relative",
    left:-1
  },

  cityNameContainer: {
    height: 55,
    width: "83%",
    //backgroundColor: "#D2BE67",
    //backgroundColor: "rgba(210,190,103,1)",
    justifyContent: "center",
  },



  // listViewContainer: {
  //     position: "absolute",
  //     // top: 80,
  //     // left: 0,
  //     // right: 0,
  //     // bottom: 0,
  //     alignItems: "center",
  //     backgroundColor: "white",
  // },

  mainViewContainer: {
    position: "absolute",
    alignItems: "center",
    backgroundColor: "white"
  },

  listViewLeaderboradContainer: { //List view
    height: "100%",
    width: "100%",
    paddingLeft: 25,
    paddingRight: 25,
    // paddingTop: 75
    marginTop: "10%"
    // borderWidth: 1,
    // borderColor: "green"
    //flex: 1,
  },

  listViewPlaceNameContainer: {
    height: (height - 140) / 2,
    width: "100%",
    marginBottom: 15,
    borderRadius: 5
    // borderWidth: 1,
    // borderColor: "red"
  },

  placeRankContainerPopUp: {
    //borderWidth: 1,
    flexDirection: "row",
    marginLeft: 10
  },
  placeViewRankPopUp: {
    fontSize: 19,
    fontWeight: "bold"
    //borderWidth: 1,
  },
  placeRankTHPopUp: {
    fontSize: 12
  },
  listViewPlaceIcon: {
    height: "60%",
    width: "100%",
    borderRadius: 5
    // marginLeft: 10,
    //borderWidth: 1,
  },
  listViewBadgeIcon:{
      position:"absolute",
      top:0
  },
  listViewPlaceNameAndRankContainer: {
    height: "20%",
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    marginTop: 3,
    // borderWidth: 1,
  },

  listViewPlaceRankContainer: {
    height: 50,
    width: 50,
    borderRadius: 25,
    backgroundColor: "#313031",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center"
    //borderWidth: 1
  },

  listViewPlaceRank: {
    position:"absolute",
    left:20,
    top:18,
    color: "white",
    fontSize: 18,
    marginLeft: 3,
    fontFamily: "Museo Sans Cyrl"
    // borderWidth: 1,
    // borderColor: "white",
  },

  listViewPlaceRankTH: {
    color: "white",
    fontSize: 10,
    marginTop: -10,
    fontFamily: "Museo Sans Cyrl"
    // borderWidth: 1,
    // borderColor: "white",
  },

  listViewPlaceName: {
    flex: 1,
    marginLeft: 0,
    marginRight: 5
    //borderWidth: 1,
  },

  listViewPlaceNameText: {
    fontSize: 20,
    fontFamily: "Museo Sans Cyrl"
  },
  listViewPlaceDetailsContainer: {
    // top: "-6%",
    height: "20%",
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    // borderWidth: 1,
  },

  star: {
    height: 20,
    width: 20
  },

  listViewRatingsContainer: {
    top: "-5%",
    flex: 3,
    height: 20,
    flexDirection: "column",
    // borderWidth: 1,
  },
  listViewRatings: {
    flex: 3,
    height: 20,
    flexDirection: "row"
    //borderWidth: 1,
  },
  listViewPlaceDetails: {
    flex: 2,
    flexDirection: "row"
    //borderWidth: 1,
  },

  listViewPlaceDetailsIconContainer: {
    flex: 1,
    alignItems: "center"
    // borderWidth: 1,
  },

  placeDetailsIcon: {
    height: 35,
    width: 35
    //flex: 1,
  },

  placeDetailsText: {
    fontSize: 8,
    fontWeight: "bold",
    marginTop: 3,
    fontFamily: "Museo Sans Cyrl",
    alignItems: "center",
    justifyContent: "center",
  },

  map: {
    position: "absolute",
    marginTop: "28%",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0
  },
  currentLocationContainer: {
    position: "absolute",
    right: 10,
    bottom: 20,
    height: 40,
    width: 40
    //borderWidth: 1
  },
  currentLocation: {
    width: 40,
    height: 40
  },
  valueText:{
      color: "#DCC670",
      paddingRight: 7,
      fontSize:12
  },
  baseText:{
    fontSize:12
  },
  listbottomBarContainerMain:{
    flexDirection: "row",
    width:"100%",
  },
  topText: {
    flexDirection: "column",
    position: "relative",
    paddingTop: "5%",
    paddingBottom: "5%",
    width: "80%",
    // borderWidth:1
  },
  listbottomBarContainer:{
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    right: 0,
    height: "100%",
    width: "25%"
  },
  bottomBarContainer: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    right: 0,
    height: "100%",
    width: "25%",
  },
  topTextForMapContainer:{
    flexDirection: "row",
    width:"100%",
    position:"absolute",
    marginTop: "14%",
  },
  topTextForMap:{
    flexDirection: "column",
    // alignItems: "center",
    // justifyContent: "center",
    position: "relative",
    left: 15,
    width: "75%",
  },
  topPriceText: {
    flexDirection: "row",
    // alignItems: "center",
    // justifyContent: "center",
    position: "relative",
    // marginLeft: "7%",
    marginBottom: "2%",
    width: "70%",
    // borderWidth: 1,
    // borderColor:"red"
  },
  topRankText: {
    flexDirection: "row",
    // alignItems: "center",
    // justifyContent: "center",
    // marginLeft: "7%",
    position: "relative",
    marginBottom: "2%",
    width: "70%",
    // borderWidth: 1,
    // borderColor:"red"
  },

  filterIconContainer: {
    // position: "relative",
    // marginLeft: "40%",
    height: 30,
    width: 30,
    borderRadius: 30,
    // justifyContent: "center",
    // top: 20,
    // marginBottom: 20,
    // borderWidth: 1,
    // borderColor:"red"
  },
  listIconContainer: {
    // position: "relative",
    // marginRight: "40%",
    height: 30,
    width: 30,
    borderRadius: 30,
    // justifyContent: "center",
    // alignItems: "center",
    // borderWidth: 1,
    // borderColor:"red"
    // marginTop:"90%"
    // borderWidth: 1,
  },
  // listIcon: {
  //     height: 38,
  //     width: 38,
  // },

  loadingText: {
    color: "white",
    fontFamily: "Museo Sans Cyrl"
    //borderWidth: 1
  },

  loadingTextContainer: {
    position: "absolute",
    alignSelf: "center",
    bottom: 12,
    borderWidth: 1,
    width: 180,
    height: 30,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    borderColor: "rgba(0,0,0,0.5)",
    backgroundColor: "rgba(0,0,0,0.5)",
    elevation: 20
  },
  sliders: {
    margin: 10,
    // width: 280,
    padding: 25,
    alignSelf: 'center',
    // top:30,
    // width: "100%",
    // borderWidth: 1,
    // borderColor:"green"
  },
  text: {
    alignSelf: 'center',
    // paddingVertical: 5,
  },
  textLarge:{
    fontSize:20,
    alignSelf: 'center',
    fontWeight: '700'
  },
  textRegular:{
    fontSize:16,
    alignSelf: 'center',
    fontWeight: '700'

  },
  textBorder:{
    marginTop: 7,
    marginBottom: 7,
    width: "100%",
    height: 1,
    backgroundColor: "#000000"
  },
  textSmall:{
    fontSize:14,
    alignSelf: 'center',
    justifyContent: "center",
  },
  textExtra:{
    marginLeft:5,
    color:'#000000'
  },
  title: {
    fontSize: 14,
  },
  sliderOne: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom:15,
    top:0,
    marginTop:-30,
  },
  sliderIcons:{
    // flexDirection: 'row',
    justifyContent: 'center',
    alignSelf: 'center',
    marginBottom:5,
  },
  filterParameterContainer: {
      height: "100%",
      backgroundColor:"#DCC670",
      paddingTop: 40,
      flex: 1,
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      width:"100%",
      // borderWidth: 1,
      // borderColor:"red"
  },
  leftDrawerContainer: {
    // borderWidth: 1,
    // backgroundColor:"#DCC670"
    backgroundColor: "rgba(219,199,130,1)"
  },
  placeCount: {
    position: "relative",
    justifyContent: 'center',
    alignSelf: 'center',
    // paddingLeft:8,
    width:43,
  },
  placeType: {
    position: "relative",
    justifyContent: 'center',
    alignSelf: 'center',
    marginLeft:8,
    width:110,
    // width:"100%",
  },
  placeTypepickerStyle:{
      width:"45%",
      alignSelf: 'center',
      justifyContent:"center"
  },
  placeTypeText:{
    textAlign:"center",
    alignItems: 'center',
    justifyContent:"center"
  },
  placeCity: {
    position: "relative",
    justifyContent: 'center',
    alignSelf: 'center',
    marginLeft:8,
    width:80,
  },
  placeCitypickerStyle:{
      width:"40%",
  },
  cityName: {
    // paddingLeft: 10,
    fontSize: 20,
    color: "white",
    fontFamily: "Museo Sans Cyrl",
    // borderWidth: 1,
    // borderColor: "green"
  }
});
