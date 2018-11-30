import React, { Component } from "react";
import {
  Dimensions,
  Image,
  PanResponder,
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  RefreshControl
} from "react-native";
import Consts from "../consts/Consts";
import Backend from "../core/Backend";
import Memory from "../core/Memory";
import {
  GoogleAnalyticsTracker,
  GoogleAnalyticsSettings,
  GoogleTagManager
} from "react-native-google-analytics-bridge";
const { height, width } = Dimensions.get("window");
export default class PlaceList extends Component {
  static navigationOptions = {
    gesturesEnabled: false,
    header: null
  };

  constructor(props) {
    super(props);
    this.state = {
      refreshing: false,
    };
    console.log(JSON.stringify(this.props));
    if (!props.names) {
      console.warn("Props ‘names’ is not set. The list will not be displayed");
    }
    this.tracker = new GoogleAnalyticsTracker(Consts.GA_KEY);
      // console.log("CHECK PROPS");
      // console.log(JSON.stringify(this.props.names));
  }



  render() {
    return (
      <ScrollView style={styles.userListsContainer}

        >
        {this.props.names &&
          this.props.names.map((i, j) => {
            return (
              <View key={j} style={[styles.placeNameContainer]}>
                <View style={styles.rankContainer}>
                  <Text style={styles.rank}>#{j + 1}</Text>
                </View>
                <TouchableOpacity
                  style={styles.placeNameTextContainer}
                  /*onPress={() => {
                    i.name
                      ? this.props.addPlace(this.props.value, i.name, i.id)
                      : null;
                  }}*/
                >
                  <View>
                    <Text numberOfLines={1} style={styles.placeName}>
                      {i.name}
                    </Text>
                  </View>
                </TouchableOpacity>
                  {
                      i.name && <TouchableOpacity   onPress={() => {
                          i.name
                              ? this.props.addPlace(this.props.value, i.name, i.id)
                              : null;
                      }}><Image
                          style={styles.dragIcon}
                          // source={require("../icons/drag_black.png")}
                      />
                  </TouchableOpacity>
                  }
              </View>
            );
          })}
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  userListsContainer: {
    width: width * 0.88,
    height: "auto"
    // borderWidth: 1,
    // borderColor: "red”
  },
  placeNameContainer: {
    flexDirection: "row",
    height: height * 0.08,
    alignItems: "center",
    paddingLeft: 20,
    marginLeft:8,
    borderBottomWidth: 1,
    borderColor: "white"
  },

  rankContainer: {
    height: 30,
    width: 30,
    borderRadius: 15,
    backgroundColor: "black",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    // marginLeft: 4
  },

  rank: {
    // marginLeft: 4,
    color: "white",
    fontWeight: "bold",
    fontFamily: "Museo Sans Cyrl"
  },

  rankTH: {
    color: "white",
    fontSize: 6,
    marginTop: -8,
    fontFamily: "Museo Sans Cyrl"
  },

  placeNameTextContainer: {
    backgroundColor: "rgba(0,0,0,0)",
    width: "75%",
    height: "50%",
    overflow: "hidden",
  },

  placeName: {
    fontSize: 18,
    marginLeft: 10,
    color: "black",
    fontFamily: "Museo Sans Cyrl",
    //width: "90%",
    //borderWidth:1,
  },

  dragIcon: {
    //position: "absolute”,
    marginLeft: 10
    //right: 10,
  }
});
