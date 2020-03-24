import React, { Component } from "react";
import { View, Image } from "react-native";
import { NavigationActions } from "react-navigation";

import styles from "./styles";
import { Images, LoginManager, Routes } from "../../../utils";

export default class SplashScreen extends Component {
  constructor(props) {
    super(props);
    this.navigatoWithLoginState = this.navigatoWithLoginState.bind(this);
  }

  componentDidMount() {
    // setReduxUserDefaults()
    LoginManager.isLoggedIn()
      .then(result => {
        setTimeout(() => {
          this.navigatoWithLoginState(result.success);
        }, 1000);
      })
      .catch(error => console.log(error));
  }

  navigatoWithLoginState(loginSuccess) {
    const resetAction = NavigationActions.reset({
      index: 0,
      actions: [
        NavigationActions.navigate({
          routeName: loginSuccess ? Routes.tabbarNav : Routes.loginIntroScreen
          // routeName: loginSuccess ? Routes.labScreen : Routes.loginIntroScreen
        })
      ]
    });
    this.props.navigation.dispatch(resetAction);
  }

  render() {
    return (
      <View style={styles.containerMain}>
        <Image
          style={styles.imageLivehealthLogo}
          source={Images.imageLivehealthLogoWithTag}
        />
      </View>
    );
  }
}
