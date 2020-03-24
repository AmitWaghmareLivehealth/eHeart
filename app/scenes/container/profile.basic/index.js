import React, { Component } from "react";
import {
  View,
  Text,
  Modal,
  TextInput,
  Picker,
  ScrollView,
  KeyboardAvoidingView,
  Alert,
  StyleSheet
} from "react-native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import styles from "./styles";
import RadioForm, {
  RadioButton,
  RadioButtonInput,
  RadioButtonLabel
} from "react-native-simple-radio-button";
import DialogHeader from "../../components/dialog.header";
// import ProgressBar from '../../components/progress.basic'

import {
  NetworkRequest,
  URLs,
  Color,
  Global,
  stringsSex,
  stringsDesignation,
  UserDefaults,
  stringsUserDefaults,
  LoginManager,
  CommonManager,
  CommonStyles,
  Routes
} from "../../../utils";
import moment from "moment";
import { HeaderListExtraLarge } from "../../layouts";
import {
  ProgressBar,
  ModalBox,
  CloseBar,
  TextFieldOTP,
  Separator,
  ErrorText,
  Button,
  InsuranceModal
} from "../../components";
import Ripple from "../../components/ripple";
import { isValidEmail } from "../../../utils/exts/strings";
import { Select, Option } from "react-native-chooser";
import DatePicker from "../../components/datepicker";
import Profile from "../profile.profile";
import { TabViewAnimated, TabBar, SceneMap } from "../../components/tabbar/";
import ProfileTracker from "../../components/profile.tracker";

import BasicProfilePersonal from "../profile.basic.personal";
import BasicProfileLifestyle from "../profile.basic.lifestyle";
import TimerMixin from "react-timer-mixin";
import { connect } from "react-redux";
import { setDemographics } from "../../../redux/actions";

var _this = null;

const heightParams = {
  cm: "cm",
  ft: "ft"
};

args_bundle = {};

