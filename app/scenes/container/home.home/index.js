import React, {Component} from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  AppState,
  BackHandler,
  TouchableOpacity,
  Platform,
  Linking,
  StatusBar,
  NativeModules,
  Modal,
  PushNotificationIOS,
  Animated,
  Easing,
  PermissionsAndroid,
  Alert,
  RefreshControl,
} from 'react-native';
import NetInfo from '@react-native-community/netinfo';

import {connect} from 'react-redux';
import DashboardTrackers from '../../components/dashboardtrackers';
import InsuranceModal from '../../components/insurance.component';
import SwipeInfoText from '../../components/swipeinfotext';
import DummyCard from '../../components/dummycard';
import {
  URLs,
  Routes,
  Images,
  Color,
  Global,
  ReportManager,
  NetworkRequest,
  CommonStyles,
  stringsAppId,
  stringReportStatus,
  UserDefaults,
  stringsUserDefaults,
  stringRazorPay,
  stringsNotifications,
  LocationManager,
} from '../../../utils';
import moment from 'moment';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {
  Ripple,
  ProgressBar,
  ModalBox,
  AppLink,
  Tutorial,
  ProgressCircle,
} from '../../components';
import {getList} from '../../../redux/actions/pinnedtrackers';
import {setList} from '../../../redux/actions/pinnedtrackers';
import StarRatingBar from '../../components/rating';
import TipsTricks from '../tips.tricks';
import RazorpayCheckout from 'react-native-razorpay';
import Feedback from '../feedback';
import PendingReportView from '../pending.reportview';
import TrackerDetails from '../tracker.details';
import ReportView from '../report.view';
import {init} from '../../../utils/handlers/notification.remote';
// import {
//   NotificationsAndroid,
//   PendingNotifications
// } from "react-native-notifications";
// import NotificationsIOS from "react-native-notifications";
import Intercom from 'react-native-intercom';
import LocationServicesDialogBox from 'react-native-android-location-services-dialog-box';
import Upcoming from '../upcoming/';
import AllUpcomingOrders from '../allUpcomingOrders/';
import getDirections from '../../components/getDirections/';
import PendingUpcomingOrder from '../pending.upcoming.order/';
import Demographics from '../../components/demographics';
import {stringDictId} from '../../../utils/const/strings';
import {setUnreadFlag} from '../../../redux/actions/index';
import {setDemographics} from '../../../redux/actions/index';
import {setCurrency} from '../../../redux/actions/index';
import {NavigationActions} from 'react-navigation';
import Geolocation from '@react-native-community/geolocation';
import {PHONE_NUMBER} from './const';
import CustomCardForEHeart from './CustomCardForEHeart';
import { updateRawData } from '../report.view/updateRawData';

var _ = require('lodash');

let mainScreen;

function onNotificationOpened(notification) {
  if (mainScreen) {
    console.log('NOTIFICATION CLICKED', notification);
    // mainScreen.onNotificationOpened(notification);
  }
}

function onNotificationReceived(notification) {
  if (mainScreen) {
    console.log('NOTIFICATION RECEIVED', notification);
    // mainScreen.onNotificationReceived(notification);
  }
}

if (!Global.iOSPlatform) {
  // NotificationsAndroid.setNotificationOpenedListener(onNotificationOpened);
  // NotificationsAndroid.setNotificationReceivedListener(onNotificationReceived);
}

var score_before = 0;
var Fabric = require('react-native-fabric');

var {Crashlytics} = Fabric;

var args_bundle = {};

class Home extends Component {
  constructor(props) {
    super(props);

    this.animatedValue = new Animated.Value(0);
    this.springValue = new Animated.Value(1);
    this.animatedValueNotification = new Animated.Value(-70);
    this.state = {
      activenessLevel: [],
      stressLevel: [],
      args_bundle: args_bundle,
      springVal: new Animated.Value(1),
      pinnedTrackers: [],
      user: '',
      pending_report: '',
      labName: '',
      labId: 0,
      billId: 0,
      isUnreadReportFlag: false,
      isFeedbackFlag: false,
      isPendingFlag: false,
      appState: AppState.currentState,
      pendingReports: [],
      rating: 0,
      tipCount: 1,
      email: '',
      contact: '',
      isLoading: false,
      unreadLab: '',
      isInitialLoading: true,
      unreadReports: '',
      user_id: 0,
      userDetailsId_id: 0,
      uuid: '',
      dictionaryId: 0,
      initialCount: 0,
      modal_visible: false,
      feedbackModal: false,
      reportModal: false,
      reportViewModal: false,
      trackerModal: false,
      upcomingOrderModal: false,
      swipeToClose: true,
      isOpen: false,
      selectedSectionArray: [],
      selectedItemModal: undefined,
      userName: '',
      playStoreId: stringsAppId.androidId,
      appStoreId: stringsAppId.iosId,
      notification: {},
      reportId: '',
      isConnection: false,
      isScrollable: false,
      toVal: 0.99,
      isLocationEnabled: false,
      upcomingAppointments: [],
      upcomingHomeCollection: [],
      isHomeCollectionType: false,
      lat: 0,
      lng: 0,
      pendingOrderModal: false,
      refreshing: false,
      homeFeedback: false,
      collectingPersonId: 0,
      homecollectionId: 0,
      takePhlebotomistReview: false,
      phlebotomistName: '',
      labNameHC: '',
      razorpay_item: {},
      showNotification: false,
      notificationHeader: '',
      notificationSubText: '',
      demographyCount: 1,
      insuranceModal: false,
      indicatorText: '',
      processing: 0,
      isShowBooking: 0,
      money: '&#8377;',
    };

    mainScreen = this;

    if (Global.iOSPlatform) {
      // NotificationsIOS.addEventListener(
      //   "notificationReceivedForeground",
      //   this.onNotificationReceivedForeground.bind(this)
      // );
      // NotificationsIOS.addEventListener(
      //   "notificationReceivedBackground",
      //   this.onNotificationReceivedBackground.bind(this)
      // );
      // NotificationsIOS.addEventListener(
      //   "notificationOpened",
      //   this.onNotificationOpened.bind(this)
      // );
    }

    this._renderPage = this._renderPage.bind(this);
    this.getData = this.getData.bind(this);
    this.afterResponsePending = this.afterResponsePending.bind(this);
    this.setPendingReports = this.setPendingReports.bind(this);
    this.getGreetingTime = this.getGreetingTime.bind(this);
    this.checkFeedBack = this.checkFeedBack.bind(this);
    this.gotoFeedback = this.gotoFeedback.bind(this);
    this.gotoReports = this.gotoReports.bind(this);
    this.paymentSuccess = this.paymentSuccess.bind(this);
    this.loadingManipulate = this.loadingManipulate.bind(this);
    this.gotoTrackerNav = this.gotoTrackerNav.bind(this);
    this.getTipCount = this.getTipCount.bind(this);
    this.clearCard = this.clearCard.bind(this);
    this.clearCard1 = this.clearCard1.bind(this);
    this.guid = this.guid.bind(this);
    this.paymentCheck = this.paymentCheck.bind(this);
    this.goToTrackerDetails = this.goToTrackerDetails.bind(this);
    this.onClose = this.onClose.bind(this);
    this.onOpen = this.onOpen.bind(this);
    this.onClosingState = this.onClosingState.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.renderClose = this.renderClose.bind(this);
    this.gotoReportNotification = this.gotoReportNotification.bind(this);
    this.gotoPlayStore = this.gotoPlayStore.bind(this);
    this.getRoute = this.getRoute.bind(this);
    this.goToSurveyScreens = this.goToSurveyScreens.bind(this);
    this.setSwipe = this.setSwipe.bind(this);
    this.getSwipe = this.getSwipe.bind(this);
    this.setScroll = this.setScroll.bind(this);
    this.gotoGeoLocation = _.debounce(this.gotoGeoLocation.bind(this), 200);
    this.requestLocationPermission = this.requestLocationPermission.bind(this);
    this.gotoUpcomingOrder = this.gotoUpcomingOrder.bind(this);
    // this.getTrackerArray = this.getTrackerArray.bind(this)
    this.OnDirectionPressed = this.OnDirectionPressed.bind(this);
    this.gotoPendingUpcomingOrder = this.gotoPendingUpcomingOrder.bind(this);
    this.openRazorPay = this.openRazorPay.bind(this);
    this.getOrderId = this.getOrderId.bind(this);
    this.parsePinnedTrackers = this.parsePinnedTrackers.bind(this);
    this.callNotification = this.callNotification.bind(this);
    this.closeNotification = this.closeNotification.bind(this);
    this.onNotificationOpenedForeground = this.onNotificationOpenedForeground.bind(
      this,
    );
    this.getDemographics = this.getDemographics.bind(this);
    this.renderInsuranceModal = this.renderInsuranceModal.bind(this);
    this.setInsuranceName = this.setInsuranceName.bind(this);
    this.saveTrackerData = this.saveTrackerData.bind(this);
    this.gotoProfile = this.gotoProfile.bind(this);
    this.convertUnicode = this.convertUnicode.bind(this);
  }

