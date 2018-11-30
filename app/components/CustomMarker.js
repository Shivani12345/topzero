'use strict';

import React from 'react';
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
  Slider
} from "react-native";

import AnimatedHideView from 'react-native-animated-hide-view';
import PropTypes from 'prop-types';

export default class CustomMarker extends React.Component {

  static propTypes = {
    pressed: PropTypes.bool
  };

  static defaultProps = {
    pressed: false
  };

  constructor(props) {
    super(props);
    //console.log("STATE FROM CUSTOM MARKER");
    //console.log(this.props);
    this.state = {
            isChildVisible: true
    };

  }
  render() {
    return (
      <View>
        <AnimatedHideView visible={this.props.pressed} unmountOnHide={true} style={styles.container}>
          <View style={styles.diamond}>
            <Text style={styles.tooltiptext}>{this.props.currentValue}</Text>
          </View>
        </AnimatedHideView>
        <View style={styles.round}>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    position:"absolute",
    // left: -5,
    bottom: 34,
    width: 32,
    height: 32,
    backgroundColor: '#bca562',
    borderRadius: 50,
    zIndex:-1,
  },
  round:{
    top: 2,
    width: 25,
    height: 25,
    backgroundColor: 'white',
    shadowOpacity: 0.5,
    shadowRadius: 5,
    shadowColor: "black",
    borderRadius: 50,
    zIndex:-1,
  },
  diamond: {
    position:"absolute",
    top: 20,
    width: 0,
    height: 0,
    borderLeftWidth: 16,
    borderLeftColor: 'transparent',
    borderRightWidth: 16,
    borderRightColor: 'transparent',
    borderTopWidth: 18,
    borderTopColor: '#bca562',
    borderRadius: 18,
    zIndex:-1
  },
  tooltiptext:{
    color:"white",
    position: "absolute",
    bottom:15,
    left:-14,
    height:15,
    width:26,
    fontSize:12,
    textAlign: 'center',
  }

});
