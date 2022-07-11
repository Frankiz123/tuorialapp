/**
 * toggle-switch-react-native
 * Toggle Switch component for react native, it works on iOS and Android
 * https://github.com/aminebenkeroum/toggle-switch-react-native
 * Email:amine.benkeroum@gmail.com
 * Blog: https://medium.com/@aminebenkeroum/
 * @benkeroumamine
 */

import React from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Animated,
  Platform,
  Image
} from "react-native";

import PropTypes from "prop-types";
import LottieView from "lottie-react-native";

export default class ToggleSwitch extends React.Component {
  static calculateDimensions(size) {
    switch (size) {
      case "small":
        return {
          width: 90,
          padding: 5,
          circleWidth: 15,
          circleHeight: 15,
          translateX: 22
        };
      case "large":
        return {
          width: 85,
          padding: 8.5,
          circleWidth: 38,
          circleHeight: 38,
          translateX: 43
        };
      default:
        return {
          width: 70,
          padding: 0,
          circleWidth: 18,
          circleHeight: 18,
          translateX: 26
        };
    }
  }

  static propTypes = {
    isOn: PropTypes.bool.isRequired,
    label: PropTypes.string,
    onColor: PropTypes.string,
    offColor: PropTypes.string,
    size: PropTypes.string,
    labelStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.number]),
    thumbOnStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.number]),
    thumbOffStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.number]),
    trackOnStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.number]),
    trackOffStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.number]),
    onToggle: PropTypes.func,
    icon: PropTypes.object,
    disabled: PropTypes.bool,
    animationSpeed: PropTypes.number,
    useNativeDriver: PropTypes.bool,
    circleColor: PropTypes.string
  };

  static defaultProps = {
    isOn: false,
    onColor: "#4cd137",
    offColor: "#ecf0f1",
    size: "medium",
    labelStyle: {},
    thumbOnStyle: {},
    thumbOffStyle: {},
    trackOnStyle: {},
    trackOffStyle: {},
    icon: null,
    disabled: false,
    animationSpeed: 300,
    useNativeDriver: true,
    circleColor: "white"
  };

  offsetX = new Animated.Value(0);
  dimensions = ToggleSwitch.calculateDimensions(this.props.size);

  createToggleSwitchStyle = () => [
    {
      justifyContent: "center",
      width: this.dimensions.width + 5,
      borderRadius: 20,
      padding: this.dimensions.padding,
      backgroundColor: this.props.isOn
        ? this.props.onColor
        : this.props.offColor,
      position: "relative"
    },
    this.props.isOn ? this.props.trackOnStyle : this.props.trackOffStyle
  ];

  createInsideCircleStyle = (isOn) => [
    {
      alignItems: "center",
      justifyContent: "center",
      margin: Platform.OS === "web" ? 0 : 4,
      left: Platform.OS === "web" ? 4 : isOn ? 6 : 0,
      position: "absolute",
      backgroundColor: this.props.circleColor,
      transform: [{ translateX: this.offsetX }],
      width: this.dimensions.circleWidth,
      height: this.dimensions.circleHeight,
      borderRadius: this.dimensions.circleWidth / 2,
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 2
      },
      shadowOpacity: 0.2,
      shadowRadius: 2.5,
      elevation: 1.5
    },
    this.props.isOn ? this.props.thumbOnStyle : this.props.thumbOffStyle
  ];

  render() {
    const { isOn, onToggle, disabled, labelStyle, label, icon } = this.props;

    const toValue = isOn
      ? this.dimensions.width - this.dimensions.translateX
      : 0;

    Animated.timing(this.offsetX, {
      toValue,
      duration: this.props.animationSpeed,
      useNativeDriver: this.props.useNativeDriver
    }).start();

    return (
      <View style={styles.container}>
        {label ? (
          <Text style={[styles.labelStyle, labelStyle]}>{label}</Text>
        ) : null}
        <TouchableOpacity
          style={this.createToggleSwitchStyle()}
          activeOpacity={0.8}
          onPress={() => (disabled ? null : onToggle(!isOn))}
        >
          {!isOn && (
            <LottieView
              autoPlay={true}
              style={{
                width: 100,
                height: 80,
                // alignSelf: "center",
                // marginTop: Platform.OS === "android" ? 0 : -4,
                position: "absolute",
                left: -15
              }}
              source={require("../assets/focus2.json")}
              loop={true}
            />
          )}
          <View style={{ flexDirection: "row" }}>
            {!isOn ? (
              <Text
                style={{
                  alignSelf: "center",
                  textAlign: "center",
                  left: 35,
                  fontSize: 12
                }}
              >
                Explore
              </Text>
            ) : (
              <>
                <Text style={{ left: 0, fontWeight: "bold", fontSize: 12 }}>
                  E
                </Text>
                <Text style={{ left: 0, fontSize: 12 }}>arn</Text>
              </>
            )}
          </View>
          <Animated.View style={this.createInsideCircleStyle(isOn)}>
            <Image
              source={require("./blacklogo.png")}
              style={{ width: 30, height: 30, alignSelf: "center" }}
            />
          </Animated.View>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center"
  },
  labelStyle: {
    marginHorizontal: 10
  }
});