function toTitleCase(str) {
  return str.replace(/\w\S*/g, function(txt) {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
}

class BasicProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      args_bundle: args_bundle,
      value: 0,
      flag: 0,
      modal_visible_new: false,
      designation: stringsDesignation.Mr,
      user: this.props.user || "",
      userName: "",
      userName_edit: "",
      email: "",
      email_edit: "",
      gender: "",
      dob: "",
      city: "",
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
      contact: "",
      profilepic: "",
      oldPassword_error: "",
      image: "",
      newPassword_error: "",
      confirmPassword_error: "",
      tempPassword: 0,
      changesMade: 0,
      scnd: 0,
      renewData: this.props.renewData,
      genderArray: [
        { label: stringsSex.Male, value: 0 },
        { label: stringsSex.Female, value: 1 },
        { label: stringsSex.Other, value: 2 }
      ],
      isLoading: false,
      date_visible: false,
      routes: [
        { key: "1", title: "Personal" },
        { key: "2", title: "Lifestyle" }
      ],
      index: 0,
      picker_visible: false,
      pickerHeader: "",
      pickerData: [],

      industryType: "",
      occupation: "",
      bloodGroup: "",
      companyName: "",
      isDiabetic: "",
      isChronic: "",
      isSmoker: "",
      hasInsurance: "",
      consumesAlcohol: "",
      insuranceIndex: -1,
      diabeticIndex: -1,
      chronicIndex: -1,
      smokerIndex: -1,
      alcoholIndex: -1,
      heightParams: heightParams.cm,
      inputChange: 0,
      weight: this.props.weight,
      heightInCm: this.props.height,
      heightInFeet: 0,
      heightInInch: 0,
      otpMatch: false,
      btnOTPText: "Resend OTP after 00:30 sec",
      isOTP: false,
      opt: "",
      isOTPSend: true,
      demographics: this.props.demographics || {},
      changesMadeHeight: 0,
      changesMadeWeight: 0,
      showInsuranceModal: false,
      isAppeared: true,
      isReady: false,

      activenessLevel: [],
      stressLevel: [],

      insuranceName: "",
      showIndi: this.props.type
    };

    _this = this;

    this._renderModal = this._renderModal.bind(this);
    this.updateProfile = this.updateProfile.bind(this);
    this.goback = this.goback.bind(this);
    this.loadingManipulate = this.loadingManipulate.bind(this);
    this.set_modal_visible = this.set_modal_visible.bind(this);
    this.set_selectedDate = this.set_selectedDate.bind(this);
    this.onClose = this.onClose.bind(this);
    this.onOpen = this.onOpen.bind(this);
    this.onClosingState = this.onClosingState.bind(this);
    // this.updatebloodGroup = this.updatebloodGroup.bind(this)
    this.renderRadioButton = this.renderRadioButton.bind(this);
    this.setPickerValue = this.setPickerValue.bind(this);
    this.saveHeightWeight = this.saveHeightWeight.bind(this);
    this.switchOTPandPass = this.switchOTPandPass.bind(this);
    this.tickTimer = this.tickTimer.bind(this);
    this.stopTimer = this.stopTimer.bind(this);
    this.resendOTP = this.resendOTP.bind(this);
    this.verifyOTP = this.verifyOTP.bind(this);
    this.setSwipe = this.setSwipe.bind(this);
    this._changePasswordOTP = this._changePasswordOTP.bind(this);
    this.getData = this.getData.bind(this);
    this.changesMadeTracker = this.changesMadeTracker.bind(this);
    this.setInsuranceName = this.setInsuranceName.bind(this);
    this._handleIndexChange = this._handleIndexChange.bind(this);
    this._onRequestChangeTab = this._onRequestChangeTab.bind(this);
  }

  _handleIndexChange = index => this.setState({ index });

  _renderHeader = props => <TabBar showIndi={this.state.showIndi} {...props} />;

  // _renderScene = SceneMap({

  //   '1': FirstRoute,
  //   '2': SecondRoute,

  // });

  _renderScene = ({ route }) => {
    switch (route.key) {
      case "1":
        return (
          <View style={{ flex: 1 }}>
            <BasicProfilePersonal
              renderModal={_this._renderModal}
              state={this.state}
            />
          </View>
        );

      case "2":
        return (
          <View style={{ flex: 1 }}>
            <BasicProfileLifestyle
              renderModal={_this._renderModal}
              state={this.state}
            />
          </View>
        );
    }
  };

  _onRequestChangeTab(ind) {
    //  ind = 1;
    this.setState({
      index: ind
    });
  }
  set_modal_visible(flag) {
    this.setState({
      date_visible: flag
    });
  }

  loadingManipulate(flag) {
    this.setState({
      isLoading: flag
    });
  }

  componentWillMount() {
    {
      this.props.type
        ? this.setState({ index: 1 })
        : this.setState({ index: 0 });
    }
  }

  setSwipe(flag) {
    this.setState({
      swipeToClose: flag
    });
  }

  // updatebloodGroup(bloodGroup){

  //   this.setState({
  //   bloodGroup:bloodGroup
  //   })

  // }

  setInsuranceName(name) {
    UserDefaults.set(
      stringsUserDefaults.hasInsurance,
      this.state.insuranceIndex || ""
    );

    UserDefaults.set(stringsUserDefaults.insuranceName, name || "");

    this.setState({
      insuranceName: name,
      changesMade: 1
    });

    time = moment().format();
    currentTime = String(
      moment(time)
        .utc()
        .format(Global.LTHDateFormatMoment) + "Z"
    );

    this.state.args_bundle["insuranceName"] = name;
    this.state.args_bundle["hasInsurance_date"] = currentTime;
    this.state.demographics._source.insuranceName = name;
    this.state.demographics._source.hasInsurance_date = currentTime;
  }

  setPickerValue(value, ind) {
    if (ind == 1) {
      this.setState({ industryType: value, changesMade: 1 });
      this.state.args_bundle["industryType"] = value;
      this.state.demographics._source.industryType = value;
    } else if (ind == 2) {
      this.setState({ bloodGroup: value, changesMade: 1 });
      this.state.args_bundle["bloodGroup"] = value.replace("+", "%2B");

      this.state.demographics._source.bloodGroup = value;

      // else{
      //     this.state.demographics['_source']= {}
      //     this.state.demographics._source['bloodGroup'] = value

      //     UserDefaults.set(stringsUserDefaults.demographics, this.state.demographics || '')
      // }
    }
  }

  changesMadeTracker(cond) {
    this.setState({
      changesMadeTracker: cond
    });
  }

  set_selectedDate(selected_date) {
    var date = moment(selected_date).format("YYYY-MM-DD");
    this.setState({
      dob: date,
      changesMade: 1
    });
    this.state.user.dateOfBirth = moment(selected_date).format("YYYY-MM-DD");
  }

  goback() {
    this.props.closeModal();
  }

  componentDidMount() {
    setTimeout(() => {
      this.setState({
        isReady: true
      });
    }, 500);

    if (!this.state.user) {
      this.getData(0);
    } else {
      this.getData(1);
    }
    smoker = -1;
    alcohol = -1;
    if (this.state.demographics._source) {
      switch (this.state.demographics._source.isSmoker) {
        case "Never":
          smoker = 0;
          break;
        case "Ex-Smoker":
          smoker = 1;
          break;
        case "Occasional":
          smoker = 2;
          break;
        case "Regular":
          smoker = 3;
          break;
      }

      switch (this.state.demographics._source.consumesAlcohol) {
        case "Non-drinker":
          alcohol = 0;
          break;
        case "Occasional":
          alcohol = 1;
          break;
        case "Regular":
          alcohol = 2;
          break;
        case "Heavy":
          alcohol = 3;
          break;
      }
    }

    //setTimeout(()=>{
    this.setState({
      diabeticIndex: this.state.demographics._source
        ? this.state.demographics._source.isDiabetic
        : "",
      chronicIndex: this.state.demographics._source
        ? this.state.demographics._source.isChronic
        : "",

      alcoholIndex: this.state.demographics._source ? alcohol : "",

      smokerIndex: this.state.demographics._source ? smoker : ""
      // insuranceIndex: this.state.demographics._source ? this.state.demographics._source.hasInsurance : '',
      //  insuranceName: this.state.demographics._source ? this.state.demographics._source.insuranceName : ''
    });

    //}, 500)
  }

  async getData(flag) {
    if (flag === 0) {
      UserDefaults.get(stringsUserDefaults.demographics)
        .then(demographics => {
          if (demographics) {
            this.setState({
              demographics: demographics || "",
              industryType: demographics._source.industryType || "",
              occupation: demographics._source.occupation || "",
              isDiabetic: demographics._source.isDiabetic || "",
              isChronic: demographics._source.isChronic || "",
              isSmoker: demographics._source.isSmoker || "",
              consumesAlcohol: demographics._source.consumesAlcohol || "",
              bloodGroup: demographics._source.bloodGroup || ""
            });
          }
        })
        .catch(error => {
          console.error(error);
        });

      UserDefaults.get(stringsUserDefaults.user)
        .then(user => {
          if (user) {
            console.log("USER", user);
            this.setState({
              user: user || "",
              userName: user.fullName || "",
              userName_edit: user.fullName || "",
              email: user.user.email || "",
              email_edit: user.user.email || "",
              gender: user.sex || "",
              contact: user.contact || "",
              dob: user.dateOfBirth || "",
              profilepic: user.profilepic || "",
              city: user.city || "",
              designation: user.designation || stringsDesignation.Mr,
              tempPassword: user.tempPassword || 0
            });
          }
        })
        .catch(error => {
          console.error(error);
        });
    } else {
      UserDefaults.get(stringsUserDefaults.activenessLevel)
        .then(activenessLevel => {
          if (activenessLevel) {
            this.setState({
              activenessLevel: activenessLevel
            });
          }
        })
        .catch(error => {
          console.error(error);
        });

      UserDefaults.get(stringsUserDefaults.stressLevel)
        .then(stressLevel => {
          if (stressLevel) {
            this.setState({
              stressLevel: stressLevel
            });
          }
        })
        .catch(error => {
          console.error(error);
        });

      var user = this.state.user;
      var demographics = this.state.demographics._source;

      this.setState({
        userName: user.fullName || "",
        userName_edit: user.fullName || "",
        email: user.user.email || "",
        email_edit: user.user.email || "",
        gender: user.sex || "",
        contact: user.contact || "",
        dob: user.dateOfBirth || "",
        profilepic: user.profilepic || "",
        city: user.city || "",
        designation: user.designation || stringsDesignation.Mr,
        tempPassword: user.tempPassword || 0,

        industryType: demographics ? demographics.industryType || "" : "",
        occupation: demographics ? demographics.occupation || "" : "",
        isDiabetic: demographics ? demographics.isDiabetic || "" : "",
        isChronic: demographics ? demographics.isChronic || "" : "",
        isSmoker: demographics ? demographics.isSmoker || "" : "",
        consumesAlcohol: demographics ? demographics.consumesAlcohol || "" : "",
        bloodGroup: demographics ? demographics.bloodGroup || "" : ""
      });

      UserDefaults.get(stringsUserDefaults.hasInsurance)
        .then(flag => {
          this.setState({
            insuranceIndex: flag,
            insuranceName: !flag ? this.state.insuranceName : ""
          });
        })
        .catch(error => {
          console.error(error);
        });

      UserDefaults.get(stringsUserDefaults.insuranceName)
        .then(name => {
          this.setState({
            insuranceName: name
          });
        })
        .catch(error => {
          console.error(error);
        });
    }
  }
  componentWillUnmount() {
    if (this.state.changesMade) {
      UserDefaults.get(stringsUserDefaults.userToken).then(token => {
        var params =
          "token=" +
          token +
          "&fullName=" +
          this.state.userName +
          "&email=" +
          this.state.email +
          "&gender=" +
          this.state.gender +
          "&dob=" +
          this.state.dob +
          "&city=" +
          this.state.city +
          "&image=" +
          "" +
          "&designation=" +
          this.state.designation +
          "&args=" +
          (JSON.stringify(this.state.args_bundle) || "");

        this.props.bundle(params, this.state.userName, this.state.dob);
      });
    }

    if (this.state.changesMadeTracker) {
      this.props.trackerChange(
        this.state.activenessLevel,
        this.state.stressLevel
      );
    }
  }

  updateProfile() {
    this.loadingManipulate(false);

    UserDefaults.get(stringsUserDefaults.userToken)
      .then(token => {
        var params =
          "token=" +
          token +
          "&fullName=" +
          this.state.userName +
          "&email=" +
          this.state.email +
          "&gender=" +
          this.state.gender +
          "&dob=" +
          this.state.dob +
          "&city=" +
          this.state.city +
          "&image=" +
          this.state.image +
          "&designation=" +
          this.state.designation +
          "&args=" +
          (JSON.stringify(this.state.args_bundle) || "");

        var _this = this;
        NetworkRequest(_this, "POST", URLs.updateProfile, params)
          .then(result => {
            if (result.success) {
              if ((result.response.code || 0) === 200) {
                this.loadingManipulate(false);
                this.afterUpdate();
              } else {
                Alert.alert("Something went wrong", "Please try again later");
                this.loadingManipulate(false);
              }
            } else {
              this.loadingManipulate(false);
            }
          })
          .catch(error => {
            this.loadingManipulate(false);
            console.error(error);
          });
      })
      .catch(error => {
        this.loadingManipulate(false);
        console.error(error);
      });
  }

  afterUpdate() {
    this.setState({
      // changesMade: 0,
      changesMadeHeight: 0,
      changesMadeWeight: 0
    });

    try {
      UserDefaults.set(stringsUserDefaults.user, this.state.user || "");
      UserDefaults.set(stringsUserDefaults.userName, this.state.username || "");
      UserDefaults.set(
        stringsUserDefaults.userDesignation,
        this.state.designation || ""
      );
      UserDefaults.set(stringsUserDefaults.userEmail, this.state.email || "");
      UserDefaults.set(stringsUserDefaults.userSex, this.state.gender || "");
      UserDefaults.set(
        stringsUserDefaults.userDateOfBirth,
        this.state.dob || ""
      );

      UserDefaults.set(
        stringsUserDefaults.demographics,
        this.state.demographics || ""
      );

      UserDefaults.set(
        stringsUserDefaults.industryType,
        this.state.industryType || ""
      );

      UserDefaults.set(
        stringsUserDefaults.occupation,
        this.state.occupation || ""
      );

      UserDefaults.set(
        stringsUserDefaults.isDiabetic,
        this.state.isDiabetic || ""
      );

      UserDefaults.set(
        stringsUserDefaults.isChronic,
        this.state.isChronic || ""
      );

      UserDefaults.set(stringsUserDefaults.isSmoker, this.state.isSmoker || "");

      UserDefaults.set(
        stringsUserDefaults.consumesAlcohol,
        this.state.consumesAlcohol || ""
      );

      UserDefaults.set(
        stringsUserDefaults.bloodGroup,
        this.state.bloodGroup || ""
      );

      UserDefaults.set(stringsUserDefaults.weight, this.state.weight || "");

      UserDefaults.set(stringsUserDefaults.height, this.state.heightInCm || "");
    } catch (error) {
      console.error(error);
    }

    if (this.props.renewData) {
      this.props.renewData(0);
    } else {
      Profile.forceUpdate();
    }
    // this.props.closeModal()
  }

  // flag = 1 for Name
  // flag = 2 for Email
  // flag = 3 for Password
  // flag = 4 for DOB
  // flag = 5 for Gender
  // flag = 6 for Occupation
  // flag = 7 for Diabetic
  // flag = 8 for Chronic
  // flag = 9 for Smoker
  // flag = 10 for Alchol Consumption
  // flag = 11 for Blood Group
  // flag = 12 for Body Measurement
  // flag = 13 for OTP password Change
  // flag = 14 for Activeness Level
  // flag = 15 for Stress Level
  // flag = 16 for Insurance

  _changePassword() {
    var msg = {
      message: "",
      flag: 3
    };

    if (this.state.newPassword.length < 8) {
      msg = {
        message: "password length must be at least 8 characters*",
        flag: 1
      };
    } else if (this.state.confirmPassword.length < 8) {
      msg = {
        message: "password length must be at least 8 characters*",
        flag: 2
      };
    } else if (this.state.newPassword !== this.state.confirmPassword) {
      msg = {
        message: "passwords does not match*",
        flag: 2
      };
    } else if (this.state.tempPassword === 0) {
      if (!this.state.oldPassword) {
        msg = {
          message: "Invalid Password*",
          flag: 0
        };
      }
    }

    if (msg.flag === 0) {
      this.setState({
        oldPassword_error: msg.message,
        newPassword_error: "",
        confirmPassword_error: ""
      });
    } else if (msg.flag === 1) {
      this.setState({
        oldPassword_error: "",
        newPassword_error: msg.message,
        confirmPassword_error: ""
      });
    } else if (msg.flag === 2) {
      this.setState({
        oldPassword_error: "",
        newPassword_error: "",
        confirmPassword_error: msg.message
      });
    } else {
      this.setState({
        oldPassword_error: "",
        confirmPassword_error: "",
        newPassword_error: ""
      });
    }

    /* Old Change Password Code
      var params = ''
      if(this.state.tempPassword === 0){
        params = 'new=' + this.state.newPassword
               +'&old=' + this.state.oldPassword
      } else {
        params = 'new=' + this.state.newPassword
      }

      UserDefaults.get(stringsUserDefaults.userToken).then((token) => {
        params = params + '&userToken=' + token
        var _this = this
NetworkRequest(_this, 'POST',URLs.updatePasswordApp,params).then(result => {
          if(result.success){
            if((result.response.code || 0) === 200){
              if(this.state.tempPassword === 1){
                this.state.user.tempPassword = 0
              }
              this._renderModal(0)
              console.log(params);
            } else if((result.response.code || 0) === 500) {

            }
          }
        }).catch((error) => {
          console.error(error);
        })

      }).catch((error) => {
        console.error(error);
      })
    }
*/

    var isNotTemp = this.state.tempPassword === 0;
    var param = {
      oldPass: this.state.oldPassword,
      newPass: this.state.newPassword
    };

    var _this = this;

    LoginManager.changeTempPass(param, isNotTemp, _this)
      .then(result => {
        if (result.success) {
          this._renderModal(0);
        }
      })
      .catch(CommonManager.handleError);
  }

  _changePasswordOTP() {
    var msg = {
      message: "",
      flag: 3
    };

    if (this.state.newPassword.length < 8) {
      msg = {
        message: "password length must be at least 8 characters*",
        flag: 1
      };
    } else if (this.state.confirmPassword.length < 8) {
      msg = {
        message: "password length must be at least 8 characters*",
        flag: 2
      };
    } else if (this.state.newPassword !== this.state.confirmPassword) {
      msg = {
        message: "passwords does not match*",
        flag: 2
      };
    } else if (this.state.newPassword === this.state.confirmPassword) {
      msg = {
        message: "",
        flag: 0
      };
    } else {
      msg = {
        message: "",
        flag: 5
      };
    }

    if (msg.flag === 0) {
      this.setState({
        oldPassword_error: msg.message,
        newPassword_error: "",
        confirmPassword_error: ""
      });
    } else if (msg.flag === 1) {
      this.setState({
        oldPassword_error: "",
        newPassword_error: msg.message,
        confirmPassword_error: ""
      });
    } else if (msg.flag === 2) {
      this.setState({
        oldPassword_error: "",
        newPassword_error: "",
        confirmPassword_error: msg.message
      });
    } else {
      this.setState({
        oldPassword_error: "",
        confirmPassword_error: "",
        newPassword_error: ""
      });
    }

    if (msg.flag === 0) {
      UserDefaults.get(stringsUserDefaults.userToken)
        .then(token => {
          params =
            "userToken=" +
            (token || "") +
            "&new=" +
            (this.state.confirmPassword.trim() || "") +
            "&isOTP=" +
            (1 || 0);
          var _this = this;
          NetworkRequest(_this, "POST", URLs.updatePasswordApp, params)
            .then(result => {
              if (result.success) {
                if ((result.response.code || 0) === 200) {
                  this._renderModal(0);
                  console.log("Password Updated Sucessfully");
                } else if ((result.response.code || 0) === 500) {
                }
              }
            })
            .catch(error => {
              console.error(error);
            });
        })
        .catch(error => {
          console.error(error);
        });
    }
  }

  switchOTPandPass() {
    //  if (!this.state.isOTP) {
    this.state.timeRemain = 30;
    this.tickTimer();
    // } else {
    //  this.stopTimer()
    //  }
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

    this.stopTimer();
  }

  stopTimer() {
    TimerMixin.clearInterval(this.state.timer);
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
        btnOTPEnabled: false
      });
    }

    //   const { params } = this.props.navigation.state
    var _this = this;
    LoginManager.resendOTP(this.state.contact, 91, true, false, _this)
      .then(result => {
        if (result.success) {
          AlertManager.Alert(2002);
        } else {
          this.setState({ otpReSent: false, btnOTPEnabled: true });
        }
      })
      .catch(CommonManager.handleError);
  }

  verifyOTP() {
    var otp = this.state.otp.trim();
    if (otp.length === 6) {
      var _this = this;

      LoginManager.verifyOTP(
        this.state.contact,
        this.state.user.countryCode,
        otp,
        true,
        true,
        false,
        _this
      )
        .then(result => {
          // result.success = true // Test
          if (result.success) {
            console.log("OTP VERIFIED");
            this.setState({ otpMatch: true, isOTPSend: false });
          } else {
            this.setState({
              invalidMessageVisible: true,
              errorMsg: result.message
            });
          }
        })
        .catch(CommonManager.handleError);
    } else {
      this.setState({ invalidMessageVisible: false, errorMsg: "" });
    }
  }

  _renderModal(flag) {
    this.setState({
      flag: flag,
      modal_visible_new: flag !== 0 ? true : false
    });
  }

  populate_gender() {
    var row = [];
    {
      this.state.genderArray.forEach(val => {
        row.push(
          <RadioButton
            // animation = {true}
            labelHorizontal
            key={val.value}
          >
            <RadioButtonInput
              obj={val}
              index={val.value}
              isSelected={
                this.state.gender === val.label ? this.state.gender : ""
              }
              onPress={value => {
                var genderArray = this.state.genderArray;
                this.setState({
                  gender: genderArray[value].label,
                  changesMade: 1
                });
                this.state.user.sex = genderArray[value].label;
              }}
              borderWidth={2}
              buttonInnerColor={Color.themeColor}
              buttonOuterColor={Color.themeColor}
              buttonSize={12}
              buttonOuterSize={22}
            />
            <RadioButtonLabel
              obj={val}
              index={val.label}
              labelHorizontal
              onPress={value => {
                var genderArray = this.state.genderArray;
                this.setState({
                  gender: genderArray[value].label,
                  changesMade: 1
                });
                this.state.user.sex = genderArray[value].label;
              }}
              labelStyle={{
                fontSize: 14,
                color: "black",
                marginLeft: 0,
                paddingLeft: 7
              }}
              labelWrapStyle={{ padding: 6 }}
            />
          </RadioButton>
        );
      });
    }

    return <View>{row}</View>;
  }

  populate_designation() {
    var row = [];

    for (keys in stringsDesignation) {
      row.push(
        <Option
          key={stringsDesignation[keys]}
          value={{ name: stringsDesignation[keys] }}
        >
          {stringsDesignation[keys]}
        </Option>
      );
    }

    return (
      <Select
        onSelect={text => {
          this.setState({
            designation: text.name,
            changesMade: 1
          });
          this.state.user.designation = text.name;
        }}
        defaultText={this.state.designation}
        style={{
          borderWidth: 1.0,
          borderColor: "white",
          backgroundColor: "white",
          width: 80
        }}
        transparent
        optionListStyle={{
          backgroundColor: "#FFFFFF",
          borderWidth: Global.isIphoneX ? 1 : 0.5,
          borderColor: Color._DF,
          width: 200,
          marginTop: 16
        }}
      >
        {row}
      </Select>
    );
  }

  onClose() {
    this.setState({
      modal_visible_new: false
    });

    if (
      this.state.flag === 12 &&
      (this.state.changesMadeHeight || this.state.changesMadeWeight)
    ) {
      this.saveHeightWeight(0);
    }
    console.log("Modal just closed");
  }
  onOpen() {
    console.log("Modal just openned");
  }
  onClosingState(state) {
    console.log("the open/close of the swipeToClose just changed");
  }

  renderRadioButton(header, type) {
    if (type == 1 || type == 2 || type == 5) {
      var radio_props = [
        { label: "No ", value: 0 },
        { label: "Yes ", value: 1 }
      ];
    }
    if (type == 3) {
      var radio_props = [
        { label: "Never ", value: 0 },
        { label: "Ex-Smoker ", value: 1 },
        { label: "Occasional ", value: 2 },
        { label: "Regular ", value: 3 }
      ];
    }

    if (type == 4) {
      var radio_props = [
        { label: "Non-drinker  ", value: 0 },
        { label: "Occasional ", value: 1 },
        { label: "Regular ", value: 2 },
        { label: "Heavy ", value: 3 }
      ];
    }

    return (
      <View
        style={{
          flexDirection: "column",
          margin: 40,
          backgroundColor: "#ffffff",
          borderRadius: 6,
          borderWidth: 0.5,
          borderColor: Color._DF
        }}
      >
        <DialogHeader
          style={[styles.dialog_styles, { paddingTop: 24, paddingLeft: 26 }]}
          title={header}
        />
        <View style={{ paddingLeft: 26, paddingBottom: 20, paddingRight: 26 }}>
          <RadioForm initial={0} animation={true}>
            {radio_props.map((obj, i) => {
              var onPress = (value, index) => {
                if (type == 1) {
                  this.setState({
                    isDiabetic: obj.value,
                    diabeticIndex: obj.value,
                    changesMade: 1
                  });
                  this.state.args_bundle["isDiabetic"] = obj.value;
                  this.state.demographics._source.isDiabetic = obj.value;
                }
                if (type == 2) {
                  this.setState({
                    isChronic: obj.value,
                    chronicIndex: obj.value,
                    changesMade: 1
                  });
                  this.state.args_bundle["isChronic"] = obj.value;
                  this.state.demographics._source.isChronic = obj.value;
                }
                if (type == 3) {
                  this.setState({
                    isSmoker: obj.label,
                    smokerIndex: index,
                    changesMade: 1
                  });
                  this.state.args_bundle["isSmoker"] = obj.label.trim();
                  this.state.demographics._source.isSmoker = obj.label.trim();
                  // console.log('SMOKER:', obj.label)
                }
                if (type == 4) {
                  this.setState({
                    consumesAlcohol: obj.label,
                    alcoholIndex: index,
                    changesMade: 1
                  });
                  this.state.args_bundle["consumesAlcohol"] = obj.label.trim();
                  this.state.demographics._source.consumesAlcohol = obj.label.trim();
                }
                if (type == 5) {
                  this.setState({
                    hasInsurance: obj.value,
                    insuranceIndex: obj.value,
                    changesMade: 1
                  });
                  UserDefaults.set(stringsUserDefaults.hasInsurance, obj.value);
                  UserDefaults.set(stringsUserDefaults.insuranceName, "");
                  this.state.args_bundle["hasInsurance"] = obj.value;
                  this.state.demographics._source.hasInsurance = obj.value;
                  if (!obj.value) {
                    this.state.demographics._source.insuranceName = "";
                    this.setState({ insuranceName: "" });
                  }
                }
              };
              return (
                <RadioButton animation={true} key={i}>
                  <RadioButtonInput
                    obj={obj}
                    index={i}
                    isSelected={
                      type == 1
                        ? this.state.diabeticIndex === i
                        : type == 2
                        ? this.state.chronicIndex === i
                        : type == 3
                        ? this.state.smokerIndex == i
                        : type == 4
                        ? this.state.alcoholIndex == i
                        : type == 5
                        ? this.state.insuranceIndex == i
                        : null
                    }
                    onPress={onPress}
                    borderWidth={2}
                    buttonInnerColor={Color.themeColor}
                    buttonOuterColor={Color.themeColor}
                    buttonSize={12}
                    buttonOuterSize={22}
                  />
                  <RadioButtonLabel
                    obj={obj}
                    index={i}
                    onPress={onPress}
                    labelStyle={{
                      fontSize: 14,
                      color: "black",
                      marginLeft: 0,
                      paddingLeft: 7,
                      fontWeight: "500"
                    }}
                    labelWrapStyle={{ padding: 6 }}
                  />
                </RadioButton>
              );
            })}
          </RadioForm>

          {type == 5 && this.state.insuranceIndex == 1 ? (
            <View>
              <Text
                style={{
                  fontFamily: "Arial",
                  fontSize: 16,
                  paddingTop: 10,
                  color: "grey"
                }}
              >
                Insurance Provider
              </Text>
              <Ripple
                onPress={() => {
                  this.setState({ showInsuranceModal: true });
                }}
              >
                <TextInput
                  underlineColorAndroid={"grey"}
                  style={{
                    height: 40,
                    marginTop: 0,
                    color: "black",
                    fontSize: 16
                  }}
                  editable={false}
                  value={this.state.insuranceName}
                  placeholder={"Select"}
                  placeholderTextColor={"black"}
                />
              </Ripple>
              {Global.iOSPlatform ? (
                <View
                  style={{
                    height: 0.5,
                    marginLeft: 0,
                    marginRight: 0,
                    marginTop: -6,
                    marginBottom: 8,
                    backgroundColor: "#DFDFDF"
                  }}
                />
              ) : null}
            </View>
          ) : null}

          <Text
            onPress={() => {
              this._renderModal(0);
            }}
            style={[
              CommonStyles.button_style,
              {
                color: Color.theme_blue,
                paddingTop: 12,
                paddingRight: 12,
                textAlign: "right"
              }
            ]}
          >
            OK
          </Text>
        </View>
      </View>
    );
  }

  saveHeightWeight(n) {
    num = n;
    height = 0;

    if (this.state.heightInFeet && this.state.heightInInch) {
      feet = parseInt(this.state.heightInFeet);
      inch = parseInt(this.state.heightInInch);

      height = (feet * 12 + inch) * 2.54;

      this.setState({
        heightInCm: height
      });
    }

    if (
      this.state.changesMadeHeight == 1 &&
      this.state.changesMadeWeight == 1 &&
      n == 0
    ) {
      dictId = 675;
      label = "Weight";
      value = this.state.weight;
      unit = "kg";
    }

    if (
      this.state.changesMadeHeight == 1 &&
      this.state.changesMadeWeight == 1 &&
      n == 1
    ) {
      dictId = 675;
      label = "Height";
      value = this.state.heightInCm ? this.state.heightInCm : height;
      unit = "cm";
    }

    if (
      this.state.changesMadeHeight == 1 &&
      this.state.changesMadeWeight == 0 &&
      n == 0
    ) {
      dictId = 677;
      label = "Height";
      value = this.state.heightInCm ? this.state.heightInCm : height;
      unit = "cm";
      n = 1;
    } else if (
      this.state.changesMadeWeight == 1 &&
      this.state.changesMadeHeight == 0
    ) {
      dictId = 675;
      label = "Weight";
      value = this.state.weight;
      unit = "kg";
      n = 1;
    }

    time = moment().format();
    currentTime = String(
      moment(time)
        .utc()
        .format(Global.LTHDateFormatMoment) + "Z"
    );

    if (
      this.state.changesMadeHeight == 1 ||
      this.state.changesMadeWeight == 1
    ) {
      UserDefaults.get(stringsUserDefaults.userToken)
        .then(token => {
          var params =
            "token=" +
            token +
            "&dictionaryId=" +
            dictId +
            "&label=" +
            label +
            "&reportDate=" +
            currentTime +
            "&value=" +
            value +
            "&unit=" +
            unit;

          NetworkRequest(_this, "POST", URLs.saveTrackerData, params)
            .then(result => {
              if (result.success) {
                if ((result.response.code || 0) === 200) {
                  if (n == 0) {
                    UserDefaults.set(stringsUserDefaults.weight, value);
                    this.props.setDemographics({ weight: 1 });
                    this.saveHeightWeight(1);
                    UserDefaults.set(stringsUserDefaults.height, value);
                    this.props.setDemographics({ height: 1 });
                  } else {
                    if (this.state.changesMadeWeight) {
                      UserDefaults.set(stringsUserDefaults.weight, value);
                      this.props.setDemographics({ weight: 1 });
                    } else {
                      UserDefaults.set(stringsUserDefaults.height, value);
                      this.props.setDemographics({ height: 1 });
                    }

                    this.loadingManipulate(false);
                    this.afterUpdate();
                  }
                } else {
                  this.loadingManipulate(false);
                }
              } else {
                this.loadingManipulate(false);
              }
            })
            .catch(error => {
              this.loadingManipulate(false);
              console.error(error);
            });
        })
        .catch(error => {
          this.loadingManipulate(false);
          console.error(error);
        });
    }
  }

  render() {
    var row = [];

    for (keys in heightParams) {
      row.push(
        <Option key={heightParams[keys]} value={{ name: heightParams[keys] }}>
          {heightParams[keys]}
        </Option>
      );
    }

    return (
      <View style={styles.container}>
        {this.state.showInsuranceModal ? (
          <Modal
            animationType="slide"
            transparent={false}
            visible={this.state.showInsuranceModal}
            onRequestClose={() => {
              //alert('Modal has been closed.');
            }}
          >
            <InsuranceModal
              setSwipe={this.setSwipe}
              getSwipe={this.getSwipe}
              setScroll={this.setScroll}
              closeModal={() => {
                this.setState({ showInsuranceModal: false });
              }}
              setInsuranceName={this.setInsuranceName}
            />
          </Modal>
        ) : null}
        {/* <ScrollView style={{flex: 1}}> */}
        <CloseBar goBack={this.goback} color={"black"} />
        {/* <View style={{height: Global.screenHeight}}> */}
        <HeaderListExtraLarge
          header="Profile"
          description="Update your basic information which will appear on your reports and other documents"
          style={{ flex: 0, paddingTop: 0 }}
        />

        {this.state.isReady ? (
          <TabViewAnimated
            style={styles.container}
            navigationState={this.state}
            renderScene={this._renderScene}
            renderHeader={this._renderHeader}
            onIndexChange={this._handleIndexChange}
            // jumpToIndex = {1}
            onRequestChangeTab={ind => {
              this._onRequestChangeTab(ind);
            }}
            useNativeDriver
          />
        ) : null}

        <ModalBox
          style={{
            justifyContent: "center",
            borderRadius: 6,
            backgroundColor: " rgba(0, 0, 0, 0)"
          }}
          ref={"modal1"}
          swipeThreshold={200}
          isOpen={this.state.modal_visible_new}
          swipeToClose={this.state.swipeToClose}
          onClosed={this.onClose}
          position={"top"}
          backdrop={true}
          keyboardTopOffset={Global.iOSPlatform ? 22 : 0}
          onOpened={this.onOpen}
          onClosingState={this.onClosingState}
        >
          {this.state.flag === 1 ? ( // for name
            <View
              style={{
                flexDirection: "column",
                margin: 40,
                backgroundColor: "#ffffff",
                borderRadius: 6,
                borderWidth: 0.5,
                borderColor: Color._DF
              }}
            >
              <DialogHeader style={styles.dialog_styles} title={"Name"} />
              <View
                style={{ paddingLeft: 20, paddingBottom: 20, paddingRight: 20 }}
              >
                <Text style={{ fontFamily: "Arial", color: "grey" }}>
                  Designation
                </Text>
                {this.populate_designation()}
                <Text style={{ fontFamily: "Arial", color: "grey" }}>Name</Text>
                <TextInput
                  underlineColorAndroid ={'grey'}
                  style={{ height: 40 }}
                  onChangeText={text => {
                    this.setState({
                      userName_edit: text
                    });
                  }}
                  value={this.state.userName_edit}
                />
                {!this.state.userName_edit ? (
                  <Text
                    style={{ fontFamily: "Arial", color: "red", fontSize: 12 }}
                  >
                    *Please enter a valid name
                  </Text>
                ) : (
                  <Text style={{ fontFamily: "Arial" }} />
                )}
                <Ripple
                  onPress={() => {
                    if (this.state.userName_edit) {
                      var userName = this.state.userName_edit;
                      const changesMade = 0;
                      try {
                        if (this.state.changesMade === 1) {
                          changesMade = 1;
                        } else {
                          if (userName === this.state.user.fullName) {
                            changesMade = 0;
                          } else {
                            changesMade = 1;
                          }
                        }
                      } catch (error) {
                        console.error(error);
                        changesMade = 1;
                      }

                      this.setState({
                        userName: userName,
                        changesMade: changesMade
                      });
                      this.state.user.fullName = userName;
                      this._renderModal(0);
                    }
                  }}
                >
                  <Text
                    style={[
                      CommonStyles.button_style,
                      {
                        color: Color.theme_blue,
                        paddingTop: 12,
                        paddingRight: 12,
                        textAlign: "right"
                      }
                    ]}
                  >
                    OK
                  </Text>
                </Ripple>
              </View>
            </View>
          ) : this.state.flag === 2 ? ( // for email
            <View
              style={{
                flexDirection: "column",
                margin: 40,
                backgroundColor: "#ffffff",
                borderRadius: 6,
                borderWidth: 0.5,
                borderColor: Color._DF
              }}
            >
              <DialogHeader style={styles.dialog_styles} title={"Email"} />
              <View
                style={{ paddingLeft: 20, paddingBottom: 20, paddingRight: 20 }}
              >
                <Text style={{ fontFamily: "Arial", color: "grey" }}>
                  Email
                </Text>
                <TextInput
                  underlineColorAndroid ={'grey'}
                  style={{ height: 40 }}
                  onChangeText={text => {
                    this.setState({
                      email_edit: text
                    });
                  }}
                  value={this.state.email_edit}
                />
                {Global.iOSPlatform ? (
                  <View
                    style={{
                      height: 0.5,
                      marginLeft: 0,
                      marginRight: 0,
                      marginTop: -6,
                      marginBottom: 8,
                      backgroundColor: "#DFDFDF"
                    }}
                  />
                ) : null}

                {!this.state.email_edit ? (
                  <Text
                    style={{ fontFamily: "Arial", color: "red", fontSize: 12 }}
                  >
                    *Please enter a valid email
                  </Text>
                ) : !isValidEmail(this.state.email_edit) ? (
                  <Text
                    style={{ fontFamily: "Arial", color: "red", fontSize: 12 }}
                  >
                    *Please enter a valid email
                  </Text>
                ) : (
                  <Text style={{ fontFamily: "Arial" }} />
                )}
                <Ripple
                  onPress={() => {
                    if (isValidEmail(this.state.email_edit)) {
                      var email = this.state.email_edit;
                      const changesMade = 0;
                      try {
                        if (this.state.changesMade === 1) {
                          changesMade = 1;
                        } else {
                          if (email === this.state.user.email) {
                            changesMade = 0;
                          } else {
                            changesMade = 1;
                          }
                        }
                      } catch (error) {
                        console.error(error);
                        changesMade = 1;
                      }

                      this.setState({
                        email: email,
                        changesMade: changesMade
                      });
                      this.state.user.user.email = email;
                      this._renderModal(0);
                    }
                  }}
                >
                  <Text
                    style={[
                      CommonStyles.button_style,
                      {
                        color: Color.theme_blue,
                        paddingTop: 12,
                        paddingRight: 12,
                        textAlign: "right"
                      }
                    ]}
                  >
                    OK
                  </Text>
                </Ripple>
              </View>
            </View>
          ) : this.state.flag === 3 ? ( // for password
            <KeyboardAvoidingView behavior="padding">
              <View
                style={{
                  flexDirection: "column",
                  margin: Global.iOSPlatform ? 30 : 40,
                  backgroundColor: "#ffffff",
                  borderRadius: 6,
                  borderWidth: 0.5,
                  borderColor: Color._DF
                }}
              >
                <DialogHeader
                  style={[styles.dialog_styles, { paddingTop: 24 }]}
                  title={"Change Password"}
                />
                <View
                  style={{
                    paddingLeft: 26,
                    paddingBottom: 24,
                    paddingRight: 26
                  }}
                >
                  {this.state.tempPassword === 0 ? (
                    <View>
                      <Text style={{ fontFamily: "Arial", color: "grey" }}>
                        Old Password
                      </Text>
                      <TextInput
                        underlineColorAndroid ={'grey'}
                        secureTextEntry={false}
                        onChangeText={text => {
                          this.setState({
                            oldPassword: text
                          });
                        }}
                        style={{ height: 40 }}
                      />

                      {Global.iOSPlatform ? (
                        <View
                          style={{
                            height: 0.5,
                            marginLeft: 0,
                            marginRight: 0,
                            marginTop: -8,
                            marginBottom: 16,
                            backgroundColor: "#DFDFDF"
                          }}
                        />
                      ) : null}
                      {this.state.oldPassword_error !== "" ? (
                        <Text style={styles.error_style}>
                          {this.state.oldPassword_error}
                        </Text>
                      ) : (
                        <Text style={{ fontFamily: "Arial" }} />
                      )}
                    </View>
                  ) : (
                    <View />
                  )}
                  <Text
                    style={{
                      fontFamily: "Arial",
                      paddingTop: 8,
                      color: "grey"
                    }}
                  >
                    New Password
                  </Text>
                  <TextInput
                    underlineColorAndroid ={'grey'}
                    secureTextEntry={false}
                    onChangeText={text => {
                      this.setState({
                        newPassword: text
                      });
                    }}
                    style={{ height: 40 }}
                  />
                  {Global.iOSPlatform ? (
                    <View
                      style={{
                        height: 0.5,
                        marginLeft: 0,
                        marginRight: 0,
                        marginTop: -8,
                        marginBottom: 16,
                        backgroundColor: "#DFDFDF"
                      }}
                    />
                  ) : null}
                  {this.state.newPassword_error !== "" ? (
                    <Text style={styles.error_style}>
                      {this.state.newPassword_error}
                    </Text>
                  ) : (
                    <Text style={{ fontFamily: "Arial" }} />
                  )}

                  <Text
                    style={{
                      fontFamily: "Arial",
                      paddingTop: 8,
                      color: "grey"
                    }}
                  >
                    Confirm Password
                  </Text>
                  <TextInput
                    underlineColorAndroid ={'grey'}
                    secureTextEntry={false}
                    onChangeText={text => {
                      this.setState({
                        confirmPassword: text
                      });
                    }}
                    style={{ height: 40 }}
                  />
                  {Global.iOSPlatform ? (
                    <View
                      style={{
                        height: 0.5,
                        marginLeft: 0,
                        marginRight: 0,
                        marginTop: -8,
                        marginBottom: 16,
                        backgroundColor: "#DFDFDF"
                      }}
                    />
                  ) : null}
                  {this.state.confirmPassword_error !== "" ? (
                    <Text style={styles.error_style}>
                      {this.state.confirmPassword_error}
                    </Text>
                  ) : (
                    <Text style={{ fontFamily: "Arial" }} />
                  )}

                  <Text
                    style={[
                      CommonStyles.button_style,
                      { color: Color.appointmentBlue }
                    ]}
                    onPress={() => {
                      this._renderModal(13);
                      this.switchOTPandPass();
                      this.setState({ otpMatch: false, btnOTPEnabled: false });
                    }}
                  >
                    Send me an OTP
                  </Text>

                  <View style={{ flexDirection: "row" }}>
                    <Text
                      onPress={() => {
                        this._renderModal(0);
                      }}
                      style={[
                        CommonStyles.button_style,
                        { paddingTop: 24, paddingRight: 12 }
                      ]}
                    >
                      CLOSE
                    </Text>
                    <View style={{ flex: 1 }} />

                    <Ripple
                      onPress={() => {
                        this._changePassword();
                      }}
                    >
                      <Text
                        style={[
                          CommonStyles.button_style,
                          { paddingTop: 24, color: Color.theme_blue }
                        ]}
                      >
                        SUBMIT
                      </Text>
                    </Ripple>
                  </View>
                </View>
              </View>
            </KeyboardAvoidingView>
          ) : this.state.flag === 4 ? ( // for dob
            <View
              style={{
                flexDirection: "column",
                margin: 40,
                backgroundColor: "#ffffff",
                borderRadius: 6,
                borderWidth: 0.5,
                borderColor: Color._DF
              }}
            >
              <DialogHeader
                style={styles.dialog_styles}
                title={"Date of Birth"}
              />
              <View
                style={{ paddingLeft: 20, paddingBottom: 20, paddingRight: 20 }}
              >
                <Text style={{ fontFamily: "Arial", color: "grey" }}>
                  Date of Birth
                </Text>
                <Ripple
                  onPress={() => {
                    this.setState({ pickerType: false });
                    this.set_modal_visible(true);
                  }}
                >
                  <TextInput
                    underlineColorAndroid ={'grey'}
                    style={{ height: 40 }}
                    editable={false}
                    value={
                      this.state.dob
                        ? moment(this.state.dob).format("Do MMM, YYYY")
                        : "Select"
                    }
                  />
                </Ripple>
                <Text
                  onPress={() => {
                    this._renderModal(0);
                  }}
                  style={[
                    CommonStyles.button_style,
                    {
                      color: Color.theme_blue,
                      paddingTop: 12,
                      paddingRight: 12,
                      textAlign: "right"
                    }
                  ]}
                >
                  OK
                </Text>
              </View>
            </View>
          ) : this.state.flag === 5 ? ( // for gender
            <View
              style={{
                flexDirection: "column",
                margin: 40,
                backgroundColor: "#ffffff",
                borderRadius: 6,
                borderWidth: 0.5,
                borderColor: Color._DF
              }}
            >
              <DialogHeader
                style={[
                  styles.dialog_styles,
                  { paddingTop: 24, paddingLeft: 26 }
                ]}
                title={"Gender"}
              />
              <View
                style={{ paddingLeft: 26, paddingBottom: 20, paddingRight: 26 }}
              >
                <Text
                  style={{
                    fontFamily: "Arial",
                    paddingBottom: 16,
                    paddingLeft: 4,
                    color: "grey",
                    fontSize: 16
                  }}
                >
                  Gender
                </Text>
                <RadioForm animation={true} formVertical>
                  {this.populate_gender()}
                </RadioForm>
                <Text
                  onPress={() => {
                    this._renderModal(0);
                  }}
                  style={[
                    CommonStyles.button_style,
                    {
                      color: Color.theme_blue,
                      paddingTop: 12,
                      paddingRight: 12,
                      textAlign: "right"
                    }
                  ]}
                >
                  OK
                </Text>
              </View>
            </View>
          ) : this.state.flag === 6 ? ( // for Occupation
            <KeyboardAvoidingView behavior="padding">
              <View
                style={{
                  flexDirection: "column",
                  margin: 40,
                  backgroundColor: "#ffffff",
                  borderRadius: 6,
                  borderWidth: 0.5,
                  borderColor: Color._DF
                }}
              >
                <DialogHeader
                  style={styles.dialog_styles}
                  title={"Occupation"}
                />
                <View
                  style={{ marginLeft: 20, marginBottom: 20, marginRight: 20 }}
                >
                  <Text
                    style={{ fontFamily: "Arial", fontSize: 18, color: "grey" }}
                  >
                    Industry
                  </Text>

                  <Ripple
                    onPress={() => {
                      this.setState({
                        pickerType: true,
                        type: 1,
                        pickerHeader: "Occupation",
                        pickerData: [
                          "Select",
                          "Banking",
                          "Business",
                          "Education",
                          "Homemaker",
                          "IT",
                          "Medical",
                          "Real Estate",
                          "Service",
                          "Others"
                        ]
                      });
                      this.set_modal_visible(true);
                    }}
                  >
                    <View>
                      <TextInput
                        underlineColorAndroid={"grey"}
                        style={{ height: 40, marginTop: 0, color: "black" }}
                        editable={false}
                        value={this.state.industryType}
                        placeholder={"Select"}
                        placeholderTextColor={"black"}
                      />

                      {Global.iOSPlatform ? (
                        <View
                          style={{
                            height: 0.5,
                            marginLeft: 0,
                            marginRight: 0,
                            marginTop: -8,
                            marginBottom: 16,
                            backgroundColor: "#DFDFDF"
                          }}
                        />
                      ) : null}
                    </View>
                  </Ripple>

                  <Text
                    style={{ fontFamily: "Arial", fontSize: 18, color: "grey" }}
                  >
                    Company Name
                  </Text>

                  <TextInput
                    underlineColorAndroid ={'grey'}
                    style={{ height: 40, marginTop: 0 }}
                    editable={true}
                    placeholder="Company name"
                    onChangeText={text => {
                      this.setState({
                        occupation: toTitleCase(text),
                        changesMade: 1
                      });

                      this.state.args_bundle["occupation"] = text;
                      this.state.demographics._source.occupation = text;
                    }}
                    value={this.state.occupation}
                  />

                  {Global.iOSPlatform ? (
                    <View
                      style={{
                        height: 0.5,
                        marginLeft: 0,
                        marginRight: 0,
                        marginTop: -8,
                        marginBottom: 16,
                        backgroundColor: "#DFDFDF"
                      }}
                    />
                  ) : null}

                  <Text
                    onPress={() => {
                      this._renderModal(0);
                    }}
                    style={[
                      CommonStyles.button_style,
                      {
                        color: Color.theme_blue,
                        paddingTop: 12,
                        paddingRight: 12,
                        textAlign: "right"
                      }
                    ]}
                  >
                    OK
                  </Text>
                </View>
              </View>
            </KeyboardAvoidingView>
          ) : this.state.flag === 7 ? ( // for Diabetic
            this.renderRadioButton("Diabetic?", 1)
          ) : this.state.flag === 8 ? ( // for Chronic
            this.renderRadioButton("Chronic?", 2)
          ) : this.state.flag === 9 ? ( // for Smoker
            this.renderRadioButton("Smoker", 3)
          ) : this.state.flag === 10 ? ( // for Alcohol Consumption
            this.renderRadioButton("Alcohol Consumption", 4)
          ) : this.state.flag === 11 ? ( // for Blood Group
            <View
              style={{
                flexDirection: "column",
                margin: 40,
                backgroundColor: "#ffffff",
                borderRadius: 6,
                borderWidth: 0.5,
                borderColor: Color._DF
              }}
            >
              <DialogHeader
                style={styles.dialog_styles}
                title={"Blood Group"}
              />
              <View
                style={{ paddingLeft: 20, paddingBottom: 20, paddingRight: 20 }}
              >
                <Text style={{ fontFamily: "Arial", color: "grey" }}>Type</Text>
                <Ripple
                  onPress={() => {
                    this.setState({
                      pickerType: true,
                      type: 2,
                      pickerHeader: "Blood Group",
                      pickerData: [
                        "Select",
                        "A +ve",
                        "A -ve",
                        "B +ve",
                        "B -ve",
                        "O +ve",
                        "O -ve",
                        "AB +ve",
                        "AB -ve"
                      ]
                    });
                    this.set_modal_visible(true);
                  }}
                >
                  <TextInput
                    underlineColorAndroid ={'grey'}
                    placeholder={"Select"}
                    placeholderTextColor={"black"}
                    style={{ height: 40, color: "black" }}
                    editable={false}
                    value={this.state.bloodGroup}
                  />
                </Ripple>
                <Text
                  onPress={() => {
                    this._renderModal(0);
                  }}
                  style={[
                    CommonStyles.button_style,
                    {
                      color: Color.theme_blue,
                      paddingTop: 12,
                      paddingRight: 12,
                      textAlign: "right"
                    }
                  ]}
                >
                  OK
                </Text>
              </View>
            </View>
          ) : // this.setState({date_visible:true})
          // <DatePicker
          // dialog_visible={this.set_modal_visible}
          // setTime={this.set_selectedDate}
          // singlePicker = {true}
          // />

          this.state.flag === 12 ? ( // for Body Measurement
            <KeyboardAvoidingView behavior="padding">
              <View
                style={{
                  flexDirection: "column",
                  margin: 40,
                  backgroundColor: "#ffffff",
                  borderRadius: 6,
                  borderWidth: 0.5,
                  borderColor: Color._DF
                }}
              >
                <DialogHeader
                  style={styles.dialog_styles}
                  title={"Body Measurement"}
                />

                <View
                  style={{ marginLeft: 20, marginBottom: 20, marginRight: 20 }}
                >
                  <Text style={{ fontFamily: "Arial", color: "grey" }}>
                    Height
                  </Text>

                  <View style={{ flexDirection: "row" }}>
                    {this.state.inputChange == 0 ? (
                      <TextInput
                        underlineColorAndroid ={'grey'}
                        style={{ height: 40, flex: 3 }}
                        editable={true}
                        keyboardType={"numeric"}
                        placeholder="Enter value"
                        onChangeText={text => {
                          this.setState({
                            heightInCm: text,
                            changesMadeHeight: 1
                          });
                          this.state.heightInCm = text;
                        }}
                        value={this.state.heightInCm.toString()}
                      />
                    ) : (
                      <View style={{ flexDirection: "row", flex: 1 }}>
                        <TextInput
                          underlineColorAndroid ={'grey'}
                          style={{ height: 40, width: 30, flex: 0 }}
                          editable={true}
                          placeholder={Global.iOSPlatform ? "____" : null}
                          maxLength={2}
                          keyboardType={"numeric"}
                          onChangeText={text => {
                            this.setState({
                              heightInFeet: text,
                              changesMadeHeight: 1
                            });
                          }}
                          value={this.state.heightInFeet}
                        />

                        <Text style={{ width: 30, marginTop: 12 }}>feet</Text>

                        <TextInput
                          underlineColorAndroid ={'grey'}
                          style={{ height: 40, width: 30, marginLeft: 10 }}
                          editable={true}
                          placeholder={Global.iOSPlatform ? "____" : null}
                          maxLength={2}
                          keyboardType={"numeric"}
                          onChangeText={text => {
                            this.setState({
                              heightInInch: text,
                              changesMadeHeight: 1
                            });
                          }}
                          value={this.state.heightInInch}
                        />

                        <Text style={{ width: 40, marginTop: 12 }}>inch</Text>
                      </View>
                    )}
                    <Select
                      onSelect={text => {
                        if (text.name == "ft") {
                          this.setState({
                            heightParams: text.name,
                            inputChange: 1
                          });
                        } else {
                          this.setState({
                            heightParams: text.name,
                            inputChange: 0
                            //changesMade: 1
                          });
                        }
                      }}
                      defaultText={this.state.heightParams}
                      style={{
                        borderWidth: 1.0,
                        borderColor: "white",
                        width: 55
                      }}
                      transparent
                      optionListStyle={{
                        backgroundColor: "#FFFFFF",
                        borderWidth: StyleSheet.hairlineWidth,
                        borderColor: Color._DF,
                        width: 100,
                        marginTop: 50,
                        marginLeft: 150,
                        height: 70
                      }}
                    >
                      {row}
                    </Select>
                    <View style={{ justifyContent: "center" }}>
                      <MaterialIcons
                        name={"expand-more"}
                        size={20}
                        style={{ color: Color._4A }}
                      />
                    </View>
                  </View>
                  {Global.iOSPlatform ? (
                    this.state.inputChange == 0 ? (
                      <View
                        style={{
                          height: 0.5,
                          marginLeft: 0,
                          marginRight: 70,
                          marginTop: -8,
                          marginBottom: 16,
                          backgroundColor: "#DFDFDF"
                        }}
                      />
                    ) : (
                      <View
                        style={{
                          height: 0,
                          marginLeft: 0,
                          marginRight: 70,
                          marginTop: -8,
                          marginBottom: 16,
                          backgroundColor: "#DFDFDF"
                        }}
                      />
                    )
                  ) : null}
                  <Text style={{ fontFamily: "Arial", color: "grey" }}>
                    Weight
                  </Text>

                  <View style={{ flexDirection: "row" }}>
                    <TextInput
                      underlineColorAndroid ={'grey'}
                      style={{ height: 40, flex: 3 }}
                      editable={true}
                      placeholder="Enter value"
                      keyboardType={"numeric"}
                      maxLength={3}
                      onChangeText={text => {
                        this.setState({
                          weight: text,
                          changesMadeWeight: 1
                        });
                        // this.state.args_bundle['weight'] = text
                        this.state.weight = text;
                      }}
                      value={this.state.weight}
                    />

                    <Text style={{ flex: 1, width: 60, marginTop: 12 }}>
                      kg
                    </Text>
                  </View>

                  {Global.iOSPlatform ? (
                    <View
                      style={{
                        height: 0.5,
                        marginLeft: 0,
                        marginRight: 70,
                        marginTop: -8,
                        marginBottom: 16,
                        backgroundColor: "#DFDFDF"
                      }}
                    />
                  ) : null}

                  <Text
                    onPress={() => {
                      this._renderModal(0);

                      this.saveHeightWeight(0);

                      // def inchesToCm(val):
                      // return float(val) / 0.39370
                      // this.setState({})
                    }}
                    style={[
                      CommonStyles.button_style,
                      {
                        color: Color.theme_blue,
                        paddingTop: 12,
                        paddingRight: 12,
                        textAlign: "right"
                      }
                    ]}
                  >
                    OK
                  </Text>
                </View>
              </View>
            </KeyboardAvoidingView>
          ) : this.state.flag === 13 ? (
            <View
              style={{
                flexDirection: "column",
                margin: Global.iOSPlatform ? 30 : 40,
                backgroundColor: "#ffffff",
                borderRadius: 6,
                borderWidth: 0.5,
                borderColor: Color._DF
              }}
            >
              <DialogHeader
                style={[styles.dialog_styles, { paddingTop: 24 }]}
                title={"OTP"}
              />
              <View
                style={{ paddingLeft: 26, paddingBottom: 24, paddingRight: 26 }}
              >
                {!this.state.otpMatch ? (
                  <View>
                    <Text style={{ fontFamily: "Arial", paddingTop: 8 }}>
                      An OTP has been sent to {this.state.contact}
                    </Text>

                    <View style={{ paddingTop: 10 }}>
                      <TextFieldOTP
                        focusOnComponentMount
                        setOTP={otp => {
                          this.setState({ otp: otp });
                          console.log(this.state.otp);
                        }}
                        size={30}
                        widthOtp={Global.screenWidth * 0.5}
                        length={6}
                        style={[{ paddingBottom: 10 }]}
                        onChangeText={text =>
                          this.setState({
                            invalidMessageVisible: false,
                            errorMsg: ""
                          })
                        }
                      />
                    </View>

                    <Button
                      onPress={this.state.isOTP ? this.resendOTP : null}
                      title={this.state.btnOTPText}
                      style={{
                        height: 30,
                        borderColor: "white",
                        width: 250,
                        alignSelf: "center"
                      }}
                      titleStyle={{ color: Color.appointmentBlue }}
                      isDisabled={!this.state.btnOTPEnabled}
                    />
                  </View>
                ) : (
                  <View>
                    <Text style={{ fontFamily: "Arial", paddingTop: 8 }}>
                      New Password
                    </Text>
                    <TextInput
                      underlineColorAndroid ={'grey'}
                      secureTextEntry={true}
                      onChangeText={text => {
                        this.setState({
                          newPassword: text
                        });
                      }}
                      style={{ height: 40 }}
                    />
                    {Global.iOSPlatform ? (
                      <View
                        style={{
                          height: 0.5,
                          marginLeft: 0,
                          marginRight: 0,
                          marginTop: -8,
                          marginBottom: 16,
                          backgroundColor: "#DFDFDF"
                        }}
                      />
                    ) : null}
                    {this.state.newPassword_error !== "" ? (
                      <Text style={styles.error_style}>
                        {this.state.newPassword_error}
                      </Text>
                    ) : (
                      <Text style={{ fontFamily: "Arial" }} />
                    )}

                    <Text style={{ fontFamily: "Arial", paddingTop: 8 }}>
                      Confirm Password
                    </Text>
                    <TextInput
                      underlineColorAndroid ={'grey'}
                      secureTextEntry={true}
                      onChangeText={text => {
                        this.setState({
                          confirmPassword: text
                        });
                      }}
                      style={{ height: 40 }}
                    />
                    {Global.iOSPlatform ? (
                      <View
                        style={{
                          height: 0.5,
                          marginLeft: 0,
                          marginRight: 0,
                          marginTop: -8,
                          marginBottom: 16,
                          backgroundColor: "#DFDFDF"
                        }}
                      />
                    ) : null}
                    {this.state.confirmPassword_error !== "" ? (
                      <Text style={styles.error_style}>
                        {this.state.confirmPassword_error}
                      </Text>
                    ) : (
                      <Text style={{ fontFamily: "Arial" }} />
                    )}
                  </View>
                )}

                <View style={{ flexDirection: "row" }}>
                  <Text
                    onPress={() => {
                      this._renderModal(0);
                    }}
                    style={[
                      CommonStyles.button_style,
                      { paddingTop: 24, paddingRight: 12 }
                    ]}
                  >
                    CLOSE
                  </Text>
                  <View style={{ flex: 1 }} />

                  <Ripple
                    onPress={() => {
                      this.state.isOTPSend
                        ? this.verifyOTP()
                        : this._changePasswordOTP();
                      //   this.setState({otpMatch:true})
                    }}
                  >
                    <Text
                      style={[
                        CommonStyles.button_style,
                        { paddingTop: 24, color: Color.theme_blue }
                      ]}
                    >
                      SUBMIT
                    </Text>
                  </Ripple>
                </View>
              </View>
            </View>
          ) : this.state.flag === 14 ? (
            <ProfileTracker
              activenessLevel={this.state.activenessLevel}
              flag={1}
              closeModal={this.onClose}
              setScroll={this.setScroll}
              getSwipe={this.getSwipe}
              setSwipe={this.setSwipe}
              getData={this.getData}
              changesMadeTracker={this.changesMadeTracker}
            />
          ) : this.state.flag === 15 ? (
            <ProfileTracker
              flag={2}
              stressLevel={this.state.stressLevel}
              closeModal={this.onClose}
              setScroll={this.setScroll}
              getSwipe={this.getSwipe}
              setSwipe={this.setSwipe}
              getData={this.getData}
              changesMadeTracker={this.changesMadeTracker}
            />
          ) : this.state.flag === 16 ? (
            <View>{this.renderRadioButton("Insurance?", 5)}</View>
          ) : null}

          {/* {(this.state.picker_visible)?
         <View style={{flexDirection:'column', margin: 40, backgroundColor: '#ffffff',borderRadius: 6, borderWidth:0.5,borderColor:Color._DF}}>
         <DialogHeader
           style={[styles.dialog_styles, {paddingTop: 24, paddingLeft: 26}]}
           title={'Blood Group'}/>

         <View style={{paddingLeft:26,paddingBottom:20,paddingRight:26}}>


   <Picker
   selectedValue = {this.state.bloodGroup}
   onValueChange = {this.updatebloodGroup}>
  <Picker.Item label = "Banking" value = "Banking" />
  <Picker.Item label = "Business" value = "Business" />
  <Picker.Item label = "IT" value = "IT" />

  </Picker>
          <Text onPress={() => {
             this._renderModal(0)
           }}  style={[CommonStyles.button_style, {color: Color.theme_blue,paddingTop:12,paddingRight:12,textAlign:'right'}]}>OK</Text>
         </View>
         </View>

          :(null)

          } */}

          {this.state.date_visible ? (
            <DatePicker
              dialog_visible={this.set_modal_visible}
              setTime={this.set_selectedDate}
              singlePicker={this.state.pickerType}
              pickerHeader={this.state.pickerHeader}
              pickerData={this.state.pickerData}
              setValue={this.setPickerValue}
              type={this.state.type}
            />
          ) : null}
        </ModalBox>

        {this.state.isLoading ? <ProgressBar /> : null}

        {/* {
      (this.state.changesMade === 1)
      ?
      (
        <Ripple
        onPress={() => {
          this.loadingManipulate(true)
          this.updateProfile()
        }}
        style={{position: 'absolute', width: Global.screenWidth, bottom : 0}}>
        <View style={{padding: 16,backgroundColor: Color.theme_dark_blue}}>
          <Text style={{ fontFamily: 'Arial' ,color: 'white',textAlign: 'center'}}>Update details</Text>
        </View>
      </Ripple>
      )
     :
      (<View></View>)
     } */}
      </View>
    );
  }
}

function mapDispatchToActions(dispatch) {
  return {
    setList: list => dispatch(setList(list)),
    setUnreadFlag: num => dispatch(setUnreadFlag(num)),
    setDemographics: arr => dispatch(setDemographics(arr))
  };
}

const mapStateToProps = state => ({
  pinnedTrackers: state.pinnedTrackers,
  demo: state.demographics
});

export default connect(
  mapStateToProps,
  mapDispatchToActions
)(BasicProfile);
