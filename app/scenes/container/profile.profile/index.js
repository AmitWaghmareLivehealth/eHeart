import React, {Component} from 'react';
import {
  Linking,
  View,
  Text,
  Image,
  ScrollView,
  Modal,
  Switch,
  processColor,
  Animated,
  Alert,
  ActivityIndicator,
} from 'react-native';
import {connect} from 'react-redux';
import {NavigationActions} from 'react-navigation';
import moment from 'moment';

import ImagePicker from 'react-native-image-crop-picker';
import RNFetchBlob from 'react-native-fetch-blob';
import Intercom from 'react-native-intercom';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import ListHeader from '../../components/listheader';
import {Toast} from 'native-base';
import {
  URLs,
  Routes,
  LoginManager,
  UserDefaults,
  ProfileManager,
  stringsAlertReports,
  stringsUserDefaults,
  NetworkRequest,
  Color,
  CommonManager,
  AlertManager,
  extFile,
  Global,
  CommonStyles,
} from '../../../utils';
import {Ripple, ModalBox} from '../../components';
import styles from './styles';
import {AgeTimer} from '../../components';

import {setList} from '../../../redux/actions/pinnedtrackers';
import {ProgressBar, CirclePercentage} from '../../components';
import BillingHistory from '../profile.billing.history';
import ProfileBasic from '../profile.basic';
import NotificationPreferences from '../profile.notification.prefs';
import Feedback from '../profile.feedback';
import AboutUs from '../profile.about_us';
import AllUpcomingOrders from '../allUpcomingOrders/';
import {setUnreadFlag, setDemographics} from '../../../redux/actions/index';
import QueryModal from '../queryModal';
import {submitQuery} from './utils';
import AlertMsg from './AlertMsg';

var isHidden = true;

args_bundle = {};

