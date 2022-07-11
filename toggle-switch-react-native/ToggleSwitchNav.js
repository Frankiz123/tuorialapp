import React from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Animated,
  Platform
} from "react-native";

import PropTypes from "prop-types";
import Icon from "react-native-vector-icons/Feather";
export default class ToggleSwitchNav extends React.Component {
  static calculateDimensions(size) {
    switch (size) {
      case "small":
        return {
          width: 40,
          padding: 10,
          circleWidth: 15,
          circleHeight: 15,
          translateX: 22
        };
      case "large":
        return {
          width: 80,
          padding: 5,
          circleWidth: 35,
          circleHeight: 35,
          translateX: 37
        };
      default:
        return {
          width: 46,
          padding: 12,
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
  dimensions = ToggleSwitchNav.calculateDimensions(this.props.size);

  createToggleSwitchStyle = () => [
    {
      justifyContent: "center",
      width: this.dimensions.width,
      borderRadius: 20,
      padding: this.dimensions.padding,
      backgroundColor: this.props.isOn
        ? this.props.onColor
        : this.props.offColor
    },
    this.props.isOn ? this.props.trackOnStyle : this.props.trackOffStyle
  ];

  createInsideCircleStyle = () => [
    {
      alignItems: "center",
      justifyContent: "center",
      margin: Platform.OS === "web" ? 0 : 0.5,
      left: Platform.OS === "web" ? 0 : 0,
      position: "absolute",
      backgroundColor: "black",
      transform: [{ translateX: this.offsetX }],
      width: this.dimensions.circleWidth + 2,
      height: this.dimensions.circleHeight + 2,
      borderRadius: this.dimensions.circleWidth / 2,
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 2
      },
      shadowOpacity: 0.2,
      shadowRadius: 2.5,
      elevation: 1.5,
      borderColor: "#DFBD69",
      borderWidth: 2,
      borderRadius: 100
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
          <View
            style={{ flexDirection: "row", justifyContent: "space-around" }}
          >
            <Text
              style={{
                alignSelf: "flex-start",
                textAlign: "center",
                fontSize: 14,
                fontWeight: "bold",
                right: 3
              }}
            >
              Filter
            </Text>
            <Text
              style={{
                alignSelf: "flex-end",
                textAlign: "center",
                fontSize: 14,
                left: 2,
                fontWeight: "bold"
              }}
            >
              Filter
            </Text>
          </View>
          <Animated.View style={this.createInsideCircleStyle()}>
            <Icon name="arrow-down" size={15} color={"white"} />
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
