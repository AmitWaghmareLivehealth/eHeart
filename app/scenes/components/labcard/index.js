import React, { Component } from "react";
import { View, Text, Image, StyleSheet, Animated } from "react-native";
import { Images, Color, CommonStyles } from "../../../utils";
import Ripple from "../ripple";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

export default class LabCard extends Component {
  constructor(props) {
    super(props);
    this.springValue = new Animated.Value(1);
    this.state = {
      springVal: new Animated.Value(1),
      headerText: this.props.headerText,
      subheaderText: this.props.subheaderText,
      image: this.props.image,
      actualType: this.props.actualType,
      onPressAction: this.props.onPressAction || "",
      animated: this.props.animated
    };
  }

  spring1() {
    this.springValue.setValue(0.99);
    Animated.spring(this.state.springVal, {
      toValue: 0.97
    }).start();
  }

  spring2() {
    this.springValue.setValue(0.97);
    Animated.spring(this.state.springVal, {
      toValue: 1
    }).start();
  }

  render() {
    return (
      <Animated.View
        style={[
          { transform: [{ scale: this.state.springVal }] },
          styles.container,
          CommonStyles.commonShadow,
          this.props.styles
        ]}
      >
        <Ripple
          rippleOpacity={0.2}
          onPressIn={this.spring1.bind(this)}
          onPressOut={this.spring2.bind(this)}
          onPress={() => {
            if (this.state.onPressAction) {
              this.state.onPressAction();
            }
          }}
        >
          <View style={{ paddingLeft: 17, paddingRight: 17, paddingTop: 17 }}>
            <View style={styles.innerContainer}>
              {this.state.headerText ? (
                <Text style={[CommonStyles.common_header, { paddingLeft: 0 }]}>
                  {this.state.headerText}
                </Text>
              ) : null}
            </View>
            <Text
              style={{
                fontFamily: "Arial",
                color: Color._54,
                fontSize: 14,
                paddingTop: 4
              }}
            >
              {this.state.subheaderText}
            </Text>

            <View
              style={{
                flexDirection: "row",
                marginTop: 8
              }}
            >
              <View
                style={{
                  backgroundColor: "white"
                }}
              >
                <Text
                  style={{
                    padding: 4,
                    fontSize: 10,
                    color: "white",
                    backgroundColor: this.props.isOpen
                      ? Color.themeColor
                      : "grey",
                    borderRadius: 4
                  }}
                >
                  {this.props.isOpen ? "OPEN" : "CLOSED"}
                </Text>
              </View>
              <Text
                style={{
                  fontFamily: "Arial",
                  color: Color._A3,
                  fontSize: 16,
                  fontWeight: "400",
                  paddingBottom: this.state.actualType ? 17 : 12,
                  paddingLeft: 10
                }}
              >
                {this.state.actualType}
              </Text>

              <View style={{ position: "absolute", right: 0, bottom: 8 }}>
                <View style={{ flexDirection: "row" }}>
                  <MaterialIcons
                    name={"location-on"}
                    size={18}
                    style={{
                      color: "red",
                      paddingHorizontal: 0
                    }}
                  />
                  <Text style={{ color: "black", alignSelf: "center" }}>
                    {this.props.textType1} Kms
                  </Text>
                </View>
                <Text style={{ alignSelf: "center", fontSize: 10 }}>
                  Approx. {this.props.textType2}{" "}
                </Text>
              </View>
            </View>
          </View>
        </Ripple>
      </Animated.View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    marginTop: 10,
    marginBottom: 10,
    borderRadius: 8,
    backgroundColor: "white",
    elevation: 6,
    marginLeft: 18,
    marginRight: 18
  },
  innerContainer: { flexDirection: "row", alignItems: "center" }
});