class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      alertMsg: '',
      alertType: '',
      showQueryModal: false,
      user: '',
      userName: '',
      profilepic: '',
      image: '',
      age: '',
      address: '',
      dateOfBirth: '',
      logout_modal: false,
      modal_visible: false,
      modal_visible_1: false,
      trackerCount: 0,
      reportCount: 0,
      providerCount: 0,
      duration: 0,
      isLoading: false,
      pinnedTrackers: '',
      reRender: 1,
      transactionModal: false,
      profileModal: false,
      notificationModal: false,
      feedbackModal: false,
      about_usModal: false,
      upcomingOrderModal: false,
      bounceValue: new Animated.Value(100),
      swipeToClose: true,
      isOpen: false,
      handleError: false,
      demographics: {},
      height: 0,
      weight: 0,
      params: '',
      args_bundle: args_bundle,
      isImageLoaded: false,
      activenessLevel: [],
      stressLevel: [],
      showIndi: false,
    };

    this.gotoProfileBasic = this.gotoProfileBasic.bind(this);
    this.gotoPaymentHistoryScreen = this.gotoPaymentHistoryScreen.bind(this);
    this.gotoFeedbackScreen = this.gotoFeedbackScreen.bind(this);
    this.gotoNotification = this.gotoNotification.bind(this);
    this.gotoAboutUs = this.gotoAboutUs.bind(this);
    this.getData = this.getData.bind(this);
    this.afterUpdate = this.afterUpdate.bind(this);
    this.updateProfile = this.updateProfile.bind(this);
    this.loadingManipulate = this.loadingManipulate.bind(this);
    this.generateData = this.generateData.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this._toggleSubview = this._toggleSubview.bind(this);
    this.onClose = this.onClose.bind(this);
    this.onOpen = this.onOpen.bind(this);
    this.onClosingState = this.onClosingState.bind(this);
    this.logout = this.logout.bind(this);
    this.setSwipe = this.setSwipe.bind(this);
    this.getSwipe = this.getSwipe.bind(this);
    this.setBundle = this.setBundle.bind(this);
    this.trackerChange = this.trackerChange.bind(this);
    this.gotoGallery = this.gotoGallery.bind(this);
  }

  setBundle(params, userName, dob) {
    console.log('BUNDLE: ', params);

    this.setState({
      params: params,
      userName: userName,
      dateOfBirth: dob,
    });
    this.updateProfile();
  }

  trackerChange(activenessLevel, stressLevel) {
    this.setState({
      activenessLevel: activenessLevel,
      stressLevel: stressLevel,
    });
  }

  componentWillMount() {
    this.props.setDemographics({show: 1});
  }

  componentDidMount() {
    const {params} = this.props.navigation.state;
    // console.log('TESTING2: ', params.isFromHome)
    setTimeout(() => {
      this.setState({
        showIndi: true,
      });
    }, 500);
    this.getData(0);
    this.generateData();
  }

  componentWillReceiveProps() {
    console.log('TESTING: ', this.props.isFromHome);
  }

  loadingManipulate(flag) {
    this.setState({
      isLoading: flag,
    });
  }

  setSwipe(flag) {
    this.setState({
      swipeToClose: flag,
    });
  }

  getSwipe() {
    return this.state.swipeToClose;
  }
  async updateProfile() {
    UserDefaults.get(stringsUserDefaults.userToken)
      .then(token => {
        if (this.state.image) {
          var image = encodeURIComponent(this.state.image);
        } else {
          image = '';
        }
        if (!this.state.params) {
          var params =
            'token=' +
            token +
            '&image=' +
            image +
            '&fullName=' +
            this.state.user.fullName +
            '&email=' +
            this.state.user.user.email +
            '&gender=' +
            this.state.user.sex +
            '&dob=' +
            this.state.user.dateOfBirth +
            '&city=' +
            this.state.user.city +
            '&designation=' +
            this.state.user.designation +
            '&args=' +
            JSON.stringify(this.state.args_bundle);
        } else {
          params = this.state.params;
        }

        var _this = this;
        NetworkRequest(_this, 'POST', URLs.updateProfile, params)
          .then(result => {
            if (result.success) {
              if ((result.response.code || 0) === 200) {
                this.loadingManipulate(false);
                this.afterUpdate(result.response);
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

  afterUpdate(response) {
    try {
      try {
        this.state.user.profilepic = response.filePath
          ? response.filePath
          : this.state.user.profilepic;
      } catch (error) {
        console.error(error);
      }
      if (!this.state.params) {
        UserDefaults.set(stringsUserDefaults.user, this.state.user || '');
        UserDefaults.set(
          stringsUserDefaults.currentProfilePicURLFromWeb,
          this.state.user.profilepic || '',
        );
      }

      setTimeout(() => {
        this.setState({
          reRender: 1,
          params: '',
        });
      }, 300);
    } catch (error) {
      console.error(error);
    }

    try {
      user = this.state.user;
      demographics = this.state.demographics._source;

      UserDefaults.set(stringsUserDefaults.user, user || '');
      UserDefaults.set(stringsUserDefaults.userName, user.fullName || '');
      UserDefaults.set(
        stringsUserDefaults.userDesignation,
        this.state.user.designation || '',
      );
      UserDefaults.set(stringsUserDefaults.userEmail, user.user.email || '');
      UserDefaults.set(stringsUserDefaults.userSex, user.sex || '');
      UserDefaults.set(
        stringsUserDefaults.userDateOfBirth,
        user.dateOfBirth || '',
      );

      if (demographics) {
        UserDefaults.set(
          stringsUserDefaults.demographics,
          this.state.demographics || '',
        );

        UserDefaults.set(
          stringsUserDefaults.industryType,
          demographics.industryType || '',
        );

        UserDefaults.set(
          stringsUserDefaults.occupation,
          demographics.occupation || '',
        );

        UserDefaults.set(
          stringsUserDefaults.isDiabetic,
          demographics.isDiabetic || '',
        );

        UserDefaults.set(
          stringsUserDefaults.isChronic,
          demographics.isChronic || '',
        );

        UserDefaults.set(
          stringsUserDefaults.isSmoker,
          demographics.isSmoker || '',
        );

        UserDefaults.set(
          stringsUserDefaults.consumesAlcohol,
          demographics.consumesAlcohol || '',
        );

        UserDefaults.set(
          stringsUserDefaults.bloodGroup,
          demographics.bloodGroup || '',
        );
      }
      // UserDefaults.set(stringsUserDefaults.weight, demographics.weight || '')

      //  UserDefaults.set(stringsUserDefaults.height, demographics.heightInCm || '')
    } catch (error) {
      console.error(error);
    }

    if (this.renewData) {
      this.renewData(0);
    } else {
      // Profile.forceUpdate()
    }
    // this.closeModal()
  }

  generateData() {
    UserDefaults.get(stringsUserDefaults.userToken)
      .then(token => {
        let params = 'token=' + token || '';
        var _this = this;
        NetworkRequest(_this, 'POST', URLs.getProfileSummary, params)
          .then(result => {
            if (result) {
              if (result.success) {
                if (result.response) {
                  if ((result.response.code || 0) === 200) {
                    var trackerCount = result.response.trackerCount;
                    var reportCount = result.response.reportCount;
                    var providerCount = result.response.providersCount;

                    this.setState({
                      trackerCount: trackerCount,
                      reportCount: reportCount,
                      providerCount: providerCount,
                    });
                  } else if ((result.response.code || 0) === 500) {
                  }
                }
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

  getData(flag) {
    //  this.props.setDemographics({isChronic:0})

    UserDefaults.get(stringsUserDefaults.user)
      .then(user => {
        if (user) {
          var address = '';
          var age = '';
          try {
            (address = user.area), user.city;
            if (user.age) {
              if (user.age !== '0') {
                age = user.age + ' years old';
              }
            }
          } catch (error) {
            console.error(error);
          }
          this.setState({
            user: user || '',
            userName: user.fullName || '',
            profilepic: user.profilepic || '',
            dateOfBirth: user.dateOfBirth || '',
            age: age,
            address: address,
          });

          if (flag === 1) {
            this.gotoProfileBasic();
            return;
          }
        }
      })
      .catch(error => {
        console.error(error);
      });

    UserDefaults.get(stringsUserDefaults.demographics)
      .then(demographics => {
        if (demographics) {
          this.setState({
            demographics: demographics || {},
          });
        } else {
          this.state.demographics['_source'] = {};
        }
      })
      .catch(error => {
        console.error(error);
      });

    UserDefaults.get(stringsUserDefaults.activenessLevel)
      .then(activenessLevel => {
        if (activenessLevel) {
          this.setState({
            activenessLevel: activenessLevel,
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
            stressLevel: stressLevel,
          });
        }
      })
      .catch(error => {
        console.error(error);
      });

    UserDefaults.get(stringsUserDefaults.height)
      .then(height => {
        // if(height){

        this.setState({
          height: height || '',
        });
        // }
      })
      .catch(error => {
        console.error(error);
      });

    UserDefaults.get(stringsUserDefaults.weight)
      .then(weight => {
        // if(weight){

        this.setState({
          weight: weight || '',
        });
        // }
      })
      .catch(error => {
        console.error(error);
      });
  }

  gotoProfileBasic() {
    // setTimeout(() => {this.props.navigation.navigate(Routes.profileBasicDetailsScreen, {
    //   user: this.state.user,
    //   renewData: this.getData
    // })},50)

    this.setState({
      logout_modal: false,
      modal_visible: true,
      modal_visible_1: true,
      transactionModal: false,
      profileModal: true,
      notificationModal: false,
      feedbackModal: false,
      about_usModal: false,
      upcomingOrderModal: false,
    });
  }

  gotoPaymentHistoryScreen() {
    setTimeout(() => {
      this.props.navigation.navigate(Routes.profilePaymentHistoryScreen, {});
    }, 50);
  }

  gotoFeedbackScreen() {
    // setTimeout(() => {this.props.navigation.navigate(Routes.profileFeedbackScreen, {
    //
    // })},50)

    this.setState({
      logout_modal: false,
      modal_visible: true,
      modal_visible_1: true,
      transactionModal: false,
      profileModal: false,
      notificationModal: false,
      feedbackModal: true,
      about_usModal: false,
      upcomingOrderModal: false,
    });
  }

  gotoNotification() {
    // setTimeout(() => {this.props.navigation.navigate(Routes.profileNotification, {
    //
    // })},50)
    this.setState({
      logout_modal: false,
      modal_visible: true,
      modal_visible_1: true,
      transactionModal: false,
      profileModal: false,
      notificationModal: true,
      feedbackModal: false,
      about_usModal: false,
      upcomingOrderModal: false,
    });
  }

  gotoAboutUs() {
    this.setState({
      logout_modal: false,
      modal_visible: true,
      modal_visible_1: true,
      transactionModal: false,
      profileModal: false,
      notificationModal: false,
      feedbackModal: false,
      about_usModal: true,
      upcomingOrderModal: false,
    });
  }

  gotoGallery() {
    //gallery

    setTimeout(() => {
      this.props.navigation.navigate(Routes.gallery, {});
    }, 50);
  }

  logout() {
    var _this = this;
    this.props.setUnreadFlag(0);
    LoginManager.logout(_this);
    // this.props.setDemographics({show:1})
    this.props.setList([]);
    const resetAction = NavigationActions.reset({
      index: 0,
      key: null,
      actions: [
        NavigationActions.navigate({
          routeName: Routes.loginScreen,
        }),
      ],
    });
    this.props.navigation.dispatch(resetAction);
    // this.props.navigation.navigate(Routes.loginScreen)
  }

  setFinalImagePath(image) {
    RNFetchBlob.fs
      .exists(image.path || '')
      .then(exist => {
        var ext = extFile.getFileExtFromMIME(image.mime || '');
        if (ext !== '.tmp') {
          RNFetchBlob.fs
            .readFile(image.path || '', 'base64')
            .then(imageDataBase64 => {
              console.log(image.path);
              this.setState({
                profilepic: image.path,
                image: imageDataBase64,
              });
              this.loadingManipulate(true);
              this.updateProfile();
            })
            .catch(CommonManager.handleError);
        } else {
          AlertManager.AlertGeneric(
            stringsAlertReports.unknownFileType.header,
            stringsAlertReports.unknownFileType.message,
          );
        }
      })
      .catch(error =>
        CommonManager.handleErrorWithMsg(
          error,
          stringsAlertReports.unknownFileType.header,
          stringsAlertReports.unknownFileType.message,
        ),
      );
  }

  _toggleSubview() {
    var toValue = 100;

    if (isHidden) {
      toValue = 0;
    }

    //This will animate the transalteY of the subview between 0 & 100 depending on its current state
    //100 comes from the style below, which is the height of the subview.
    Animated.spring(this.state.bounceValue, {
      toValue: toValue,
      velocity: 3,
      tension: 2,
      friction: 8,
    }).start();

    isHidden = !isHidden;
  }

  onClose() {
    this.closeModal();
    console.log('Modal just closed');
  }

  onOpen() {
    console.log('Modal just openned');
  }
  onClosingState(state) {
    console.log('the open/close of the swipeToClose just changed', state);
  }

  closeModal() {
    this.setState({
      logout_modal: false,
      modal_visible: false,
      modal_visible_1: false,
      transactionModal: false,
      profileModal: false,
      notificationModal: false,
      feedbackModal: false,
      about_usModal: false,
      showQueryModal: false,
    });
  }

  onSubmitQuery = async query => {
    UserDefaults.get(stringsUserDefaults.userToken).then(async token => {
      try {
        const res = await submitQuery(token, query,this.state.user);
        console.log(res)
        this.setState({
          alertMsg: res?'Query sent successfully':'Sorry Failed to send query',
          alertType: res?'success':'error',
        });
        this.closeModal();
      } catch (err) {
        this.closeModal();
      }
    });
  };

  render() {
    const {
      props: {name, index, list},
    } = this;
    const {showQueryModal} = this.state;
    var count = 0;
    var user = this.state.user;
    var profilepicFlag = 0;
    var demographics = this.state.demographics;
    var height = this.state.height;
    var weight = this.state.weight;
    var isProfilePic = false;

    var stressLevel = this.state.stressLevel.length;
    var activenessLevel = this.state.activenessLevel.length;

    if (user) {
      if (
        user.user.email &&
        user.fullName &&
        user.dateOfBirth &&
        user.sex &&
        user.profilePic
      ) {
        count += 5;
      } else {
        if (user.user.email) {
          count += 1;
        }
        if (user.fullName) {
          count += 1;
        }
        if (user.profilepic) {
          count += 1;
          isProfilePic = true;
        } else {
          isProfilePic = false;
        }
        if (user.dateOfBirth) {
          count += 1;
        }
        if (user.sex) {
          count += 1;
        }
      }
    }

    if (demographics._source) {
      // if(
      //   activenessLevel > 0 &&
      //   stressLevel > 0 &&
      //   demographics._source.industryType &&
      //   demographics._source.occupation &&
      //   demographics._source.isDiabetic &&
      //   demographics._source.isChronic &&
      //   demographics._source.isSmoker &&
      //   demographics._source.consumesAlcohol &&
      //   demographics._source.bloodGroup &&
      //   height && weight

      // ){
      //   count+=10
      // }

      //  else
      //  {

      if (
        demographics._source.industryType &&
        demographics._source.occupation
      ) {
        count += 1;
      }

      if (
        demographics._source.isDiabetic === 0 ||
        demographics._source.isDiabetic === 1
      ) {
        count += 1;
      }
      if (
        demographics._source.isChronic === 0 ||
        demographics._source.isChronic === 1
      ) {
        count += 1;
      }
      if (demographics._source.isSmoker) {
        count += 1;
      }
      if (demographics._source.consumesAlcohol) {
        count += 1;
      }
      if (demographics._source.bloodGroup) {
        count += 1;
      }

      if (
        demographics._source.hasInsurance == 0 ||
        demographics._source.hasInsurance == 1
      ) {
        count += 1;
      }
    }

    if (activenessLevel > 0) {
      count += 1;
    }
    if (stressLevel > 0) {
      count += 1;
    }

    if (this.state.height > 0) {
      count += 1;
    }
    if (this.state.weight) {
      count += 1;
    }

    //}

    var percentage = 0;
    var completion = 0;

    if (count == 16) {
      percentage = 100;
      completion = 1;
      this.props.setDemographics({show: 1});
    } else {
      percentage = parseInt((count / 16) * 100);
      completion = count / 16;

      {
        this.state.showIndi ? this.props.setDemographics({show: 0}) : null;
      }
    }
    if (user.profilepic) {
      console.log('UPDATED', user.profilepic);
      profilepicFlag = 1;
    } else {
      profilepicFlag = 0;
      //  this.props.setDemographics({show:0})
    }
    const img_url = URLs.fileDownloadPath + this.state.profilepic;
    const {alertMsg, alertType} = this.state;
    return (
      <ScrollView bounces={true} style={styles.container}>
        {alertMsg ? <AlertMsg onEnd={()=>this.setState({alertMsg:''})} msg={alertMsg} alertType={alertType} /> : <View></View>}
        <View>
          <View
            style={{
              flexDirection: 'row',
              paddingLeft: 17,
              paddingRight: 17,
              paddingTop: Global.iOSPlatform ? 44 : 24,
              paddingBottom: 8,
              top: Global.isIphoneX ? 10 : 0,
            }}>
            <Ripple
              onPress={() => {
                this.setState({
                  modal_visible: true,
                  modal_visible_1: false,
                  logout_modal: false,
                  transactionModal: false,
                  profileModal: false,
                  notificationModal: false,
                  feedbackModal: false,
                  about_usModal: false,
                });
              }}>
              {/* <View
                style={{
                  backgroundColor: '#DFDFDF',
                  height: 110,
                  width: 110,
                  justifyContent: 'center',
                  alignItems:'center',
                  borderRadius:110/2
                }}> */}

              <CirclePercentage
                radius={Global.iOSPlatform ? 50 : 55}
                percent={percentage}
                bgcolor={'white'}
                color={completion != 1 ? Color.themeColor : 'white'}
                borderWidth={4}
                innerColor={'#ccc'}>
                {/* {!this.state.isImageLoaded?    <ActivityIndicator style = {{position:'absolute'}}/>:(null)} */}

                {this.state.profilepic !== '' ? (
                  <Image
                    source={{uri: img_url}}
                    style={{height: 100, width: 100, borderRadius: 50}}
                    // onLoad = {()=> {this.setState({isImageLoaded:true})}}
                  />
                ) : (
                  <View>
                    <MaterialCommunityIcons
                      name={'account'}
                      size={40}
                      style={styles.iconStyle_profile}
                    />
                  </View>
                )}
              </CirclePercentage>

              {/* <MaterialIcons
              name={'error-outline'}
              size={30}
              style={{color: Color.starYellow, paddingLeft: 4, paddingRight: 4, position:'absolute',backgroundColor:'transparent', left:70, bottom:10
              }}
                /> */}
              {/* </View> */}
            </Ripple>
            <View style={{flex: 1, paddingTop: 6, paddingLeft: 14}}>
              <Text
                style={{
                  fontFamily: 'Arial',
                  fontSize: 26,
                  fontWeight: '800',
                  color: 'black',
                }}>
                {this.state.userName}{' '}
              </Text>
              {/* {(this.state.age) ? (<Text style={{ fontFamily: 'Arial' ,textAlign: 'left'}}>{this.state.age}</Text>) : (null)} */}
              {this.state.dateOfBirth ? (
                <AgeTimer dateOfBirth={this.state.dateOfBirth} />
              ) : null}
              {completion != 1 ? (
                <Ripple
                  onPress={() => {
                    this.gotoProfileBasic();
                  }}>
                  <Text
                    style={{
                      fontSize: 14,
                      color: Color.themeColor,
                      marginRight: 12,
                      paddingTop: 2,
                      paddingLeft: 0,
                    }}>
                    {' '}
                    {percentage}% Complete
                  </Text>
                </Ripple>
              ) : null}
            </View>
          </View>
          {/* <Text style= {{ fontSize:14, color:Color.starYellow, marginRight:12, paddingTop:2, paddingLeft:0}}> Update your profile picture</Text></Ripple> */}

          <View style={{marginTop: -10, paddingLeft: 16, paddingRight: 16}}>
            {/* {(percentage !== 100 & completion !== 1)
              ?
              (<View>
                <View style={{flexDirection: 'row',flex:1, alignItems: 'center'}}>
                  {(this.state.reRender) ? (<View style={{width : (Global.screenWidth - (66)) * completion,backgroundColor: '#73cd1f', padding:6,alignItems: 'center',borderRadius:4,position: 'absolute'}}></View>) : (null)}
                  <View style={{flex:1,borderRadius:4,borderWidth:0.5,borderColor: Color._36,flexDirection :'row'}}>
                    <View style={{flex:1, padding:6}}></View>
                    <View style={{backgroundColor: Color._36,marginTop: 3, marginBottom: 3,width: 0.5}}></View>
                    <View style={{flex:1, padding:6}}></View>
                    <View style={{backgroundColor: Color._36,marginTop: 3, marginBottom: 3,width: 0.5}}></View>
                    <View style={{flex:1, padding:6}}></View>
                    <View style={{backgroundColor: Color._36,marginTop: 3, marginBottom: 3,width: 0.5}}></View>
                    <View style={{flex:1, padding:6}}></View>
                    <View style={{backgroundColor: Color._36,marginTop: 3, marginBottom: 3,width: 0.5}}></View>
                    <View style={{flex:1, padding:6}}></View>
                    <View style={{backgroundColor: Color._36,marginTop: 3, marginBottom: 3,width: 0.5}}></View>
                    <View style={{flex:1, padding:6}}></View>
                  </View>
                  <Text style={{ fontFamily: 'Arial' ,width: 34,textAlign:'right',fontSize:12}}>{percentage}%</Text>
                </View>
                <View style={{flexDirection: 'row'}}>
                  <Ripple
                    onPress={() => {
                      this.gotoProfileBasic()
                      }}>
                      <Text style={{ fontFamily: 'Arial' ,paddingTop: 8, paddingBottom: 8,fontSize: 16, color: Color._36}}> {(completion === 1) ? 'Complete' : 'Complete Now >' }</Text>
                  </Ripple>
                  <View style={{flex: 1}}></View>
                </View>
              </View>) : (null)} */}

            <View
              style={{
                flexDirection: 'row',
                paddingTop: 24,
                paddingBottom: 16,
              }}>
              <View style={{flex: 1, alignItems: 'center'}}>
                <Text
                  style={{
                    fontFamily: 'Arial',
                    fontSize: 22,
                    fontWeight: '700',
                    color: Color._54,
                  }}>
                  {this.state.reportCount}
                </Text>
                <Text style={{fontFamily: 'Arial', color: Color._9F}}>
                  Reports
                </Text>
              </View>

              <View style={{width: 0.5, backgroundColor: 'black'}} />

              <View style={{flex: 1, alignItems: 'center'}}>
                <Text
                  style={{
                    fontFamily: 'Arial',
                    fontSize: 22,
                    fontWeight: '700',
                    color: Color._54,
                  }}>
                  {this.state.trackerCount}
                </Text>
                <Text style={{fontFamily: 'Arial', color: Color._9F}}>
                  Trackers
                </Text>
              </View>

              <View style={{width: 0.5, backgroundColor: 'black'}} />

              <View style={{flex: 1, alignItems: 'center'}}>
                <Text style={CommonStyles.common_header}>
                  {this.state.providerCount}
                </Text>
                <Text style={{fontFamily: 'Arial', color: Color._9F}}>
                  Providers
                </Text>
              </View>
            </View>
          </View>
        </View>

        <ListHeader headerText={''} />

        <Ripple
          onPress={() => {
            // this.gotoPaymentHistoryScreen()
            this.setState({
              logout_modal: false,
              modal_visible: true,
              modal_visible_1: true,
              transactionModal: true,
              profileModal: false,
              notificationModal: false,
              feedbackModal: false,
              about_usModal: false,
              upcomingOrderModal: false,
            });
          }}>
          <View style={styles.innerContainerStyle}>
            <Text style={styles.textStyle}>View Transaction History</Text>
          </View>
        </Ripple>

        <View style={styles.line_separator} />
        <Ripple
          onPress={() => {
            this.setState({
              upcomingOrderModal: true,
              modal_visible: true,
              modal_visible_1: true,
              transactionModal: false,
              profileModal: false,
              notificationModal: false,
              feedbackModal: false,
              about_usModal: false,
              logout_modal: false,
            });
          }}>
          <View style={styles.innerContainerStyle}>
            <Text style={styles.textStyle}>View Upcoming Orders</Text>
          </View>
        </Ripple>

        <View style={styles.line_separator} />

        <Ripple
          onPress={() => {
            if (!this.state.user) {
              this.getData(1);
            } else {
              this.gotoProfileBasic();
            }
          }}>
          <View
            style={[
              styles.innerContainerStyle,
              {justifyContent: 'space-between'},
            ]}>
            <Text style={styles.textStyle}>Edit Profile</Text>
            {this.state.showIndi ? (
              (completion == 0.9375 && !isProfilePic) ||
              (completion == 1 && isProfilePic) ? null : (
                <View style={{flexDirection: 'row'}}>
                  <MaterialIcons
                    name={'error-outline'}
                    size={20}
                    style={{
                      color: Color.starYellow,
                      paddingLeft: 4,
                      paddingRight: 4,
                    }}
                  />

                  <Text style={{color: Color.starYellow}}>Incomplete</Text>
                </View>
              )
            ) : null}
          </View>
        </Ripple>

        <ListHeader headerText={'Preferences'} />

        <Ripple
          onPress={() => {
            this.gotoNotification();
          }}>
          <View style={styles.innerContainerStyle}>
            <View style={{flexDirection: 'row'}}>
              <View style={{flexDirection: 'column', flex: 1}}>
                <Text style={styles.textStyle}>Notifications</Text>
                <Text
                  style={{
                    fontFamily: 'Arial',
                    color: Color._9F,
                    paddingTop: 8,
                  }}>
                  Disable push and other notifications about reports, payments,
                  offers and trackers
                </Text>
              </View>
            </View>
          </View>
        </Ripple>

        <ListHeader headerText={'Help & Support'} />

        <Ripple
          style={styles.innerContainerStyle}
          onPress={() =>
            this.setState({
              modal_visible_1: true,
              modal_visible: true,
              showQueryModal: true,
            })
          }>
          <Text style={styles.textStyle}>Help & FAQs</Text>
        </Ripple>

        <View style={styles.line_separator} />

        <Ripple
          onPress={() => {
            this.gotoFeedbackScreen();
          }}>
          <View style={styles.innerContainerStyle}>
            <Text style={styles.textStyle}>Feedback</Text>
          </View>
        </Ripple>

        <View style={styles.line_separator} />

        {/* <Ripple
          onPress={() => {
            this.gotoGallery();
          }}
        >
          <View style={styles.innerContainerStyle}>
            <Text style={styles.textStyle}>Gallery</Text>
          </View>
        </Ripple> */}

        <View style={styles.line_separator} />

        <Ripple
          onPress={() => {
            this.gotoAboutUs();
          }}>
          <View style={styles.innerContainerStyle}>
            <Text style={styles.textStyle}>About Us</Text>
          </View>
        </Ripple>

        <View style={styles.line_separator} />

        <Ripple
          style={{padding: 13, alignItems: 'center'}}
          onPress={() => {
            this.setState({
              logout_modal: true,
              modal_visible: true,
              modal_visible_1: false,
              transactionModal: false,
              profileModal: false,
              notificationModal: false,
              feedbackModal: false,
              about_usModal: false,
            });
          }}>
          <Text style={{fontFamily: 'Arial', fontSize: 16, color: '#AC0203'}}>
            Sign Out
          </Text>
        </Ripple>
        <View style={{backgroundColor: '#DFDFDF', height: 0.5}} />

        <View
          style={{
            padding: 24,
            backgroundColor: Color._EEGrayTableHeader,
            alignItems: 'center',
          }}>
          <View style={{flexDirection: 'row', paddingBottom: 8}}>
            <Text style={{fontFamily: 'Arial', color: Color._9F}}>
              Made with
            </Text>
            <MaterialIcons
              name={'favorite'}
              size={20}
              style={{color: '#F95428', paddingLeft: 4, paddingRight: 4}}
            />
            <Text style={{fontFamily: 'Arial', color: Color._9F}}>
              in india
            </Text>
          </View>
          <Text
            style={{
              fontFamily: 'Arial',
              color: Color._9F,
              textAlign: 'center',
            }}>
            A unique product of Creliant Labs Pvt. Ltd. © 2017
          </Text>
        </View>

        <Modal
          animationType={'none'}
          transparent={true}
          backdrop={true}
          visible={this.state.modal_visible}
          onRequestClose={() => {
            this.setState({
              modal_visible: false,
            });
          }}>
          {this.state.modal_visible_1 ? (
            <ModalBox
              style={[styles.modal, styles.modal1]}
              ref={'modal1'}
              swipeThreshold={200}
              swipeArea={
                !this.state.upcomingOrderModal ? Global.screenHeight : 300
              }
              isOpen={this.state.modal_visible_1}
              swipeToClose={this.state.swipeToClose && !this.state.about_usModal}
              onClosed={this.onClose}
              position={'top'}
              keyboardTopOffset={Global.iOSPlatform ? 22 : 0}
              onOpened={this.onOpen}
              onClosingState={this.onClosingState}>
              {showQueryModal && (
                <QueryModal
                  onSubmitQuery={this.onSubmitQuery}
                  closeModal={this.closeModal}
                  user={this.state.user}
                />
              )}

              {this.state.upcomingOrderModal ? (
                <AllUpcomingOrders
                  setSwipe={this.setSwipe}
                  getSwipe={this.getSwipe}
                  setScroll={this.setScroll}
                  closeModal={this.closeModal}
                />
              ) : this.state.transactionModal ? (
                <BillingHistory closeModal={this.closeModal} />
              ) : this.state.profileModal ? (
                <ProfileBasic
                  type={completion == 1 ? false : true}
                  user={this.state.user}
                  demographics={this.state.demographics}
                  height={this.state.height}
                  weight={this.state.weight}
                  renewData={this.getData}
                  closeModal={this.closeModal}
                  bundle={this.setBundle}
                  trackerChange={this.trackerChange}
                />
              ) : this.state.notificationModal ? (
                <NotificationPreferences closeModal={this.closeModal} />
              ) : this.state.feedbackModal ? (
                <Feedback closeModal={this.closeModal} user={this.state.user} />
              ) : this.state.about_usModal ? (
                <AboutUs closeModal={this.closeModal} />
              ) : null}
            </ModalBox>
          ) : !this.state.logout_modal ? (
            <View
              style={{
                flex: 1,
                flexDirection: 'row',
                backgroundColor: '#00000080',
              }}>
              <View style={{margin: 16, flex: 1, justifyContent: 'flex-end'}}>
                <Ripple
                  activeOpacity={0.9}
                  onPress={() => {
                    ImagePicker.openCamera({
                      compressImageQuality: 1,
                      width: 1200,
                      height: 1600,
                      cropping: true,
                      mediaType: 'photo',
                    })
                      .then(image => {
                        this.setFinalImagePath(image);

                        this.setState({
                          modal_visible: false,
                        });
                      })
                      .catch(error => {
                        {
                          if (Global.iOSPlatform) {
                            if (
                              String(error).includes(
                                'User did not grant camera permission.',
                              )
                            ) {
                              Alert.alert(
                                'Camera',
                                'You need to grant camera permission from settings',
                                [
                                  {
                                    text: 'Cancel',
                                    onPress: () =>
                                      console.log('Cancel Pressed'),
                                  },
                                  {
                                    text: 'Settings',
                                    onPress: () => {
                                      Linking.openURL('app-settings:');
                                      this.setState({
                                        modal_visible: false,
                                      });
                                    },
                                  },
                                ],
                                {cancelable: false},
                              );
                            } else {
                              // this.setState({
                              //   modal_visible: false,
                              // })
                            }
                          } else {
                            this.setState({
                              modal_visible: false,
                            });
                          }
                        }
                        console.log('Camera library error', error);
                      });
                  }}>
                  <View
                    style={{
                      flexDirection: 'row',
                      padding: 16,
                      backgroundColor: '#ffffff',
                      right: 10,
                      left: 0,
                    }}>
                    <MaterialIcons
                      name={'camera-alt'}
                      size={24}
                      style={{
                        color: Color._36,
                      }}
                    />
                    <Text style={{fontFamily: 'Arial', paddingLeft: 16}}>
                      Capture from Camera
                    </Text>
                  </View>
                </Ripple>

                <View style={{height: 0.5, backgroundColor: '#DFDFDF'}} />

                <Ripple
                  onPress={() => {
                    ImagePicker.openPicker({
                      compressImageQuality: 1,
                      width: 1200,
                      height: 1600,
                      cropping: true,
                      mediaType: 'any',
                    })
                      .then(image => {
                        this.setState({
                          modal_visible: false,
                        });
                        this.setFinalImagePath(image);
                      })
                      .catch(error => {
                        {
                          if (Global.iOSPlatform) {
                            if (
                              String(error).includes(
                                'Cannot access images. Please allow access if you want to be able to select images.',
                              )
                            ) {
                              Alert.alert(
                                'Photos',
                                'You need to grant permission to access photos from settings',
                                [
                                  {
                                    text: 'Cancel',
                                    onPress: () =>
                                      console.log('Cancel Pressed'),
                                  },
                                  {
                                    text: 'Settings',
                                    onPress: () => {
                                      Linking.openURL('app-settings:');
                                      this.setState({
                                        modal_visible: false,
                                      });
                                    },
                                  },
                                ],
                                {cancelable: false},
                              );
                            } else {
                            }
                          } else {
                            this.setState({
                              modal_visible: false,
                            });
                          }
                        }

                        console.log(error);
                      });
                  }}>
                  <View
                    style={{
                      flexDirection: 'row',
                      padding: 16,
                      backgroundColor: '#ffffff',
                      right: 10,
                      left: 0,
                    }}>
                    <MaterialIcons
                      name={'photo-library'}
                      size={24}
                      style={{
                        color: Color._36,
                      }}
                    />
                    <Text style={{fontFamily: 'Arial', paddingLeft: 16}}>
                      Select from Gallery
                    </Text>
                  </View>
                </Ripple>

                <View style={{height: 0.5, backgroundColor: '#DFDFDF'}} />

                <Ripple
                  onPress={() => {
                    this.setState({
                      modal_visible: false,
                    });
                  }}>
                  <View
                    style={{
                      flexDirection: 'row',
                      padding: 16,
                      backgroundColor: '#ffffff',
                      right: 10,
                      left: 0,
                    }}>
                    <MaterialIcons
                      name={'close'}
                      size={24}
                      style={{
                        color: Color._36,
                      }}
                    />
                    <Text
                      style={{
                        fontFamily: 'Arial',
                        paddingLeft: 16,
                        paddingTop: 4,
                      }}>
                      Close
                    </Text>
                  </View>
                </Ripple>
              </View>
            </View>
          ) : (
            <View
              style={{
                flex: 1,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#00000080',
              }}>
              <View
                style={{
                  flex: 1,
                  flexDirection: 'column',
                  margin: 40,
                  backgroundColor: '#ffffff',
                  borderWidth: 0.5,
                  borderColor: Color._DF,
                  borderRadius: 4,
                }}>
                <Text
                  style={{
                    fontFamily: 'Arial',
                    paddingLeft: 16,
                    paddingTop: 16,
                    fontSize: 24,
                    fontWeight: '700',
                    color: 'black',
                  }}>
                  Logout
                </Text>
                <Text
                  style={{
                    fontFamily: 'Arial',
                    paddingTop: 16,
                    paddingLeft: 16,
                    paddingRight: 16,
                    fontSize: 16,
                  }}>
                  Are you sure you want to logout?
                </Text>
                <View
                  style={{
                    padding: 8,
                    paddingBottom: 4,
                    flexDirection: 'row',
                    justifyContent: 'flex-end',
                  }}>
                  <Ripple
                    onPress={() => {
                      this.setState({
                        modal_visible: false,
                      });
                    }}>
                    <Text
                      style={[
                        CommonStyles.button_style,
                        {
                          color: Color.theme_blue,
                          padding: 16,
                          textAlign: 'right',
                        },
                      ]}>
                      NO
                    </Text>
                  </Ripple>

                  <Ripple
                    onPress={() => {
                      this.logout();
                    }}>
                    <Text
                      style={[
                        CommonStyles.button_style,
                        {
                          color: Color.theme_blue,
                          padding: 16,
                          textAlign: 'right',
                        },
                      ]}>
                      YES
                    </Text>
                  </Ripple>
                </View>
              </View>
            </View>
          )}
        </Modal>
        {this.state.isLoading ? <ProgressBar /> : null}
      </ScrollView>
    );
  }
}

function mapDispatchToActions(dispatch) {
  return {
    setList: list => dispatch(setList(list)),
    setUnreadFlag: num => dispatch(setUnreadFlag(num)),
    setDemographics: arr => dispatch(setDemographics(arr)),
  };
}

const mapStateToProps = state => ({
  pinnedTrackers: state.pinnedTrackers,
});

export default connect(mapStateToProps, mapDispatchToActions)(Profile);