  setInsuranceName(name) {
    args_bundle['hasInsurance'] = 1;
    args_bundle['insuranceName'] = name;
    args_bundle['hasInsurance_date'] = currentTime;

    UserDefaults.set(stringsUserDefaults.hasInsurance_date, currentTime);
    UserDefaults.set(stringsUserDefaults.hasInsurance, 1);
    UserDefaults.set(stringsUserDefaults.insuranceName, name);

    {
      UserDefaults.get(stringsUserDefaults.userToken)
        .then(async (token) => {
          let params =
            'token=' +
            (token || '') +
            '&args=' +
            (JSON.stringify(args_bundle) || '');
 
          NetworkRequest(
            this,
            'POST',
            URLs.savePatientDemographicDetails,
            params,
          )
            .then((result) => {
              
              if (result.success) {
                if ((result.response.code || 0) === 200) {
                  cnt = this.state.demographyCount;
                  cnt++;
                  this.setState({processing: 0, demographyCount: cnt});

                  args_bundle = {};

                  console.log('DEMO COUNT: ', this.state.demographyCount);
                } else if ((result.response.code || 0) === 500) {
                  console.log('FAILURE');

                  Alert.alert('Failed', 'Please try again', [
                    {text: 'OK', onPress: () => {}},
                  ]);
                } else {
                  console.log('Error1');
                }
              }

             })
            .catch((error) => {
              console.error(error);
            });
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }
  getLabDetails = (params) => {
    NetworkRequest(this, 'POST', URLs.getLabDetails, params)
      .then((result) => {
        if(result && result.response)
        {
        this.setState({lab:result.response.labObj})
        }
      })
      .catch((err) => {});
  };
  _onRefresh() {
    this.setState({refreshing: true, demographyCount: 2});
    this.getData().then(() => {
      this.setState({refreshing: false});
    });
  }

  // onNotificationReceivedForeground(notification) {
  //   console.log("Notification Received - Foreground", notification);
  // }

  onNotificationReceivedBackground(notification) {
    //	console.log("Notification Received - Background", notification);
  }

  // onNotificationOpened(notification) {
  // 	console.log("Notification opened by device user", notification);
  // }

  _handleAppStateChange = (nextAppState) => {
    if (this.state.appState.match('active') && nextAppState === 'background') {
      console.log('App has come to the background!');
      UserDefaults.set(stringsUserDefaults.first_entry, 0);
      UserDefaults.set(stringsUserDefaults.city_list, []);
    }
    if (this.state.appState.match('background') && nextAppState === 'active') {
      console.log('App has come to foreground');
      try {
        if (Global.iOSPlatform) {
          // PushNotificationIOS.setApplicationIconBadgeNumber(0);
        }
      } catch (error) {
        console.log(error);
      }
    }
    this.setState({appState: nextAppState});
  };

  componentWillUnmount() {
    // Don't forget to remove the event listeners to prevent memory leaks!
    try {
      AppState.removeEventListener('change', this._handleAppStateChange);
    } catch (error) {
      console.error(error);
    }

    try {
      if (Global.iOSPlatform) {
        // NotificationsIOS.removeEventListener(
        //   "notificationReceivedForeground",
        //   this.onNotificationReceivedForeground.bind(this)
        // );
        // NotificationsIOS.removeEventListener(
        //   "notificationReceivedBackground",
        //   this.onNotificationReceivedBackground.bind(this)
        // );
        // NotificationsIOS.removeEventListener(
        //   "notificationOpened",
        //   this.onNotificationOpened.bind(this)
        // );
      }
    } catch (error) {
      console.error(error);
    }

    try {
      Geolocation.clearWatch(this.watchId);
    } catch (error) {
      console.error(error);
    }
  }

  componentWillReceiveProps(nextProps) {
    if (Global.iOSPlatform && nextProps.noti.text) {
      notification = nextProps.noti.text;
      this.onNotificationOpened(notification);
    }

    UserDefaults.get(stringsUserDefaults.pinnedTracker)
      .then((pinnedTracker) => {
        if (pinnedTracker) {
          UserDefaults.set(stringsUserDefaults.pinnedTracker, false);
          var pinnedTrackers = this.props.pinnedTrackers.pinnedTrackers;
          this.setState({
            pinnedTrackers: pinnedTrackers,
          });
          var dictionaryArray = [];
          pinnedTrackers.forEach((val) => {
            dictionaryArray.push(val.dictionaryId);
          });
          UserDefaults.set(stringsUserDefaults.dictionaryArray, []);
          UserDefaults.set(
            stringsUserDefaults.dictionaryArray,
            dictionaryArray,
          );
          // this.getData()
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }

  renderInsuranceModal() {
    this.setState({
      upcomingOrderModal: false,
      isOpen: true,
      feedbackModal: false,
      reportModal: false,
      reportViewModal: false,
      trackerModal: false,
      insuranceModal: true,
    });
  }

  componentWillUpdate() {
    UserDefaults.get(stringsUserDefaults.notificationFlag)
      .then((notificationFlag) => {
        if (notificationFlag) {
          UserDefaults.get(stringsUserDefaults.notificationJson)
            .then((notificationJson) => {
              if (notificationJson) {
                UserDefaults.set(stringsUserDefaults.notificationFlag, false);
                UserDefaults.set(stringsUserDefaults.notificationJson, {});
                if (
                  notificationJson.category ===
                  stringsNotifications.GCMCAT_NEW_REPORT
                ) {
                  this.gotoReportNotification();
                } else if (
                  notificationJson.category ===
                  stringsNotifications.GCMCAT_APP_UPDATE
                ) {
                  this.gotoPlayStore();
                } else if (
                  notificationJson.category ===
                  stringsNotifications.GCMCAT_ALL_APPOINTMENTS
                ) {
                  this.gotoUpcomingOrder(false);
                } else if (
                  notificationJson.category ===
                  stringsNotifications.GCMCAT_ALL_HOMECOLLECTION
                ) {
                  this.gotoUpcomingOrder(true);
                } else if (
                  notificationJson.category ===
                  stringsNotifications.GCMCAT_ALL_PHLEBO
                ) {
                  this.gotoFeedback();
                }
              }
            })
            .catch((error) => {
              console.error(error);
            });
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }

  componentDidMount() {
    user = '';
    demographics = '';

    UserDefaults.get(stringsUserDefaults.user).then((user) => {
      if (user) {
        if (user.user.email) {
          email = 1;
        }
        if (user.fullName) {
          fullName = 1;
        }
        if (user.profilepic) {
          profilePic = 1;
        }
        if (user.dateOfBirth) {
          dateOfBirth = 1;
        }
        if (user.sex) {
          sex = 1;
        }
      }
    });

    UserDefaults.get(stringsUserDefaults.demographics).then((demographics) => {
      if (demographics) {
        if (demographics._source) {
          if (
            demographics._source.industryType &&
            demographics._source.occupation
          ) {
            industryType = 1;
            occupation = 1;
          }

          if (
            demographics._source.isDiabetic === 0 ||
            demographics._source.isDiabetic === 1
          ) {
            isDiabetic = 1;
          }
          if (
            demographics._source.isChronic === 0 ||
            demographics._source.isChronic === 1
          ) {
            isChronic = 1;
          }
          if (demographics._source.isSmoker) {
            isSmoker = 1;
          }
          if (demographics._source.consumesAlcohol) {
            consumesAlcohol = 1;
          }
          if (demographics._source.bloodGroup) {
            bloodGroup = 1;
          }

          if (demographics._source.hasInsurance) {
            hasInsurance = 1;
          }

          if (demographics._source.insuranceName) {
            insuranceName = 1;
          }
        }

        UserDefaults.get(stringsUserDefaults.height).then((height) => {
          if (height > 0) {
            this.props.setDemographics({height: 1});
          }
        });

        UserDefaults.get(stringsUserDefaults.weight)
          .then((weight) => {
            if (weight > 0) {
              this.props.setDemographics({weight: 1});
            }
          })
          .catch((error) => {
            console.error(error);
          });

        UserDefaults.get(stringsUserDefaults.activenessLevel).then(
          (activenessLevel) => {
            if (activenessLevel.length > 0) {
              this.props.setDemographics({activenessLevel: 1});
            }
          },
        );

        UserDefaults.get(stringsUserDefaults.stressLevel).then(
          (stressLevel) => {
            if (stressLevel.length > 0) {
              this.props.setDemographics({stressLevel: 1});
            }
          },
        );

        this.props.setDemographics({
          industryType: industryType,
          occupation: occupation,
          isDiabetic: isDiabetic,
          isChronic: isChronic,
          isSmoker: isSmoker,
          consumesAlcohol: consumesAlcohol,
          bloodGroup: bloodGroup,
          hasInsurance: hasInsurance,
          insuranceName: insuranceName,

          email: email,
          fullName: fullName,
          profilePic: profilePic,
          dateOfBirth: dateOfBirth,
          sex: sex,
        });
      }
    });

    setTimeout(() => {
      if (
        this.props.demographics.demographics.activenessLevel &&
        this.props.demographics.demographics.bloodGroup &&
        this.props.demographics.demographics.consumesAlcohol &&
        this.props.demographics.demographics.height &&
        this.props.demographics.demographics.industryType &&
        this.props.demographics.demographics.isChronic &&
        this.props.demographics.demographics.isDiabetic &&
        this.props.demographics.demographics.isSmoker &&
        this.props.demographics.demographics.occupation &&
        this.props.demographics.demographics.hasInsurance &&
        // this.props.demographics.demographics.insuranceName &&
        this.props.demographics.demographics.stressLevel &&
        this.props.demographics.demographics.height &&
        this.props.demographics.demographics.weight &&
        this.props.demographics.demographics.email &&
        this.props.demographics.demographics.fullName &&
        this.props.demographics.demographics.profilePic &&
        this.props.demographics.demographics.dateOfBirth &&
        this.props.demographics.demographics.sex
      ) {
        this.props.setDemographics({show: 1});
      } else {
        this.props.setDemographics({show: 0});
      }
    }, 500);

    try {
      AppState.addEventListener('change', this._handleAppStateChange);
      try {
        UserDefaults.get(stringsUserDefaults.first_entry)
          .then((first_entry) => {
            if (first_entry === 0) {
              UserDefaults.set(stringsUserDefaults.city_list, []);
            }
            first_entry += 1;
            UserDefaults.set(stringsUserDefaults.first_entry, first_entry);
          })
          .catch((error) => {
            console.error(error);
          });
      } catch (error) {
        console.error(error);
      }

      if (!Global.iOSPlatform) {
        // PendingNotifications.getInitialNotification()
        //   .then(notification => {
        //     if (
        //       notification.data.category ===
        //       stringsNotifications.GCMCAT_NEW_REPORT
        //     ) {
        //       this.gotoReports(true, notification.data.referenceId);
        //     } else if (
        //       notification.data.category ===
        //       stringsNotifications.GCMCAT_APP_UPDATE
        //     ) {
        //       this.gotoPlayStore();
        //     } else if (
        //       notification.data.category ===
        //       stringsNotifications.GCMCAT_ALL_APPOINTMENTS
        //     ) {
        //       this.gotoUpcomingOrder(false);
        //     } else if (
        //       notification.data.category ===
        //       stringsNotifications.GCMCAT_ALL_HOMECOLLECTION
        //     ) {
        //       this.gotoUpcomingOrder(true);
        //     } else if (
        //       notification.data.category ===
        //       stringsNotifications.GCMCAT_ALL_PHLEBO
        //     ) {
        //       this.gotoFeedback(
        //         notification.data.collectingPersonId,
        //         notification.data.homecollectionId
        //       );
        //     }
        //     console.log("getInitialNotification:", notification);
        //   })
        //   .catch(err => console.log("getInitialNotifiation failed", err));
      } else {
        // PushNotificationIOS.getInitialNotification()
        //   .then(notification => {
        //     if (
        //       notification._data.category ===
        //       stringsNotifications.GCMCAT_NEW_REPORT
        //     ) {
        //       this.gotoReports(true, notification._data.referenceId);
        //     } else if (
        //       notification._data.category ===
        //       stringsNotifications.GCMCAT_APP_UPDATE
        //     ) {
        //       this.gotoPlayStore();
        //     } else if (
        //       notification._data.category ===
        //       stringsNotifications.GCMCAT_ALL_APPOINTMENTS
        //     ) {
        //       this.gotoUpcomingOrder(false);
        //     } else if (
        //       notification._data.category ===
        //       stringsNotifications.GCMCAT_ALL_HOMECOLLECTION
        //     ) {
        //       this.gotoUpcomingOrder(true);
        //     } else if (
        //       notification._data.category ===
        //       stringsNotifications.GCMCAT_ALL_PHLEBO
        //     ) {
        //       this.gotoFeedback(
        //         notification._data.collectingPersonId,
        //         notification._data.homecollectionId
        //       );
        //     }
        //     console.log("getInitialNotification:", notification);
        //   })
        //   .catch(err => console.log("getInitialNotifiation failed", err));
      }
    } catch (error) {
      console.error(error);
    }

    NetInfo.isConnected.fetch().then((isConnected) => {
      isConnected
        ? this.setState({
            isConnection: true,
            isLoading: true,
            isInitialLoading: true,
          })
        : this.setState({isConnection: false});
    });

    if (this.state.isConnection) {
      // this.loadingManipulate(true)
      try {
        var uuid = this.guid();
        this.setState({
          uuid: uuid,
        });
      } catch (error) {
        console.error(error);
      }
    } else {
      this.animate();
      this.loadingManipulate(false, 1);
      try {
        var uuid = this.guid();
        this.setState({
          uuid: uuid,
        });
      } catch (error) {
        console.error(error);
      }
    }

    setTimeout(() => {
      this.getData();
    }, 200);
  }

  animate() {
    this.animatedValue.setValue(-1000);
    Animated.spring(this.animatedValue, {
      toValue: 1,
      speed: 8,
      bounciness: -10,
      velocity: 10,
    }).start();
  }

  spring1() {
    this.springValue.setValue(0.99);
    //this.setState({springVal:0.97})
    Animated.spring(this.state.springVal, {
      toValue: 0.97,
      //  springVal:0.97
    }).start();
  }

  spring2() {
    this.springValue.setValue(0.97);
    //this.setState({springVal: 0.99})
    Animated.spring(this.state.springVal, {
      toValue: 1,
      //springVal:1
    }).start();
  }

  getDemographics(data) {
    this.setState({processing: 1});

    time = moment().format();
    currentTime = String(
      moment(time).utc().format(Global.LTHDateFormatMoment) + 'Z',
    );

    switch (this.state.demographyCount) {
      case 1:
        args_bundle['frequencyOfHealthCheckup'] = data;
        args_bundle['frequencyOfHealthCheckup_date'] = currentTime;

        UserDefaults.set(
          stringsUserDefaults.frequencyOfHealthCheckup_date,
          currentTime,
        );

        break;

      case 2:
        //args_bundle['activenessLevel'] = data
        this.saveTrackerData(
          stringDictId.activenessLevel,
          'activenessLevel',
          data,
        );
        break;

      case 3:
        //  args_bundle['stressLevel'] = data
        this.saveTrackerData(stringDictId.stressLevel, 'stressLevel', data);
        break;

      case 4:
        if (data != 0) {
          this.renderInsuranceModal();
        } else {
          args_bundle['hasInsurance'] = data;

          args_bundle['hasInsurance_date'] = currentTime;

          UserDefaults.set(stringsUserDefaults.hasInsurance_date, currentTime);
          UserDefaults.set(stringsUserDefaults.hasInsurance, data);
        }
        break;

      case 5:
        args_bundle['onMedications'] = data;
        args_bundle['onMedications_date'] = currentTime;
        UserDefaults.set(stringsUserDefaults.onMedications_date, currentTime);
        break;
    }

    if (
      this.state.demographyCount == 1 ||
      (this.state.demographyCount == 4 && data == 0) ||
      this.state.demographyCount == 5
    ) {
      UserDefaults.get(stringsUserDefaults.userToken)
        .then((token) => {
          let params =
            'token=' +
            (token || '') +
            '&args=' +
            (JSON.stringify(args_bundle) || '');

          NetworkRequest(
            this,
            'POST',
            URLs.savePatientDemographicDetails,
            params,
          )
            .then((result) => {
              if (result.success) {
                if ((result.response.code || 0) === 200) {
                  cnt = this.state.demographyCount;
                  cnt++;
                  this.setState({processing: 0, demographyCount: cnt});
                  args_bundle = {};
                  console.log('DEMO COUNT: ', this.state.demographyCount);
                } else if ((result.response.code || 0) === 500) {
                  console.log('FAILURE');

                  Alert.alert('Failed', 'Please try again', [
                    {text: 'OK', onPress: () => {}},
                  ]);
                } else {
                  // this.loadingManipulate(false)
                  console.log('Error1');
                }
              }
            })
            .catch((error) => {
              //console.log('Error2')
              //   this.setState({ isLoading:false})
              console.error(error);
            });
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }

  saveTrackerData(dictId, label, data) {
    this.setState({processing: 1});

    time = moment().format();
    currentTime = String(
      moment(time).utc().format(Global.LTHDateFormatMoment) + 'Z',
    );

    UserDefaults.get(stringsUserDefaults.userToken)
      .then((token) => {
        var params =
          'token=' +
          token +
          '&dictionaryId=' +
          dictId +
          '&label=' +
          label +
          '&reportDate=' +
          currentTime +
          '&value=' +
          data +
          '&unit=' +
          '-';

        NetworkRequest(this, 'POST', URLs.saveTrackerData, params)
          .then((result) => {
            if (result.success) {
              if ((result.response.code || 0) === 200) {
                cnt = this.state.demographyCount;
                cnt++;

                this.setState({processing: 0, demographyCount: cnt});

                //Save in async
                if (dictId == stringDictId.activenessLevel) {
                  UserDefaults.get(stringsUserDefaults.activenessLevel).then(
                    (activenessLevel) => {
                      arr = activenessLevel ? activenessLevel : [];
                      obj = {reportDate: currentTime, value: data};

                      arr.splice(0, 0, obj);

                      UserDefaults.set(
                        stringsUserDefaults.activenessLevel,
                        arr || '',
                      );
                    },
                  );
                } else if (dictId == stringDictId.stressLevel) {
                  UserDefaults.get(stringsUserDefaults.stressLevel).then(
                    (stressLevel) => {
                      arr = stressLevel ? stressLevel : [];
                      obj = {reportDate: currentTime, value: data};

                      arr.splice(0, 0, obj);

                      UserDefaults.set(
                        stringsUserDefaults.stressLevel,
                        arr || '',
                      );
                    },
                  );
                }

                console.log('Tracker Data saved');
              } else {
                this.loadingManipulate(false);
              }
            } else {
              this.loadingManipulate(false);
            }
          })
          .catch((error) => {
            this.loadingManipulate(false);
            console.error(error);
          });
      })
      .catch((error) => {
        this.loadingManipulate(false);
        console.error(error);
      });
  }

  callNotification(header, subText) {
    this.setState({
      notificationHeader: header,
      notificationSubText: subText,
    });

    Animated.timing(this.animatedValueNotification, {
      toValue: 0,
      duration: 350,
    }).start(this.closeNotification());
  }

  closeNotification() {
    setTimeout(() => {
      Animated.timing(this.animatedValueNotification, {
        toValue: -70,
        duration: 350,
      }).start();
    }, 2000);

    setTimeout(() => {
      this.setState({showNotification: false});
    }, 2500);
  }

  gotoProfile() {
    this.props.navigation.navigate(Routes.profileNav, {}, {});
  }

  gotoUpcomingOrder(homecollectionFlag) {
    this.setState({
      upcomingOrderModal: true,
      isOpen: true,
      isHomeCollectionType: homecollectionFlag,
      feedbackModal: false,
      reportModal: false,
      reportViewModal: false,
      trackerModal: false,
      insuranceModal: false,
    });
  }

  goToSurveyScreens() {
    this.props.navigation.navigate(Routes.surveyScreen1, {});
  }

  gotoPlayStore() {
    AppLink.openInStore(this.state.appStoreId, this.state.playStoreId)
      .then(() => {
        // do stuff
      })
      .catch((err) => {
        // handle error
        console.log(err);
      });
  }

  gotoReportNotification() {
    setTimeout(() => {
      this.props.navigation.navigate(Routes.reportNav, {});
    }, 50);
  }

  loadingManipulate(flag, isInitFlag) {
    if (isInitFlag === 1) {
      this.setState({
        isLoading: flag,
        isInitialLoading: flag,
      });
    } else {
      this.setState({
        isLoading: flag,
      });
    }
  }

  gotoReports(fromNotificationFlag, reportId) {
    try {
      if (fromNotificationFlag) {
        this.setState({
          reportId: reportId,
          selectedItemModal: undefined,
          selectedSectionArray: [],
          userName: '',
          isOpen: true,
          feedbackModal: false,
          reportModal: false,
          reportViewModal: true,
          trackerModal: false,
          upcomingOrderModal: false,
          insuranceModal: false,
        });
      } else {
        ReportManager.renderReportList(this.state.unreadReports, [], false)
          .then((response) => {
            var response = response;
            var sectionArray =
              response.response.allReportSortedCatMap[
                Object.keys(response.response.allReportSortedCatMap)[0]
              ][
                Object.keys(
                  response.response.allReportSortedCatMap[
                    Object.keys(response.response.allReportSortedCatMap)[0]
                  ],
                )[0]
              ];
            var selectedItem = sectionArray[0];
            var username = Object.keys(
              response.response.allReportSortedCatMap,
            )[0].split('$--$')[0];

            this.setState({
              selectedItemModal: selectedItem,
              selectedSectionArray: sectionArray,
              userName: username,
              isOpen: true,
              feedbackModal: false,
              reportModal: false,
              reportViewModal: true,
              trackerModal: false,
              upcomingOrderModal: false,
              insuranceModal: false,
            });
          })
          .catch((error) => {
            setTimeout(() => {
              this.props.navigation.navigate(Routes.reportNav, {});
            }, 50);
            console.error(error);
          });
      }
    } catch (error) {
      console.error(error);
    }
  }

  gotoTrackerNav() {
    this.props.navigation.navigate(Routes.trackerCategoryScreen, {});
  }

  async requestLocationPermission() {
    try {
      if (Global.iOSPlatform) {
        this.gotoGeoLocation();
      } else {
        if (Global.osVersion) {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          )
            .then((granted) => {
              if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                this.gotoGeoLocation();
              } else {
                console.log('Location permission denied');
              }
            })
            .catch((error) => {
              console.error(error);
            });
        } else {
          this.gotoGeoLocation();
        }
      }
    } catch (err) {
      console.warn(err);
    }
  }

  gotoGeoLocation() {
    if (Global.iOSPlatform) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          this.props.navigation.navigate(Routes.mapScreen, {});
        },
        (error) => {
          // Works on both iOS and Android
          Alert.alert(
            'Location Services',
            'Your Location services are turned off, You need to enable it in order to access this feature',
            [
              {text: 'Cancel', onPress: () => console.log('Cancel Pressed')},
              {
                text: 'Settings',
                onPress: () => {
                  Linking.openURL('app-settings:');
                },
              },
            ],
            {cancelable: false},
          );
        },
        {enableHighAccuracy: false, timeout: 20000, maximumAge: 1000},
      );
    } else {
      var _this = this;
      var isLocationEnabled = false;
      LocationServicesDialogBox.checkLocationServicesIsEnabled({
        message:
          "<h2>Use Location ?</h2>This app wants to change your device settings:<br/><br/>Use GPS, Wi-Fi, and cell network for location<br/><br/><a href='#'>Learn more</a>",
        ok: 'YES',
        cancel: 'NO',
        enableHighAccuracy: true, // true => GPS AND NETWORK PROVIDER, false => ONLY GPS PROVIDER
        showDialog: true, // false => Opens the Location access page directly
      })
        .then((success) => {
          if (success.enabled || success.alreadyEnabled) {
            setTimeout(() => {
              _this.props.navigation.navigate(Routes.mapScreen, {});
            }, 100);
          }
          console.log(success); // success => {alreadyEnabled: false, enabled: true, status: "enabled"}
        })
        .catch((error) => {
          console.log(error.message); // error.message => "disabled"
        });
    }
  }

  goToTrackerDetails(dictionaryId) {
    this.setState({
      isOpen: true,
      dictionaryId: dictionaryId,
      feedbackModal: false,
      reportModal: false,
      reportViewModal: false,
      trackerModal: true,
      upcomingOrderModal: false,
      insuranceModal: false,
    });
  }

  getPinnedArrayList() {
    this.props.getList();
  }

  clearCard() {
    this.setState({
      isFeedbackFlag: false,
    });
  }

  clearCard1() {
    this.setState({
      takePhlebotomistReview: false,
    });
  }

  async getData() {
    let temp = 0;

    time = moment().format();
    currentTime = String(
      moment(time).utc().format(Global.LTHDateFormatMoment) + 'Z',
    );

    UserDefaults.get(stringsUserDefaults.onMedications_date).then((date) => {
      if (date) {
        if (moment(currentTime).diff(date, 'months') >= 1) {
          temp = 1;
          this.setState({demographyCount: 5});
        }
      } else {
        temp = 1;
        this.setState({demographyCount: 5});
      }
    });

    UserDefaults.get(stringsUserDefaults.hasInsurance_date).then((date) => {
      if (date) {
        if (moment(currentTime).diff(date, 'months') >= 1) {
          temp = 1;
          this.setState({demographyCount: 4});
        }
      } else {
        temp = 1;
        this.setState({demographyCount: 4});
      }
    });

    UserDefaults.get(stringsUserDefaults.stressLevel).then((stressLevel) => {
      if (stressLevel) {
        if (stressLevel.length > 0) {
          if (
            moment(currentTime).diff(stressLevel[0].reportDate, 'months') >= 1
          ) {
            temp = 1;
            this.setState({demographyCount: 3});
          }
        } else {
          temp = 1;
          this.setState({demographyCount: 3});
        }
      }
    });

    UserDefaults.get(stringsUserDefaults.activenessLevel).then(
      (activenessLevel) => {
        if (activenessLevel) {
          if (activenessLevel.length > 0) {
            if (
              moment(currentTime).diff(
                activenessLevel[0].reportDate,
                'months',
              ) >= 1
            ) {
              temp = 1;
              this.setState({demographyCount: 2});
            }
          } else {
            temp = 1;
            this.setState({demographyCount: 2});
          }
        }
      },
    );

    UserDefaults.get(stringsUserDefaults.frequencyOfHealthCheckup_date).then(
      (date) => {
        if (date) {
          if (moment(currentTime).diff(date, 'months') >= 1) {
            temp = 1;
            this.setState({demographyCount: 1});
          }
        } else {
          temp = 1;
          this.setState({demographyCount: 1});
        }
      },
    );

    if (temp === 0) {
      this.setState({
        demographyCount: 6,
      });
    }

    if (temp === 1) {
      this.setState({
        demographyCount: 1,
      });
    }

    try {
      UserDefaults.get(stringsUserDefaults.user)
        .then((user) => {
          if (user) {
            this.setState({
              processing: 0,
              user: user || '',
              user_id: user.user.id || 0,
              userDetailsId_id: user.id || 0,
              email: user.user.email || '',
              contact: user.contact || '',
            });
          }
        })
        .catch((error) => {
          console.error(error);
        });

      this.getTipCount();

      UserDefaults.get(stringsUserDefaults.userToken)
        .then((token) => {
          let params = 'token=' + token || '';
          var _this = this;
            this.getLabDetails('userToken=' + token);

          NetworkRequest(_this, 'POST', URLs.dashboardLoadingURL, params)
            .then((result) => {
              if (result.success) {
                this.animate();
                if ((result.response.code || 0) === 200) {
                  if (result.response.currency) {
                    this.props.setCurrency(
                      this.convertUnicode(result.response.currency),
                    );
                  }
                  if (result.response.isShowBooking) {
                    this.setState({
                      isShowBooking: result.response.isShowBooking,
                    });
                  }

                  if (result.response.pendingReports) {
                    this.afterResponsePending(result.response.pendingReports);
                  }
                  if (result.response.unreadReports) {
                    if (result.response.unreadReports.length > 0) {
                      // this.props.dispatch(setUnreadFlag(1))
                      this.props.setUnreadFlag(
                        result.response.unreadReports.length,
                      );

                      var labName = '';
                      try {
                        labName =
                          result.response.unreadReports[0].labForId.labName;
                      } catch (error) {
                        console.error(error);
                      }
                      this.setState({
                        isUnreadReportFlag: true,
                        unreadLab: labName,
                        unreadReports: result.response.unreadReports,
                      });
                    } else {
                      this.setState({
                        isUnreadReportFlag: false,
                      });
                    }
                  }

                  if (result.response.labName) {
                    try {
                      var labName = '';
                      try {
                        labName = result.response.labName;
                      } catch (error) {
                        console.error(error);
                      }

                      Intercom.updateUser({
                        recently_visited_lab: labName,
                      });
                    } catch (error) {
                      console.log(error);
                    }
                  }

                  if (result.response.getFeedbackData) {
                    if (result.response.getFeedbackData.length > 0) {
                      this.checkFeedBack(
                        result.response.getFeedbackData[0],
                        token,
                      );
                    }
                  }

                  if (result.response.upcomingAppointments) {
                    this.setState({
                      upcomingAppointments:
                        result.response.upcomingAppointments,
                    });

                    // }
                  }

                  if (result.response.upcomingHomeCollection) {
                    this.setState({
                      upcomingHomeCollection:
                        result.response.upcomingHomeCollection,
                    });
                  }

                  setTimeout(() => {
                    if (this.state.isLoading) {
                      this.loadingManipulate(false, 1);
                    }
                  }, 50);

                  if (result.response.phlebotomistReview) {
                    if (
                      result.response.phlebotomistReview.takePhlebotomistReview
                    ) {
                      this.getPhleboReview(result.response.phlebotomistReview);
                    }
                  }

                  if (result.response.favoriteTrackers) {
                    var favoriteTrackers = result.response.favoriteTrackers;
                    if (favoriteTrackers.group) {
                      if (favoriteTrackers.group.buckets) {
                        if (favoriteTrackers.group.buckets.length > 0) {
                          this.parsePinnedTrackers(
                            favoriteTrackers.group.buckets,
                          );
                        } else {
                          this.setState({
                            pinnedTrackers: [],
                          });
                        }
                      }
                    }
                  }
                } else if ((result.response.code || 0) === 500) {
                  this.loadingManipulate(false, 1);
                } else {
                  this.loadingManipulate(false, 1);
                }
              } else {
                this.loadingManipulate(false, 1);
              }
            })
            .catch((error) => {
              this.loadingManipulate(false, 1);
              console.error(error);
            });
        })
        .catch((error) => {
          this.loadingManipulate(false, 1);
          console.error(error);
        });
    } catch (error) {
      if (this.state.isLoading) {
        this.loadingManipulate(false, 1);
      }
      console.error(error);
    }
  }

  parsePinnedTrackers(buckets: Array) {
    var pinnedTrackers = [];
    var dictionaryArray = [];
    buckets.forEach((valInData) => {
      try {
        var _source = valInData.group_docs.hits.hits[0]._source;
        pinnedTrackers.push({
          highlightedValue: String(_source.value),
          highlightedUnit: _source.unit,
          highlightedDate: _source.reportDate,
          currentParameter: _source.dictionaryName,
          icon: _source.categoryIcon,
          dictionaryId: _source.dictionaryId,
        });
        dictionaryArray.push(_source.dictionaryId);
      } catch (error) {
        console.error(error);
      }
    });

    UserDefaults.set(stringsUserDefaults.dictionaryArray, []);
    UserDefaults.set(stringsUserDefaults.dictionaryArray, dictionaryArray);
    UserDefaults.set(stringsUserDefaults.pinnedTracker, true);
    this.props.setList(pinnedTrackers);

    this.setState({
      pinnedTrackers: pinnedTrackers,
    });
  }

  getPhleboReview(phlebotomistReview) {
    this.setState({
      collectingPersonId: phlebotomistReview.collectingPersonId,
      takePhlebotomistReview: phlebotomistReview.takePhlebotomistReview,
      homeCollectionId: phlebotomistReview.homeCollectionId,
      phlebotomistName: phlebotomistReview.phlebotomistName,
      labNameHC: phlebotomistReview.labNameHC,
    });
  }

  // getTrackerArray(){
  //     var pinnedTrackers = []
  //     if(this.props.pinnedTrackers.pinnedTrackers.length > 5){
  //       return (<DashboardTrackers
  //                 key={this.props.pinnedTrackers.pinnedTrackers}
  //                 trackerArray={this.props.pinnedTrackers}
  //                 goSecondaryAction={this.goToTrackerDetails}
  //                 goAction={this.gotoTrackerNav}/>)
  //     } else {
  //       UserDefaults.get(stringsUserDefaults.pinnedTracker).then((pinnedTracker) => {
  //         if(pinnedTracker){
  //           this.setState({
  //             pinnedTrackers: pinnedTracker
  //           })
  //           return (<DashboardTrackers
  //                     key={this.state.pinnedTrackers}
  //                     trackerArray={this.state.pinnedTrackers}
  //                     goSecondaryAction={this.goToTrackerDetails}
  //                     goAction={this.gotoTrackerNav}/>)
  //         } else {
  //           return (null)
  //         }
  //       }).catch((error) => {
  //         console.error(error);
  //         return (null)
  //       })
  //    }
  // }

  getTipCount() {
    UserDefaults.get(stringsUserDefaults.tipCount)
      .then((tipCount) => {
        if (tipCount) {
          this.setState({
            tipCount: tipCount || 1,
          });
          tipCount += 1;
          if (tipCount === 5) {
            UserDefaults.set(stringsUserDefaults.tipCount, 1);
          } else {
            UserDefaults.set(stringsUserDefaults.tipCount, tipCount++);
          }
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }

  getTipCount1() {
    var tipCount = this.state.tipCount;
    tipCount += 1;
    this.setState({
      tipCount: tipCount || 1,
    });
    if (tipCount === 5) {
      UserDefaults.set(stringsUserDefaults.tipCount, 1);
    } else {
      UserDefaults.set(stringsUserDefaults.tipCount, tipCount++);
    }
  }

  async checkFeedBack(feedbackData, token) {
    try {
      var labId = feedbackData.labId;
      var labName = feedbackData.labName;
      var billId = feedbackData.billId;

      let params =
        'userToken=' +
        (token || '') +
        '&labId=' +
        (labId || '') +
        '&billId=' +
        (billId || '');

      var _this = this;
      NetworkRequest(_this, 'POST', URLs.checkFeedbackURL, params)
        .then((result) => {
          if (result.success) {
            if ((result.response.code || 0) === 200) {
              this.setState({
                isFeedbackFlag: true,
                labId: labId,
                labName: labName,
                billId: billId,
              });
            } else if ((result.response.code || 0) === 302) {
            } else {
            }
          }
        })
        .catch((error) => {
          console.error(error);
        });
    } catch (error) {
      console.error(error);
    }
  }

  async afterResponsePending(pendingReports) {
    var response = {};
    ReportManager.renderReportList(pendingReports, [], true)
      .then((response) => {
        var response = response;
        this.setPendingReports(response);
      })
      .catch((error) => {
        console.error(error);
      });
  }

  async setPendingReports(response) {
    var pendingReports = [];
    var pendingMap = {};
    pendingMap = response.response.allReportSortedCatMap;
    for (keys in pendingMap) {
      for (inner_key in pendingMap[keys]) {
        var billMap = {};
        for (i = 0; i < pendingMap[keys][inner_key].length; i++) {
          if (!(pendingMap[keys][inner_key][i].billId.id in billMap)) {
            var pendingArray = [];
            pendingArray.push(pendingMap[keys][inner_key][i]);
            billMap[pendingMap[keys][inner_key][i].billId.id] = {
              pendingReports: pendingArray,
              inner_key: inner_key,
            };
            // {
            //                                                       pendingReports : pendingArray,
            //                                                       reportStatus: maxVal,
            //                                                       labName : labName,
            //                                                       labId: labId,
            //                                                       reportDate : reportDate,
            //                                                       amount : amount,
            //                                                       billId : billId
            //                                                     };
          } else {
            billMap[
              pendingMap[keys][inner_key][i].billId.id
            ].pendingReports.push(pendingMap[keys][inner_key][i]);
          }
        }

        for (key_bill in billMap) {
          var maxVal = 0;
          var reportDate = '';
          var labName = '';
          var labId = 0;
          var amount = 0;
          var billId = 0;

          for (i = 0; i < billMap[key_bill].pendingReports.length; i++) {
            if (maxVal < billMap[key_bill].pendingReports[i].reportStatus) {
              maxVal = billMap[key_bill].pendingReports[i].reportStatus;
            }
            try {
              if (reportDate === '' || labId === 0 || amount === 0) {
                var innerArray = billMap[key_bill].inner_key.split('$--$');
                reportDate = innerArray[0];
                labName = innerArray[1];
                if (billMap[key_bill].pendingReports[i].labForId) {
                  labId = billMap[key_bill].pendingReports[i].labForId.labId;
                }

                if (billMap[key_bill].pendingReports[i].billId) {
                  amount =
                    billMap[key_bill].pendingReports[i].billId.billTotalAmount -
                    billMap[key_bill].pendingReports[i].billId.billAdvance;
                  billId = billMap[key_bill].pendingReports[i].billId.id;
                }
              }
            } catch (error) {
              console.error(error);
            }
          }

          pendingReports.push({
            pendingReports: billMap[key_bill].pendingReports,
            reportStatus: maxVal,
            labName: labName,
            labId: labId,
            reportDate: reportDate,
            amount: amount,
            billId: billId,
          });
        }
      }
    }

    pendingReports
      .sort((a, b) => {
        return new Date(a.reportDate) - new Date(b.reportDate);
      })
      .reverse();

    if (pendingReports.length > 0) {
      this.setState({
        pendingReports: pendingReports,
        isPendingFlag: true,
        isLoading: false,
        isInitialLoading: false,
      });
    } else {
      this.setState({
        isPendingFlag: false,
        isLoading: false,
        isInitialLoading: false,
      });
    }
  }

  guid() {
    function s4() {
      return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
    }
    return (
      s4() +
      s4() +
      '-' +
      s4() +
      '-' +
      s4() +
      '-' +
      s4() +
      '-' +
      s4() +
      s4() +
      s4()
    );
  }

  async paymentCheck(isComplete, isFailed, amount, labId, labName) {
    var timeStamp = moment().format(Global.LTHDateFormatMoment) + 'Z';
    UserDefaults.get(stringsUserDefaults.userToken)
      .then((token) => {
        let params =
          'token=' +
          (token || '') +
          '&id=' +
          (this.state.uuid || '') +
          '&user_id=' +
          (this.state.user_id || '') +
          '&userDetailsId_id=' +
          (this.state.userDetailsId_id || '') +
          '&amount=' +
          (amount || 0) +
          '&labId=' +
          (labId || 0) +
          '&labName=' +
          (labName || '') +
          '&source=' +
          (Global.iOSPlatform ? 'iOS' : 'Android') +
          '&isReport=' +
          1 +
          '&isAppointment=' +
          0 +
          '&isHomeCollection=' +
          0 +
          '&isComplete=' +
          isComplete +
          '&isFailed=' +
          isFailed +
          '&activityDate=' +
          (timeStamp || '');

        var _this = this;
        NetworkRequest(_this, 'POST', URLs.trackPayments, params)
          .then((result) => {})
          .catch((error) => {
            console.error(error);
          });
      })
      .catch((error) => {
        console.error(error);
      });
  }

  _renderPage() {
    var pendingReports = this.state.pendingReports;
    var row = [];
    var count = 0;

    pendingReports.forEach((item) => {
      var reportStatus = '';
      var reportDate = '';
      var labName = '';
      var countryCode = item.pendingReports[0].labForId.countryCode
        ? item.pendingReports[0].labForId.countryCode
        : 91;

      var percentage = 1;
      if (item.reportStatus === 5) {
        reportStatus = stringReportStatus.report_registered;
        percentage = 0.25;
      } else if (item.reportStatus === 4) {
        reportStatus = stringReportStatus.report_processing;
        percentage = 0.5;
      } else if (item.reportStatus === 3) {
        reportStatus = stringReportStatus.report_pending;
        percentage = 0.75;
      } else if (item.reportStatus === 2) {
        reportStatus = stringReportStatus.report_completed;
        percentage = 1;
      }
      row.push(
        <Animated.View
          key={count + '_pendingReport'}
          style={[
            {transform: [{scale: this.state.springVal}]},
            {
              borderRadius: 8,
              marginLeft: 17,
              marginRight: 17,
              marginTop: 8,
              marginBottom: 8,
              width: Global.screenWidth - 34,
              elevation: 6,
              backgroundColor: 'white',
            },
            CommonStyles.commonShadow,
          ]}>
          <Ripple
            rippleOpacity={0.2}
            onPressIn={this.spring1.bind(this)}
            onPressOut={this.spring2.bind(this)}
            onPress={() => {
              this.setState({
                pending_report: item,
                isOpen: true,
                feedbackModal: false,
                reportModal: true,
                reportViewModal: false,
                trackerModal: false,
                upcomingOrderModal: false,
                insuranceModal: false,
              });
            }}
            style={{flex: 1, padding: 16}}>
            <View style={{flexDirection: 'row', flex: 1}}>
              <Image
                source={Images.imageChemistry}
                style={{height: 35, width: 35}}
              />
              <Text
                style={[CommonStyles.common_header, {paddingLeft: 16}]}
                numberOfLines={1}
                ellipsizeMode={'tail'}>
                {reportStatus}
              </Text>
            </View>

            {item.amount === 0 ? (
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'center',
                  padding: 12,
                }}></View>
            ) : null}

            <View style={{alignItems: 'center'}}>
              <Text
                style={{
                  fontFamily: 'Arial',
                  paddingBottom: 4,
                  paddingTop: 8,
                  fontSize: 17,
                  color: Color._54,
                }}>
                {item.labName}
              </Text>
              <Text
                style={{
                  fontFamily: 'Arial',
                  paddingBottom: 10,
                  fontSize: 14,
                  color: Color._72,
                }}>
                {item.reportDate}
              </Text>
            </View>

            <View
              style={{
                justifyContent: 'center',
                marginLeft: 16,
                marginRight: 16,
                marginBottom: 14,
              }}>
              <View style={{flex: 1, flexDirection: 'row'}}>
                <View
                  style={{
                    backgroundColor:
                      item.reportStatus <= 5
                        ? Color.pending_selected_color
                        : Color.pending_color_neutral,
                    borderRadius: 70,
                    height: 12,
                    width: 12,
                  }}></View>
                <View style={{flex: 1, padding: 3}}></View>
                <View
                  style={{
                    backgroundColor:
                      item.reportStatus <= 4
                        ? Color.pending_selected_color
                        : Color.pending_color_neutral,
                    borderRadius: 70,
                    height: 12,
                    width: 12,
                  }}></View>
                <View style={{flex: 1, padding: 3}}></View>
                <View
                  style={{
                    backgroundColor:
                      item.reportStatus <= 3
                        ? Color.pending_selected_color
                        : Color.pending_color_neutral,
                    borderRadius: 70,
                    height: 12,
                    width: 12,
                  }}></View>
                <View style={{flex: 1, padding: 3}}></View>
                <View
                  style={{
                    backgroundColor:
                      item.reportStatus <= 2
                        ? Color.pending_selected_color
                        : Color.pending_color_neutral,
                    borderRadius: 70,
                    height: 12,
                    width: 12,
                  }}></View>
              </View>
              <View
                style={{
                  width: Global.screenWidth - 98,
                  backgroundColor: Color.pending_color_neutral,
                  padding: 1.7,
                  alignItems: 'center',
                  borderRadius: 70,
                  position: 'absolute',
                }}></View>
              <View
                style={{
                  width: (Global.screenWidth - 98) * percentage,
                  backgroundColor: Color.pending_selected_color,
                  padding: 1.7,
                  alignItems: 'center',
                  borderRadius: 70,
                  position: 'absolute',
                }}></View>
            </View>

            {item.amount !== 0 ? (
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Text
                  style={{
                    fontFamily: 'Arial',
                    color: '#FDA53F',
                    fontWeight: '500',
                  }}>
                  PAYMENT DUE
                </Text>
                <Text
                  style={{
                    fontFamily: 'Arial',
                    fontSize: 18,
                    paddingLeft: 20,
                    color: Color._36,
                  }}>
                  {this.props.currency.currency} {item.amount}
                </Text>
              </View>
            ) : (
              <View
                style={{flexDirection: 'row', justifyContent: 'center'}}></View>
            )}
          </Ripple>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'flex-end',
              flex: 1,
              paddingLeft: 16,
              paddingRight: 16,
            }}>
            <Ripple
              rippleOpacity={0.2}
              onPressIn={this.spring1.bind(this)}
              onPressOut={this.spring2.bind(this)}
              onPress={() => {
                this.setState({
                  pending_report: item,
                  isOpen: true,
                  feedbackModal: false,
                  reportModal: true,
                  reportViewModal: false,
                  trackerModal: false,
                  upcomingOrderModal: false,
                  insuranceModal: false,
                });
              }}
              style={{paddingBottom: 16, paddingLeft: 8, paddingTop: 12}}>
              <Text
                style={{
                  fontFamily: 'Arial',
                  fontWeight: '500',
                  color: Color._9F,
                  marginRight: 8,
                }}>
                VIEW ORDER
              </Text>
            </Ripple>
            <View style={{flex: 1}}></View>
            {item.amount !== 0 ? (
              <TouchableOpacity
                activeOpacity={1}
                opacityColor={'red'}
                onPress={() => {
                  this.paymentCheck(
                    0,
                    0,
                    item.amount,
                    item.labId,
                    item.labName,
                  );
                  this.setState({
                    razorpay_item: item,
                    isLoading: true,
                  });
                  setTimeout(() => {
                    this.getOrderId();
                  }, 100);
                }}>
                {countryCode == 91 ? (
                  <Text
                    style={{
                      fontFamily: 'Arial',
                      textAlign: 'right',
                      paddingRight: 8,
                      paddingBottom: 16,
                      paddingTop: 12,
                      fontWeight: '700',
                      color: Color.theme_blue,
                    }}>
                    PAY NOW
                  </Text>
                ) : null}
              </TouchableOpacity>
            ) : null}
          </View>
        </Animated.View>,
      );
      count++;
    });

    const anim = this.animatedValue.interpolate({
      inputRange: [0.5, 3],
      outputRange: [-100, 400],
    });
    return (
      <Animated.View style={{bottom: anim}}>
        <ScrollView
          pagingEnabled={true}
          horizontal={true}
          showsHorizontalScrollIndicator={false}>
          {row}
        </ScrollView>
      </Animated.View>
    );
  }

  async paymentSuccess(paymentId, billId, order_id) {
    UserDefaults.get(stringsUserDefaults.userToken)
      .then((token) => {
        let params =
          'token=' +
          (token || '') +
          '&paymentId=' +
          (paymentId || '') +
          '&order_id=' +
          (order_id || '') +
          '&billId=' +
          (billId || 0);
        var _this = this;
        NetworkRequest(_this, 'POST', URLs.razorpayReportCaptureApp, params)
          .then((result) => {
            if (result.success) {
              if ((result.response.code || 0) === 200) {
                this.getData();
                console.log('SUCCESS');
              } else if ((result.response.code || 0) === 500) {
                console.log('FAILURE');
                this.loadingManipulate(false);
              } else {
                this.loadingManipulate(false);
              }
            }
          })
          .catch((error) => {
            this.loadingManipulate(false);
            console.error(error);
          });
      })
      .catch((error) => {
        this.loadingManipulate(false);
        console.error(error);
      });
  }

  gotoFeedback(collectingPersonId, homecollectionId) {
    this.setState({
      isOpen: true,
      feedbackModal: true,
      reportModal: false,
      reportViewModal: false,
      trackerModal: false,
      upcomingOrderModal: false,
      collectingPersonId: collectingPersonId,
      homecollectionId: homecollectionId,
      homeFeedback: true,
      insuranceModal: false,
    });
  }

  getGreetingTime(m) {
    var g = ''; //return g

    if (!m || !m.isValid()) {
      return;
    } //if we can't find a valid or filled moment, we return.

    var split_afternoon = 12; //24hr time to split the afternoon
    var split_evening = 17; //24hr time to split the evening
    var currentHour = parseFloat(m.format('HH'));

    if (currentHour >= split_afternoon && currentHour <= split_evening) {
      g = 'Good Afternoon,';
    } else if (currentHour >= split_evening) {
      g = 'Good Evening,';
    } else {
      g = 'Good Morning,';
    }

    return g;
  }

  onClose() {
    this.closeModal();
    console.log('Modal just closed');
  }
  onOpen() {
    // if(this.state.reportModal){
    //   this.setState({
    //     swipeToClose: false
    //   })
    // }
    console.log('Modal just openned');
  }
  onClosingState(state) {
    console.log('the open/close of the swipeToClose just changed');
  }

  renderClose(flag) {
    this.setState({
      swipeToClose: flag,
    });
  }

  closeModal() {
    this.setState({
      isOpen: false,
      feedbackModal: false,
      reportModal: false,
      reportViewModal: false,
      trackerModal: false,
      isScrollable: false,
      swipeToClose: true,
      homeFeedback: false,
    });
  }

  convertUnicode(input) {
    return input.replace(/\\u(\w\w\w\w)/g, function (a, b) {
      var charcode = parseInt(b, 16);
      return String.fromCharCode(charcode);
    });
  }

  onNotificationOpened(notification) {
    console.log('onNotificationOpened: ', notification);
    if (!Global.iOSPlatform) {
      if (
        notification.data.category === stringsNotifications.GCMCAT_NEW_REPORT
      ) {
        this.gotoReports(true, notification.data.referenceId);
      } else if (
        notification.data.category === stringsNotifications.GCMCAT_APP_UPDATE
      ) {
        this.gotoPlayStore();
      } else if (
        notification.data.category ===
        stringsNotifications.GCMCAT_ALL_APPOINTMENTS
      ) {
        this.gotoUpcomingOrder(false);
      } else if (
        notification.data.category ===
        stringsNotifications.GCMCAT_ALL_HOMECOLLECTION
      ) {
        this.gotoUpcomingOrder(true);
      } else if (
        notification.data.category === stringsNotifications.GCMCAT_ALL_PHLEBO
      ) {
        this.gotoFeedback(
          notification.data.collectingPersonId,
          notification.data.homecollectionId,
        );
      }
    } else {
      if (
        notification._data.category === stringsNotifications.GCMCAT_NEW_REPORT
      ) {
        this.gotoReports(true, notification._data.referenceId);
      } else if (
        notification._data.category === stringsNotifications.GCMCAT_APP_UPDATE
      ) {
        this.gotoPlayStore();
      } else if (
        notification._data.category ===
        stringsNotifications.GCMCAT_ALL_APPOINTMENTS
      ) {
        this.gotoUpcomingOrder(false);
      } else if (
        notification._data.category ===
        stringsNotifications.GCMCAT_ALL_HOMECOLLECTION
      ) {
        this.gotoUpcomingOrder(true);
      } else if (
        notification._data.category === stringsNotifications.GCMCAT_ALL_PHLEBO
      ) {
        this.gotoFeedback(
          notification._data.collectingPersonId,
          notification._data.homecollectionId,
        );
      }
      try {
        PushNotificationIOS.setApplicationIconBadgeNumber(0);
      } catch (error) {
        console.log(error);
      }
    }
  }

  onNotificationReceived(notification) {
    if (
      notification.data.category !== stringsNotifications.GCMCAT_NEW_REPORT &&
      notification.data.category !== stringsNotifications.GCMCAT_APP_UPDATE &&
      notification.data.category !==
        stringsNotifications.GCMCAT_ALL_APPOINTMENTS &&
      notification.data.category !==
        stringsNotifications.GCMCAT_ALL_HOMECOLLECTION &&
      notification.data.category !== stringsNotifications.GCMCAT_ALL_PHLEBO
    ) {
      // NotificationsAndroid.cancelLocalNotification(notification.data);
    }
  }

  onNotificationOpenedForeground() {
    notification = this.state.notification;
    if (
      notification._data.category === stringsNotifications.GCMCAT_NEW_REPORT
    ) {
      this.gotoReports(true, notification._data.referenceId);
    } else if (
      notification._data.category === stringsNotifications.GCMCAT_APP_UPDATE
    ) {
      this.gotoPlayStore();
    } else if (
      notification._data.category ===
      stringsNotifications.GCMCAT_ALL_APPOINTMENTS
    ) {
      this.gotoUpcomingOrder(false);
    } else if (
      notification._data.category ===
      stringsNotifications.GCMCAT_ALL_HOMECOLLECTION
    ) {
      this.gotoUpcomingOrder(true);
    } else if (
      notification._data.category === stringsNotifications.GCMCAT_ALL_PHLEBO
    ) {
      this.gotoFeedback(
        notification._data.collectingPersonId,
        notification._data.homecollectionId,
      );
    }
  }

  onNotificationReceivedForeground(notification) {
    // let localNotification = NotificationsIOS.localNotification({
    //   fireDate: new Date(Date.now() + (10)).toISOString(),
    //   alertBody: "Received background notificiation!",
    //   alertTitle: "Local Notification Title",
    //   alertAction: "Click here to open",
    //   soundName: "chime.aiff",
    //   category: "Rate Phlebotomist",
    //  // userInfo: notification.getData()
    // });

    console.log('Notification from Home', notification);
    //  PushNotificationIOS.scheduleLocalNotification({
    //     fireDate:moment(),
    //     alertBody: "Local notificiation!",
    //     alertTitle: "Local Notification Title",
    //     soundName: "chime.aiff",
    //       silent: false,
    //     category: "SOME_CATEGORY",
    //     userInfo: { }
    //   });
    //   this.setState({
    //     showNotification:true,
    //     notification:notification
    //   })
    //   console.log("Notification Received - Foreground", notification);

    //   if(notification._data.category === stringsNotifications.GCMCAT_NEW_REPORT)  {
    //     this.callNotification(stringsNotifications.GCMCAT_NEW_REPORT, notification._data.message)
    //     //this.gotoReports(true, notification._data.referenceId)
    //   } else if(notification._data.category === stringsNotifications.GCMCAT_APP_UPDATE){
    //     this.callNotification('App Update', notification._data.message)
    //     //this.gotoPlayStore()
    //   }
    //   else if(notification._data.category === stringsNotifications.GCMCAT_ALL_APPOINTMENTS){
    //     this.callNotification('Appointment', notification._data.message)
    //    // this.gotoUpcomingOrder(false)
    //  } else if(notification._data.category === stringsNotifications.GCMCAT_ALL_HOMECOLLECTION){
    //   this.callNotification('Homecollection', notification._data.message)
    //  //  this.gotoUpcomingOrder(true)
    //  } else if(notification._data.category === stringsNotifications.GCMCAT_ALL_PHLEBO){
    //   this.callNotification('Homecollection', notification._data.message)
    //   //this.gotoFeedback(notification._data.collectingPersonId, notification._data.homecollectionId)
    //  }
  }

  setSwipe(flag) {
    this.setState({
      swipeToClose: flag,
    });
  }

  getSwipe() {
    return this.state.swipeToClose;
  }

  setScroll(flag) {
    this.setState({
      isScrollable: flag,
    });
  }

  getRoute() {
    if (Global.iOSPlatform) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          var labLocation = this.state.upcomingAppointments[0].labForId
            .location;
          let labArray = labLocation.split(',');
          let labLati = labArray[0];
          let labLongi = labArray[1];

          const data = {
            source: {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            },
            destination: {
              latitude: parseFloat(labLati),
              longitude: parseFloat(labLongi),
            },
            params: [
              {
                key: 'dirflg',
                value: 'c',
              },
            ],
          };
          getDirections(data);
        },
        (error) => {
          Alert.alert(
            'Location Services',
            'Your Location services are turned off, You need to enable it in order to access this feature',
            [
              {text: 'Cancel', onPress: () => console.log('Cancel Pressed')},
              {
                text: 'Settings',
                onPress: () => {
                  Linking.openURL('app-settings:');
                },
              },
            ],
            {cancelable: false},
          );
        },
        {enableHighAccuracy: false, timeout: 20000, maximumAge: 1000},
      );
    } else {
      var _this = this;
      var isLocationEnabled = false;
      LocationServicesDialogBox.checkLocationServicesIsEnabled({
        message:
          "<h2>Use Location ?</h2>This app wants to change your device settings:<br/><br/>Use GPS, Wi-Fi, and cell network for location<br/><br/><a href='#'>Learn more</a>",
        ok: 'YES',
        cancel: 'NO',
        enableHighAccuracy: true, // true => GPS AND NETWORK PROVIDER, false => ONLY GPS PROVIDER
        showDialog: true, // false => Opens the Location access page directly
      })
        .then((success) => {
          if (success.enabled || success.alreadyEnabled) {
            // setTimeout(() => {
            //   _this.props.navigation.navigate(Routes.mapScreen, {

            //   })
            // },100)
            navigator.geolocation.getCurrentPosition(
              (position) => {
                var labLocation = this.state.upcomingAppointments[0].labForId
                  .location;
                let labArray = labLocation.split(',');
                let labLati = labArray[0];
                let labLongi = labArray[1];

                const data = {
                  source: {
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                  },
                  destination: {
                    latitude: parseFloat(labLati),
                    longitude: parseFloat(labLongi),
                  },
                  params: [
                    {
                      key: 'dirflg',
                      value: 'c',
                    },
                  ],
                };
                getDirections(data);
              },
              (error) => {
                Alert.alert(
                  'Location Services',
                  'Your Location services are turned off, You need to enable it in order to access this feature',
                  [
                    {
                      text: 'Cancel',
                      onPress: () => console.log('Cancel Pressed'),
                    },
                    {
                      text: 'Settings',
                      onPress: () => {
                        Linking.openURL('app-settings:');
                      },
                    },
                  ],
                  {cancelable: false},
                );
              },
              {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000},
            );
          }
          console.log(success); // success => {alreadyEnabled: false, enabled: true, status: "enabled"}
        })
        .catch((error) => {
          console.log(error.message); // error.message => "disabled"
        });
    }
  }

  OnDirectionPressed() {
    try {
      if (Global.iOSPlatform) {
        this.getRoute();
      } else {
        if (Global.osVersion) {
          const granted = PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          )
            .then((granted) => {
              if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                this.getRoute();
              } else {
                console.log('Location permission denied');
              }
            })
            .catch((error) => {
              console.error(error);
            });
        } else {
          this.getRoute();
        }
      }
    } catch (err) {
      console.warn(err);
    }
  }

  gotoPendingUpcomingOrder() {
    this.setState({
      pendingOrderModal: true,
      isOpen: true,
      feedbackModal: false,
      reportModal: false,
      reportViewModal: false,
      trackerModal: false,
      upcomingOrderModal: false,
      insuranceModal: false,
    });
  }

  openRazorPay(order_id) {
    var item = this.state.razorpay_item;
    console.log(item);
    var timeStamp = moment().format(Global.LTHDateFormatMoment) + 'Z';
    var options = {
      description: '',
      image: URLs.getLivehealthLogo,
      order_id: order_id,
      currency: 'INR',
      key: stringRazorPay.razorpayKey,
      // key: 'rzp_test_MdhWQeMJTkdfz0',
      amount: item.amount * 100 + '',
      name: item.labName,
      notes: {
        billId: item.billId || 0,
        isProvider: '0',
        id: this.state.uuid || '',
        user_id: this.state.user_id || '',
        userDetailsId_id: this.state.userDetailsId_id || '',
        amount: item.amount || 0,
        labId: item.labId || 0,
        labName: item.labName || '',
        source: Global.iOSPlatform ? 'iOS' : 'Android',
        isReport: 1,
        isAppointment: 0,
        isHomeCollection: 0,
        isComplete: 0,
        isFailed: 0,
        activityDate: timeStamp || '',
      },
      prefill: {
        email: this.state.email,
        contact: this.state.contact + '',
      },
      theme: {color: Color.themeColor},
    };
    RazorpayCheckout.open(options)
      .then((data) => {
        // handle success
        this.loadingManipulate(true);
        this.paymentSuccess(
          Global.iOSPlatform
            ? data.razorpay_payment_id
            : data.details.razorpay_payment_id,
          item.billId,
          order_id,
        );
        this.paymentCheck(1, 0, item.amount, item.labId, item.labName);
        // alert(`Success: ${data.details.razorpay_payment_id}`);
      })
      .catch((error) => {
        // handle failure
        console.log('OPTIONS', options);
        this.paymentCheck(0, 1, item.amount, item.labId, item.labName);
        alert(`Error: ${error.code} | ${error.description}`);
      });
  }

  getOrderId() {
    UserDefaults.get(stringsUserDefaults.userToken)
      .then((token) => {
        let params =
          'token=' +
          (token || '') +
          '&isReport=' +
          1 +
          '&amount=' +
          (this.state.razorpay_item.amount || 0) +
          '&billId=' +
          (this.state.razorpay_item.billId || '');

        var _this = this;
        NetworkRequest(_this, 'POST', URLs.createNewOrder, params)
          .then((result) => {
            if (result.success) {
              if ((result.response.code || 0) === 200) {
                this.loadingManipulate(false);
                setTimeout(() => {
                  this.openRazorPay(result.response.order_id);
                }, 50);
              } else {
                this.loadingManipulate(false);
                this.paymentCheck(0, 1);
              }
            } else {
              this.loadingManipulate(false);
              this.paymentCheck(0, 1);
            }
          })
          .catch((error) => {
            this.loadingManipulate(false);
            console.error(error);
          });
      })
      .catch((error) => {
        this.loadingManipulate(false);
        console.error(error);
      });
  }

  render() {
    // const { props: { name, index, list } } = this;
    const {lab={}}=this.state
    var pendingReports = [];
    pendingReports = this.state.pendingReports;
    var labName = this.state.unreadLab;

    const anim = this.animatedValue.interpolate({
      inputRange: [0.5, 3],
      outputRange: [-100, 400],
    });

    count = this.state.demographyCount;

    switch (count) {
      case 1:
        indicatorText = 'Weekly';
        break;

      case 2:
        indicatorText = 'Sedentary';
        break;

      case 3:
        indicatorText = 'Rarely';
        break;

      default:
        indicatorText = '';
    }
    return (
      <ScrollView
        style={{backgroundColor: 'white', marginBottom: 15}}
        refreshControl={
          <RefreshControl
            refreshing={this.state.refreshing}
            onRefresh={this._onRefresh.bind(this)}
          />
        }
        bounces={true}
        style={{flex: 1, backgroundColor: 'white'}}>
        <StatusBar backgroundColor={'#000'} barStyle="default" />

        {/* <Animated.View style = {{bottom:anim}}> */}

        <View style={{flex: 1, marginTop: Global.isIphoneX ? 10 : 0}}>
          <Text
            style={{
              fontFamily: 'Arial',
              fontSize: 17,
              color: Color._54,
              paddingTop: 12,
              marginLeft: 19,
              marginRight: 19,
              marginTop: 20,
              fontFamily: 'Arial',
            }}>
            {this.getGreetingTime(moment())}
          </Text>

          <Text
            style={{
              fontFamily: 'Arial',
              fontSize: 28,
              fontWeight: '800',
              color: 'black',
              paddingBottom: 16,
              marginLeft: 19,
              marginRight: 19,
              fontFamily: 'Arial',
            }}>
            {this.state.user.fullName}
          </Text>
          <Animated.View style={{bottom: anim, flex: 1}}>
            {this.state.upcomingAppointments.length > 0
              ? (text = (
                  <Upcoming
                    typeText="APPOINTMENT"
                    nameText=""
                    labNameText={
                      this.state.upcomingAppointments[0].labForId
                        ? this.state.upcomingAppointments[0].labForId.labName
                        : ''
                    }
                    date={moment
                      .utc(
                        this.state.upcomingAppointments[0].userAppointmentDate,
                      )
                      .local()
                      .format('dddd')}
                    timing={moment
                      .utc(
                        this.state.upcomingAppointments[0].userAppointmentDate,
                      )
                      .local()
                      .format('Do MMMM YYYY')}
                    callBtn={
                      this.state.upcomingAppointments[0].labForId ? 'CALL' : ''
                    }
                    directionsBtn={
                      this.state.upcomingAppointments[0].labForId
                        ? 'DIRECTIONS'
                        : ''
                    }
                    labNull={
                      this.state.upcomingAppointments[0].labForId ? 'yes' : null
                    }
                    descText={
                      'Your order request has been received, We will update you here for further details.'
                    }
                    //descText={'Your order request for '+ moment.utc(this.state.upcomingAppointments[0].userAppointmentDate).local().format('dddd Do MMMM') +' has been received. We will update you here for further details.'}
                    onPressAction={() => {
                      // setTimeout(()=>{
                      this.gotoUpcomingOrder(false);
                      // }, 5)
                    }}
                    onPressCall={() => {
                      var number = this.state.upcomingAppointments[0].labForId
                        ? this.state.upcomingAppointments[0].labForId.labContact
                        : '';
                      var numArray = number.split(',');

                      Linking.openURL('tel:' + numArray[0]);
                    }}
                    onPressDirection={this.OnDirectionPressed}
                  />
                ))
              : null}

            {this.state.upcomingHomeCollection.length > 0 ? (
              <Upcoming
                typeText={
                  this.state.upcomingHomeCollection[0].collectingPersonId
                    ? 'HOME COLLECTION BY'
                    : 'HOME COLLECTION'
                }
                nameText={
                  this.state.upcomingHomeCollection[0].collectingPersonId
                    ? this.state.upcomingHomeCollection[0].collectingPersonId
                        .name
                    : null
                }
                labNameText={
                  this.state.upcomingHomeCollection[0].labForId
                    ? this.state.upcomingHomeCollection[0].labForId.labName
                    : ''
                }
                date={moment
                  .utc(this.state.upcomingHomeCollection[0].startTime)
                  .local()
                  .format('dddd')}
                timing={moment
                  .utc(this.state.upcomingHomeCollection[0].startTime)
                  .local()
                  .format('h:mm a')}
                timingTo={
                  '- ' +
                  moment
                    .utc(this.state.upcomingHomeCollection[0].endTime)
                    .local()
                    .format('h:mm a')
                }
                labNull={
                  this.state.upcomingHomeCollection[0].labForId ? 'yes' : null
                }
                //  descText={'Your order request for '+ moment.utc(this.state.upcomingHomeCollection[0].startTime).local().format('dddd Do MMMM') +' has been received. We will update you here for further details.'}
                descText={
                  'Your order request has been received, We will update you here for further details.'
                }
                directionsBtn={'VIEW ORDER'}
                callBtn={
                  this.state.upcomingHomeCollection[0].labForId
                    ? this.state.upcomingHomeCollection[0].labForId.labContact
                      ? 'CALL'
                      : ''
                    : null
                }
                onPressAction={() => {
                  this.gotoUpcomingOrder(true);
                }}
                onPressDirection={this.gotoPendingUpcomingOrder}
                onPressCall={() => {
                  var number = this.state.upcomingHomeCollection[0]
                    .collectingPersonId
                    ? this.state.upcomingHomeCollection[0].collectingPersonId
                        .mobile
                    : this.state.upcomingHomeCollection[0].labForId.labContact;
                  var numArray = number.split(',');
                  Linking.openURL('tel:' + numArray[0]);
                }}
              />
            ) : null}
            {!this.state.isInitialLoading ? (
              <View style={{flex: 1, backgroundColor: 'white'}}>
                {this.state.isUnreadReportFlag ? (
                  <DummyCard
                    headerText="Your Reports"
                    // subheaderText= 'You have unread reports from '+ {labName} + ' click to view them'
                    subheaderText={
                      labName
                        ? 'You have unread reports from ' +
                          labName +
                          ' click to view them'
                        : 'You have unread reports click to view them'
                    }
                    image={Images.imageCardio}
                    actualType="Unread Reports"
                    onPressAction={this.gotoReports}
                  />
                ) : null}

                {this.state.isPendingFlag ? (
                  <View style={{marginBottom: 16}}>
                    <Text
                      style={[
                        CommonStyles.secondary_text_title,
                        {paddingTop: 8},
                      ]}>
                      Your pending orders
                    </Text>
                    <Text style={CommonStyles.secondary_text_description}>
                      You can live track your orders and pay for your pending
                      orders right here
                    </Text>

                    {this._renderPage()}
                    {pendingReports.length > 1 ? (
                      <SwipeInfoText text="reports" />
                    ) : null}
                  </View>
                ) : null}

                {this.state.isFeedbackFlag ? (
                  <View
                    style={[
                      {
                        marginTop: 8,
                        marginBottom: 8,
                        backgroundColor: 'white',
                        paddingLeft: 16,
                        paddingRight: 16,
                        paddingTop: 16,
                        marginLeft: 17,
                        marginRight: 17,
                        elevation: 6,
                        borderRadius: 6,
                      },
                      CommonStyles.commonShadow,
                    ]}>
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                      <MaterialIcons
                        name={'announcement'}
                        size={35}
                        style={{
                          color: '#253F8B',
                        }}
                      />
                      <Text
                        style={[CommonStyles.common_header, {paddingLeft: 12}]}>
                        Your last visit
                      </Text>
                    </View>
                    <Text
                      style={{
                        fontFamily: 'Arial',
                        fontSize: 16,
                        paddingTop: 8,
                        color: Color._4A,
                      }}>
                      Share your feedback{' '}
                      {this.state.labName ? 'at ' + this.state.labName : ''}
                    </Text>
                    <View
                      style={{
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: 16,
                      }}>
                      <StarRatingBar
                        emptyStar={'star-border'}
                        fullStar={'star'}
                        maxStars={5}
                        rating={this.state.rating}
                        selectedStar={(rating) => {
                          this.setState({
                            rating: rating,
                          });
                        }}
                        starColor={Color.starYellow}
                        starSize={30}
                      />
                    </View>
                    <Ripple
                      rippleOpacity={0.2}
                      onPress={() => {
                        this.setState({
                          isOpen: true,
                          feedbackModal: true,
                          reportModal: false,
                          reportViewModal: false,
                          trackerModal: false,
                          upcomingOrderModal: false,
                          insuranceModal: false,
                        });
                      }}
                      style={{padding: 12}}>
                      <Text
                        style={[
                          CommonStyles.button_style,
                          {textAlign: 'center'},
                        ]}>
                        SUBMIT
                      </Text>
                    </Ripple>
                  </View>
                ) : null}

                <DashboardTrackers
                  key={this.state.pinnedTrackers}
                  trackerArray={this.state.pinnedTrackers}
                  goSecondaryAction={this.goToTrackerDetails}
                  pinnedTrackers={this.state.pinnedTrackers}
                  goAction={this.gotoTrackerNav}
                />

                {this.state.isShowBooking ? (
                  <CustomCardForEHeart
                    headerText={`Call ${lab.labContact} to Book`}
                    actualType="Click here to book through app"
                    image={Images.imageLivehealthLogoGif}
                    onPressAction={this.requestLocationPermission}
                    imageStyles={{height: 40, width: 50, flex: 0}}
                  />
                ) : null}
                {!this.props.demographics.demographics.show ? (
                  <DummyCard
                    headerText="Complete your profile"
                    subheaderText="Complete profile helps us get better insights and provide better experience."
                    actualType=" Click here to update now"
                    image={Images.incompleteProfile}
                    animated={true}
                    onPressAction={this.gotoProfile}
                  />
                ) : null}

                {this.state.takePhlebotomistReview ? (
                  <DummyCard
                    headerText="Review Phlebotomist"
                    subheaderText={
                      'Review phlebotomist' +
                      (this.state.phlebotomistName
                        ? ' ' + this.state.phlebotomistName + ' '
                        : ' ') +
                      'for home collection done' +
                      (this.state.labNameHC
                        ? ' for ' + this.state.labNameHC
                        : '')
                    }
                    image={Images.blood_donation}
                    onPressAction={() => {
                      this.gotoFeedback(
                        this.state.collectingPersonId,
                        this.state.homeCollectionId,
                      );
                    }}
                  />
                ) : null}

                {this.state.demographyCount < 6 ? (
                  <Demographics
                    headerText="Tell us more"
                    subheaderText=""
                    actualType="Help us personalise the experience for you"
                    type={this.state.demographyCount}
                    indicatorText={indicatorText}
                    onPressAction={this.getDemographics}
                    nextValue={true}
                    processing={this.state.processing}
                  />
                ) : null}

                <TipsTricks
                  counter={this.state.tipCount}
                  onPressAction={this.getTipCount}
                />
              </View>
            ) : null}
          </Animated.View>

          {this.state.showNotification ? (
            <Animated.View
              style={{
                transform: [{translateY: this.animatedValueNotification}],
                height: 90,
                backgroundColor: '#EEEEEE',
                position: 'absolute',
                left: 0,
                top: 0,
                right: 0,
                justifyContent: 'center',
                borderWidth: 1.5,
                borderColor: '#ccc',
                elevation: 10,
              }}>
              <Ripple onPress={this.onNotificationOpenedForeground}>
                <Text
                  style={{
                    marginLeft: 18,
                    color: 'black',
                    fontSize: 14,
                    fontWeight: 'bold',
                    paddingTop: 20,
                  }}>
                  {this.state.notificationHeader}
                </Text>
                <Text style={{marginLeft: 18, paddingTop: 4, marginBottom: 5}}>
                  {this.state.notificationSubText}
                </Text>
              </Ripple>
            </Animated.View>
          ) : null}

          {this.state.isLoading ? <ProgressBar /> : null}
        </View>
        {/* <Modal
           animationType={'none'}
           transparent={true}
           visible={this.state.isOpen}
           onRequestClose = {() => {
             this.closeModal()
           }}
           > */}
        <ModalBox
          ref={'modal1'}
          swipeThreshold={200}
          swipeArea={!this.state.upcomingOrderModal ? Global.screenHeight : 300}
          isOpen={this.state.isOpen}
          swipeToClose={this.state.swipeToClose}
          onClosed={this.onClose}
          position={'top'}
          coverScreen={true}
          keyboardTopOffset={Global.iOSPlatform ? 22 : 0}
          onOpened={this.onOpen}
          setSwipe={this.setSwipe}
          getSwipe={this.getSwipe}
          isScrollable={this.state.isScrollable}
          onClosingState={this.onClosingState}>
          {this.state.insuranceModal ? (
            <InsuranceModal
              setSwipe={this.setSwipe}
              getSwipe={this.getSwipe}
              setScroll={this.setScroll}
              closeModal={this.closeModal}
              setInsuranceName={this.setInsuranceName}
            />
          ) : this.state.upcomingOrderModal ? (
            <AllUpcomingOrders
              setSwipe={this.setSwipe}
              getSwipe={this.getSwipe}
              setScroll={this.setScroll}
              closeModal={this.closeModal}
              getData={this.getData}
              type={this.state.isHomeCollectionType}
            />
          ) : this.state.feedbackModal ? (
            <Feedback
              rating={this.state.homeFeedback ? 3 : this.state.rating}
              labName={this.state.labName}
              labId={this.state.labId}
              billId={this.state.billId}
              clearCard={this.clearCard}
              clearCard1={this.clearCard1}
              setSwipe={this.setSwipe}
              getSwipe={this.getSwipe}
              setScroll={this.setScroll}
              homeFeedback={this.state.homeFeedback}
              collectingPersonId={this.state.collectingPersonId}
              homecollectionId={this.state.homecollectionId}
              closeModal={this.closeModal}
            />
          ) : this.state.reportModal ? (
            <PendingReportView
              pending_report={this.state.pending_report}
              getData={this.getData}
              loadingManipulate={this.loadingManipulate}
              renderClose={this.renderClose}
              setSwipe={this.setSwipe}
              getSwipe={this.getSwipe}
              setScroll={this.setScroll}
              closeModal={this.closeModal}
            />
          ) : this.state.trackerModal ? (
            <TrackerDetails
              setSwipe={this.setSwipe}
              getSwipe={this.getSwipe}
              setScroll={this.setScroll}
              dictionaryId={this.state.dictionaryId}
              closeModal={this.closeModal}
            />
          ) : this.state.reportViewModal ? (
            <ReportView
              reportListObject={this.state.selectedItemModal}
              reportSectionObject={this.state.selectedSectionArray}
              userName={this.state.userName}
              getData={this.getData}
              reportId={this.state.reportId}
              setScroll={this.setScroll}
              setSwipe={this.setSwipe}
              getSwipe={this.getSwipe}
              closeModal={this.closeModal}
            />
          ) : this.state.pendingOrderModal ? (
            <PendingUpcomingOrder
              data={this.state.upcomingHomeCollection}
              getData={this.getData}
              loadingManipulate={this.loadingManipulate}
              renderClose={this.renderClose}
              setSwipe={this.setSwipe}
              getSwipe={this.getSwipe}
              setScroll={this.setScroll}
              closeModal={this.closeModal}
            />
          ) : null}
        </ModalBox>
        {/* </Modal> */}
        {/* </Animated.View> */}

        {/* <Tutorial/> */}
      </ScrollView>
    );
  }
}

function mapDispatchToActions(dispatch) {
  return {
    getList: () => dispatch(getList()),
    setList: (list) => dispatch(setList(list)),
    onClickInc: () => {
      dispatch(incrementAC());
    },
    onClickDec: () => {
      dispatch(decrementAC());
    },
    setUnreadFlag: (num) => dispatch(setUnreadFlag(num)),
    setDemographics: (arr) => dispatch(setDemographics(arr)),
    setCurrency: (str) => dispatch(setCurrency(str)),
  };
}

const mapStateToProps = (state) => {
  
  return({
  pinnedTrackers: state.pinnedTrackers,
  noti: state.notification,
  unread: state.unread,
  demographics: state.demographics,
  currency: state.currency,
 })

};

// for app font to not get overridden by system font
Text.allowFontScaling = false;

//To disable app yellow warnings
// console.disableYellowBox = "false";

export default connect(mapStateToProps, mapDispatchToActions)(Home);
