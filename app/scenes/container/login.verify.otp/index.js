import React, { Component } from "react";
import { View, Text, Linking, KeyboardAvoidingView, Alert } from "react-native";
import TimerMixin from "react-timer-mixin";
import { NavigationActions } from "react-navigation";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

import {
  TextField,
  Button,
  TextFieldOTP,
  Separator,
  ErrorText,
  ProgressBar
} from "../../components";
import {
  UserDefaults,
  Global,
  Routes,
  stringsAlert,
  LoginManager,
  AlertManager,
  CommonManager,
  Color,
  CommonStyles,
  URLs,
  stringsUserDefaults,
  NetworkRequest
} from "../../../utils";
import { HeaderGetStartedSuperLarge } from "../../../scenes/layouts";
import styles from "../login.signup.name/styles";
import PropTypes from 'prop-types';

export default class LoginVerifyOTPScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      otp: "",
      password: "",
      isOTP: false,
      isFirstOTPSent: false,
      otpReSent: false,
      isUserExist: true,
      isFromForgotPass: false,
      invalidMessageVisible: false,
      errorMsg: "",
      timeRemain: 30,
      btnOTPText: "Resend OTP after 00:30 sec",
      timer: null,
      isPasswordNotVisible: false,
      isDisabled: false,
      isLoading: false
    };
    this._verifyOTP = this._verifyOTP.bind(this);
    this._verifyPass = this._verifyPass.bind(this);
    this.switchOTPandPass = this.switchOTPandPass.bind(this);
    this.resendOTP = this.resendOTP.bind(this);
    this.goToForgotPasswordReset = this.goToForgotPasswordReset.bind(this);
    this.tickTimer = this.tickTimer.bind(this);
    this.goToDashboard = this.goToDashboard.bind(this);
    this.goToUpdatePassword = this.goToUpdatePassword.bind(this);
    this.getCityList = this.getCityList.bind(this);
  }

  componentDidMount() {
    var isUserExist = this.props.navigation.state.params.isUserExist;
    var isFromForgotPass = this.props.navigation.state.params.isFromForgotPass;
    var isOTP = false;
    if (!isUserExist) {
      isOTP = true;
      this.tickTimer();
    }
    this.setState({
      isUserExist: isUserExist,
      isFromForgotPass: isFromForgotPass,
      isOTP: isOTP
    });
  }

  componentWillUnmount() {
    this.stopTimer();
  }

  _verifyOTP() {
    this.setState({ isDisabled: true, isLoading: true });
    var otp = this.state.otp.trim();
    var isFromForgotPass = this.state.isFromForgotPass;
    if (otp.length === 6) {
      // ===
      const { params } = this.props.navigation.state;
      var _this = this;
      LoginManager.verifyOTP(
        params.mobile,
        params.countryCode,
        otp,
        params.isUserExist,
        isFromForgotPass,
        false,
        _this
      )
        .then(result => {
          // result.success = true // Test
          if (result.success) {
            this.setState({ isDisabled: false, isLoading: false });
            let param = {
              countryCode: params.countryCode,
              mobile: params.mobile
              // Otp is added as special case, dont add here
            };
            if (params.isUserExist) {
              // if (isFromForgotPass) {
              //   param.otp = otp
              //   param.isFromForgotPass = true
              //   this.goToForgotPasswordReset(param)
              // } else {
              if (!result.response.user.tempPassword) {
                // this.goToDashboard(param)
                this.getCityList(param);
              } else {
                this.goToUpdatePassword();
              }
              // }
            } else {
              this.goToSignUpFlow(param);
            }
          } else {
            this.setState({
              invalidMessageVisible: true,
              errorMsg: result.message,
              isDisabled: false,
              isLoading: false
            });
          }
        })
        .catch(CommonManager.handleError);
    } else {
      this.setState({
        invalidMessageVisible: false,
        errorMsg: "",
        isDisabled: false,
        isLoading: false
      });
    }
  }

  _verifyPass() {
    this.setState({ isDisabled: true, isLoading: true });
    var pass = this.state.password.trim();
    if (pass.length > 0) {
      // ===
      const { params } = this.props.navigation.state;
      var _this = this;
      LoginManager.login(
        params.mobile,
        params.countryCode,
        pass,
        0,
        false,
        _this
      )
        .then(result => {
          if (result.success) {
            this.setState({ isDisabled: false, isLoading: false });
            let param = {
              countryCode: params.countryCode,
              mobile: params.mobile
            };
            if (params.isUserExist && !result.response.user.tempPassword) {
              this.getCityList(param);
            } else {
              this.goToUpdatePassword();
            }
          } else {
            this.setState({
              invalidMessageVisible: true,
              errorMsg: result.message,
              isDisabled: false,
              isLoading: false
            });
          }
        })
        .catch(CommonManager.handleError);
    } else {
      this.setState({
        invalidMessageVisible: true,
        errorMsg: "",
        isDisabled: false,
        isLoading: false
      });
    }
  }

  getCityList(param) {
    UserDefaults.get(stringsUserDefaults.userToken)
      .then(token => {
        let params = "token=" + token;
        var _this = this;
        NetworkRequest(_this, "POST", URLs.getAllCities, params)
          .then(result => {
            if (result.success) {
              if (result.response.code === 200) {
                if (result.response.cities.length > 0) {
                  this.setState({
                    cityList: result.response.cities
                  });

                  UserDefaults.set(
                    stringsUserDefaults.city_list,
                    result.response.cities
                  );

                  this.goToDashboard(param);
                } else {
                  this.goToDashboard(param);
                }
              } else if (result.response.code === 500) {
                this.goToDashboard(param);
              }
            } else {
              this.goToDashboard(param);
            }
          })
          .catch(error => {
            this.goToDashboard(param);
            console.error(error);
          });
      })
      .catch(error => {
        this.goToDashboard(param);
        console.error(error);
      });
  }

  resendOTP() {
    if (!this.state.isFirstOTPSent && this.state.isUserExist) {
      this.setState({
        isFirstOTPSent: true,
        otpReSent: false,
        btnOTPEnabled: false
      });
    } else {
      this.setState({
        isFirstOTPSent: true,
        otpReSent: true,
        btnOTPEnabled: false,
        timeRemain: 30
      });
    }

    const { params } = this.props.navigation.state;
    var _this = this;
    LoginManager.resendOTP(
      params.mobile,
      params.countryCode,
      params.isUserExist,
      false,
      _this
    )
      .then(result => {
        if (result.success) {
          //AlertManager.Alert(2002);
          this.tickTimer();
          this.setState({ otpReSent: false, btnOTPEnabled: true });
        } else {
          this.setState({ otpReSent: false, btnOTPEnabled: true });
        }
      })
      .catch(CommonManager.handleError);
  }

  tryWithPass() {
    this.setState({ isFromForgotPass: false, isOTP: false });
  }

  switchOTPandPass() {
    if (this.state.isFromForgotPass) {
      this.setState({
        isFromForgotPass: false,
        isOTP: false,
        invalidMessageVisible: false,
        errorMsg: ""
      });
    } else {
      if (!this.state.isOTP) {
        this.state.timeRemain = 30;
        this.tickTimer();
      } else {
        this.stopTimer();
      }
      if (!this.state.isOTP && !this.state.isFirstOTPSent) {
        this.resendOTP();
      }

      this.setState({
        isOTP: !this.state.isOTP,
        invalidMessageVisible: false,
        errorMsg: "",
        btnOTPEnabled: false,
        timeRemain: 30,
        btnOTPText: "Resend OTP after 00:30 sec"
      });
    }
  }

  openTermsAndCondition() {
    Linking.openURL(URLs.TOCURL).catch(err =>
      console.error("An error occurred", err)
    );
  }

  tickTimer() {
    var timeRemain = this.state.timeRemain;
    var timer = TimerMixin.setInterval(() => {
      if (timeRemain > 0) {
        timeRemain -= 1;
        var time = "00:" + timeRemain;
        if (timeRemain < 10) {
          time = "00:0" + timeRemain;
        }
        this.setState({
          btnOTPText: "Resend OTP after " + time + " sec",
          timeRemain: timeRemain,
          btnOTPEnabled: false
        });
      } else {
        this.stopTimer();
        this.setState({ btnOTPText: "Resend OTP", btnOTPEnabled: true });
      }
    }, 900);
    this.setState({ timer: timer });
    //here
  }

  stopTimer() {
    TimerMixin.clearInterval(this.state.timer);
  }

  goToUpdatePassword() {
    const resetAction = NavigationActions.reset({
      index: 0,
      key: null,
      actions: [
        NavigationActions.navigate({
          routeName: Routes.updatePasswordScreen
        })
      ]
    });
    this.props.navigation.dispatch(resetAction);
  }

  goToDashboard(params) {
    const resetAction = NavigationActions.reset({
      index: 0,
      key: null,
      actions: [
        NavigationActions.navigate({
          routeName: Routes.tabbarNav
        })
      ]
    });
    this.props.navigation.dispatch(resetAction);
    // this.props.navigation.navigate(Routes.tabbarNav, params)
  }

  goToSignUpFlow(params) {
    this.props.navigation.navigate(Routes.loginSignupNameScreen, params);
  }

  goToForgotPasswordReset(params) {
    this.props.navigation.navigate(Routes.loginSignupPasswordScreen, params);
  }

  render() {
    var header = "Welcome back,";
    var desc = "Enter your password";
    var errorMsg = stringsAlert.invalidPassword.message;
    const { params } = this.props.navigation.state;
    if (this.state.isOTP) {
      desc = "OTP has been send to +" + params.countryCode + params.mobile;
      errorMsg = stringsAlert.invalidOTP.message;
    }
    if (this.state.errorMsg.length > 2) {
      errorMsg = this.state.errorMsg;
    }
    if (!this.state.isUserExist) {
      header = "Welcome";
    }

    // else if (this.state.isFromForgotPass) {
    //   mainActionTitle = 'Verify'
    //   header = 'Verify your mobile number'
    //   desc = 'Using a one time passcode (OTP), that we have sent you on your mobile number.'
    // }

    return (
      <View style={{ flex: 1, backgroundColor: "white" }}>
        <KeyboardAvoidingView style={styles.containerMain} behavior="position">
          <HeaderGetStartedSuperLarge
            header={header}
            description={desc}
            descriptionStyle={{ width: Global.screenWidth - 34 }}
          />

          {this.state.isOTP ? (
            <View style={{ paddingTop: 10 }}>
              <TextFieldOTP
                focusOnComponentMount
                setOTP={otp => {
                  this.setState({ otp: otp });
                  console.log(this.state.otp);
                }}
                size={48}
                widthOtp={Global.screenWidth * 0.8}
                length={6}
                style={[{ paddingBottom: 10 }]}
                onChangeText={text =>
                  this.setState({ invalidMessageVisible: false, errorMsg: "" })
                }
              />
            </View>
          ) : (
            <View
              style={{
                width: Global.screenWidth * 0.8,
                alignSelf: "center",
                height: 60,
                paddingTop: 10
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  alignContent: "center"
                }}
              >
                <TextField
                  focusOnComponentMount
                  showSeparator={false}
                  ref="passwordTextField"
                  secureTextEntry={!this.state.isPasswordNotVisible}
                  value={this.state.password}
                  height={50}
                  placeholder="Please enter password"
                  onChangeText={text =>
                    this.setState({
                      password: text,
                      invalidMessageVisible: false,
                      errorMsg: ""
                    })
                  }
                  onSubmitEditing={() => {
                    this._verifyPass();
                  }}
                  style={[
                    styles.textPass,
                    { width: Global.screenWidth * 0.58 }
                  ]}
                />
                <MaterialIcons.Button
                  name={
                    this.state.isPasswordNotVisible
                      ? "visibility-off"
                      : "visibility"
                  }
                  backgroundColor={"#FFFFFFFF"}
                  color={
                    this.state.password.length <= 4
                      ? Color._A2GrayCountryCode
                      : Color._36
                  }
                  onPress={() =>
                    this.state.password.length <= 4
                      ? null
                      : this.setState({
                          isPasswordNotVisible: !this.state.isPasswordNotVisible
                        })
                  }
                  underlayColor="#FFF"
                  size={24}
                  style={{
                    marginTop: 10,
                    marginBottom: -5,
                    padding: 10,
                    marginLeft: 32
                  }}
                />
              </View>
              <Separator />
            </View>
          )}

          <ErrorText
            message={errorMsg}
            invalidMessageVisible={this.state.invalidMessageVisible}
          />

          <Button
            onPress={this.state.isOTP ? this.resendOTP : null}
            title={this.state.isOTP ? this.state.btnOTPText : ""}
            style={{
              height: 30,
              borderColor: "white",
              width: Global.screenWidth - 32,
              alignSelf: "center"
            }}
            titleStyle={{ color: Color.blueSkyLink }}
            isDisabled={!this.state.btnOTPEnabled && this.state.isOTP}
          />
          {/*<View style={{ flex: 1 }} />*/}
          {this.state.isOTP ? (
            <View style={[styles.containerSub2]}>
              <Button
                isDisabled={this.state.isDisabled}
                onPress={this.state.isOTP ? this._verifyOTP : this._verifyPass}
                title={"Proceed"}
                style={styles.btnProceed}
              />
              {this.state.isUserExist && (
                <Button
                  isDisabled={this.state.isOTP ? false : this.state.isDisabled}
                  onPress={this.switchOTPandPass}
                  title={this.state.isOTP ? "Use Password" : "Send me an OTP"}
                  style={[styles.btnProceed, styles.btnResendOTP]}
                />
              )}
            </View>
          ) : (
            <View style={[styles.containerSub3]}>
              <Button
                isDisabled={this.state.isDisabled}
                onPress={this.state.isOTP ? this._verifyOTP : this._verifyPass}
                title={"Proceed"}
                style={styles.btnProceed}
              />
              {this.state.isUserExist && (
                <Button
                  onPress={this.switchOTPandPass}
                  title={this.state.isOTP ? "Use Password" : "Send me an OTP"}
                  style={[styles.btnProceed, styles.btnResendOTP]}
                />
              )}
            </View>
          )}
        </KeyboardAvoidingView>
        <View style={styles.containerSub2}>
          <Text style={[CommonStyles.textDescription2]}>
            By signing {this.isUserExist ? "in" : "up"}, you accept our
          </Text>
          <Button
            onPress={this.openTermsAndCondition}
            title={"terms and conditions"}
            style={{
              height: 20,
              borderColor: "white",
              width: 230,
              alignSelf: "center",
              marginTop: 4
            }}
            titleStyle={{ color: Color.blueSkyLink }}
          />
        </View>

        {this.state.isLoading ? <ProgressBar /> : null}
      </View>
    );
  }
}

LoginVerifyOTPScreen.propTypes = {
  mobile: PropTypes.string,
  countryCode: PropTypes.string,
  isUserExist: PropTypes.bool,
  isFromLogin: PropTypes.bool,
  isFromForgotPass: PropTypes.bool,
  navigation: PropTypes.object
};

LoginVerifyOTPScreen.defaultProps = {
  mobile: "",
  countryCode: "",
  isUserExist: true,
  isFromLogin: true,
  isFromForgotPass: false
};
