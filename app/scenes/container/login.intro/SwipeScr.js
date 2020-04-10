import React, { Component } from "react";
import { StyleSheet, Image, View, Platform } from "react-native";

import GetStarted from "../login.getstarted";
import { Global, Images, Color } from "../../../utils";
import { HeaderGetStartedSuperLarge } from "../../layouts";

export default class SwipeScr extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    var screenNumber = this.props.screenNo || 1;
    var image = Images.imageIntro1;
    var title = "Your Health Records";
    var desc =
      `Get your digital records directly on your mobile device from ${Global.labName} labs`;
    if (screenNumber === 2) {
      image = Images.imageIntro2;
      title = "Progress of your Tests";
      desc =
        "Check the status of your diagnostic reports in real time, get notified when your reports are ready";
    } else if (screenNumber === 3) {
      image = Images.imageIntro3;
      title = "Track your Health";
      desc =
        "Monitor your health with recommended trackers personalised for you";
    }
    if (this.props.screenNo <= 3) {
      return (
        <View style={styles.card}>
          <View style={{ paddingLeft: 20, width: Global.screenWidth * 0.95 }}>
            <Image source={image} style={styles.imageStyle} />
          </View>
          <HeaderGetStartedSuperLarge
            header={title}
            description={desc}
            style={{ alignItems: "center", paddingTop: 0 }}
            headerStyle={{ textAlign: "center" }}
            descriptionStyle={{ textAlign: "center", color: Color._9B }}
          />
        </View>
      );
    } else {
      return <GetStarted style={{ flex: 1 }} screenNo="4" {...this.props} />;
    }
  }
}
const styles = StyleSheet.create({
  card: {
    backgroundColor: "white",
    width: Global.screenWidth,
    height: Global.screenHeight
  },
  imageStyle: {
    width: Global.screenWidth-100,
    height: Global.screenWidth-20,
    aspectRatio: 1,
    alignSelf: "center"
  }
});
