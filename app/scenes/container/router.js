import React from "react";
import { Image, View } from "react-native";
import { StackNavigator, TabNavigator } from "react-navigation";
// import Ionicons from 'react-native-vector-icons/Ionicons'
import { Routes, Color, Images, Global } from "../../utils";

/* App Navigation Stack */
// Splash, Intro Screens
import BlankScreen from "./blankPage";
import AppIntroScreen from "./login.intro";
import SplashScreen from "./login.splash";
// Login, SignUp and Forgot Password Screens
import LoginScreen from "./login.login";
import LoginCountryCodeScreen from "./login.login.countrycode";
import LoginSignupBDateScreen from "./login.signup.bdate";
import LoginSignupEmailScreen from "./login.signup.email";
import LoginSignupPasswordScreen from "./login.signup.password";
import LoginSignupNameScreen from "./login.signup.name";
import LoginVerifyOTPScreen from "./login.verify.otp";
import UpdatePasswordScreen from "./login.updatePassword";
// TabbarNav - Tabbar Stack
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

/* Tabbar Stack */
// HomeNav - Home Stack
// ReportsNav - Reports Stack
// TrackersNav - Trackers Stack
// ProfileNav - Profile Stack
/* Home Stack */
import HomeScreen from "./home.home";
import PendingReportView from "./pending.reportview";
import FeedbackRating from "./feedback";
import TipsTricks from "./tips.tricks";

/* Reports Stack */
import ReportListScreen from "./report.list";
import ReportViewScreen from "./report.view";
import ReportUploadScreen from "./report.upload";
import ReportUploadViewScreen from "./report.upload.view";

/* Trackers Stack */
import TrackerListScreen from "./tracker.list";
import TrackerCategoryScreen from "./tracker.category.list";
import TrackerSubCategoryScreen from "./tracker.subcategories";
import TrackerDetailsScreen from "./tracker.details";
import TrackerAddition from "./tracker.addition";
import AutomatedTrackers from "./automated.tracker";

/* Profile Stack */
import ProfileScreen from "./profile.profile";
import BasicProfile from "./profile.basic";
import BillingListScreen from "./profile.billing.history";
import Preference from "./profile.preference";
import Feedback from "./profile.feedback";
import FAQList from "./profile.feedback.faq.list";
import FAQDetail from "./profile.feedback.faq.detail";
import NotificationPreferences from "./profile.notification.prefs";
import AboutUs from "./profile.about_us";
import Gallery from "./gallery";

/*Appointment flow*/
import AppointmentHome from "./appointmenthome";
import AppointmentCategories from "./appointmentcategories";
import TestScreen from "./test.screen";
import AllAppointments from "./allAppointments";
import AllHomeCollections from "./allHomeCollections/";
import allUpcomingOrders from "./allUpcomingOrders/";
import TimeSlots from "./time.slots";
import AppointmentSummary from "./appointmentSummary";
import ReceiptScreen from "./receipt";
import MapScreen from "./mapScreen";
import LabScreen from "./lab.screen";
import LabsList from "./labs.list";

// Some Needed Compoenents
import { createStore, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import demographics from "../../redux/reducers/demographics";
//import unread from '../../redux/reducers/unread';

// access store in non react js
const store = createStore(
  demographics,
  // unread,
  applyMiddleware(thunk)
);

export default AppNavigatorStack;

export const HomeNav = StackNavigator({
  homeScreen: {
    screen: HomeScreen,
    key: Routes.homeScreen,
    navigationOptions: { header: null }
  },
  pendingReportView: {
    screen: PendingReportView,
    key: Routes.pendingReportView,
    navigationOptions: {
      header: null,
      tabBarVisible: false
    }
  },
  feedback: {
    screen: FeedbackRating,
    key: Routes.feedback,
    navigationOptions: {
      header: null,
      tabBarVisible: false
    }
  },
  tipstricks: {
    screen: TipsTricks,
    key: Routes.tipstricks,
    navigationOptions: {
      header: null,
      tabBarVisible: false
    }
  },
  reportViewHomeScreen: {
    screen: ReportViewScreen,
    key: Routes.reportViewHomeScreen,
    navigationOptions: {
      header: null,
      tabBarVisible: false
    }
  },
  trackerCategoryHomeScreen: {
    screen: TrackerCategoryScreen,
    key: Routes.trackerCategoryHomeScreen,
    navigationOptions: {
      header: null,
      tabBarVisible: false
    }
  },

  appointmenthome: {
    screen: AppointmentHome,
    key: Routes.appointmenthome,
    navigationOptions: {
      header: null,
      tabBarVisible: false
    }
  },

  appointmentCategories: {
    screen: AppointmentCategories,
    key: Routes.appointmentCategories,
    navigationOptions: {
      header: null,
      tabBarVisible: false
    }
  },

  testScreen: {
    screen: TestScreen,
    key: Routes.testScreen,
    navigationOptions: {
      header: null,
      tabBarVisible: false
    }
  },

  allAppointments: {
    screen: AllAppointments,
    key: Routes.allAppointments,
    navigationOptions: {
      header: null,
      tabBarVisible: false
    }
  },

  allUpcomingOrders: {
    screen: allUpcomingOrders,
    key: Routes.allUpcomingOrders,
    navigationOptions: {
      header: null,
      tabBarVisible: false
    }
  },

  timeSlots: {
    screen: TimeSlots,
    key: Routes.testScreen,
    navigationOptions: {
      header: null,
      tabBarVisible: false
    }
  },

  allHomeCollections: {
    screen: AllHomeCollections,
    key: Routes.allHomeCollections,
    navigationOptions: {
      header: null,
      tabBarVisible: false
    }
  },
  appointmentSummary: {
    screen: AppointmentSummary,
    key: Routes.appointmentSummary,
    navigationOptions: {
      header: null,
      tabBarVisible: false
    }
  },
  receiptScreen: {
    screen: ReceiptScreen,
    key: Routes.receiptScreen,
    navigationOptions: {
      header: null,
      tabBarVisible: false
    }
  },
  mapScreen: {
    screen: MapScreen,
    key: Routes.mapScreen,
    navigationOptions: {
      header: null,
      tabBarVisible: false
    }
  },

  labScreen: {
    screen: LabScreen,
    key: Routes.labScreen,
    navigationOptions: {
      header: null,
      tabBarVisible: false
    }
  },

  labsList: {
    screen: LabsList,
    key: Routes.labsList,
    navigationOptions: {
      header: null,
      tabBarVisible: false
    }
  }
});

export const ReportNav = StackNavigator({
  reportListScreen: {
    screen: ReportListScreen,
    key: Routes.reportListScreen,
    navigationOptions: { header: null }
  },
  reportViewScreen: {
    screen: ReportViewScreen,
    key: Routes.reportViewScreen,
    navigationOptions: {
      header: null,
      tabBarVisible: false
    }
  },
  reportUploadScreen: {
    screen: ReportUploadScreen,
    key: Routes.reportUploadScreen,
    navigationOptions: {
      header: null,
      tabBarVisible: false
    }
  },
  reportUploadViewScreen: {
    screen: ReportUploadViewScreen,
    key: Routes.reportUploadViewScreen,
    navigationOptions: {
      header: null,
      tabBarVisible: false
    }
  }
  // reportPDFScreen: {
  //   screen: ReportPDFScreen,
  //   key: Routes.reportPDFScreen,
  //   navigationOptions: {
  //     header: null,
  //     tabBarVisible: false
  //   }
  // }
});

export const AppointmentNav = StackNavigator({
  mapScreen: {
    screen: MapScreen,
    key: Routes.mapScreen,
    navigationOptions: {
      header: null,
      tabBarVisible: true
    }
  },
  labsList: {
    screen: LabsList,
    key: Routes.labsList,
    navigationOptions: {
      header: null,
      tabBarVisible: false
    }
  },
  appointmentSummary: {
    screen: AppointmentSummary,
    key: Routes.appointmentSummary,
    navigationOptions: {
      header: null,
      tabBarVisible: false
    }
  },
  receiptScreen: {
    screen: ReceiptScreen,
    key: Routes.receiptScreen,
    navigationOptions: {
      header: null,
      tabBarVisible: false
    }
  },
  timeSlots: {
    screen: TimeSlots,
    key: Routes.testScreen,
    navigationOptions: {
      header: null,
      tabBarVisible: false
    }
  },
  appointmentCategories: {
    screen: AppointmentCategories,
    key: Routes.appointmentCategories,
    navigationOptions: {
      header: null,
      tabBarVisible: false
    }
  },

  testScreen: {
    screen: TestScreen,
    key: Routes.testScreen,
    navigationOptions: {
      header: null,
      tabBarVisible: false
    }
  }
});

export const TrackerNav = StackNavigator({
  trackerListScreen: {
    screen: TrackerListScreen,
    key: Routes.trackerListScreen,
    navigationOptions: { header: null }
  },
  trackerCategoryScreen: {
    screen: TrackerCategoryScreen,
    key: Routes.trackerCategoryScreen,
    navigationOptions: { tabBarVisible: false, header: null }
  },
  trackerSubCategoryScreen: {
    screen: TrackerSubCategoryScreen,
    key: Routes.trackerSubCategoryScreen,
    navigationOptions: { tabBarVisible: false, header: null }
  },
  trackerDetailsScreen: {
    screen: TrackerDetailsScreen,
    key: Routes.trackerDetailsScreen,
    navigationOptions: { tabBarVisible: false, header: null }
  },
  trackerAddScreen: {
    screen: TrackerAddition,
    key: Routes.trackerAddScreen,
    navigationOptions: { tabBarVisible: false }
  },
  trackerAutomatedScreen: {
    screen: AutomatedTrackers,
    key: Routes.trackerAutomatedScreen,
    navigationOptions: { tabBarVisible: false, header: null }
  }
});

export const ProfileNav = StackNavigator({
  profileScreen: {
    screen: ProfileScreen,
    key: Routes.profileScreen,
    navigationOptions: { header: null }
  },

  profileBasicDetailsScreen: {
    screen: BasicProfile,
    key: Routes.profileBasicDetailsScreen,
    navigationOptions: { tabBarVisible: false, header: null }
  },

  profilePreferencesScreen: {
    screen: Preference,
    key: Routes.profilePreferencesScreen,
    navigationOptions: { tabBarVisible: false }
  },

  profilePaymentHistoryScreen: {
    screen: BillingListScreen,
    key: Routes.billingListScreen,
    navigationOptions: { tabBarVisible: false, header: null }
  },

  profileFeedbackScreen: {
    screen: Feedback,
    key: Routes.profileFeedbackScreen,
    navigationOptions: { tabBarVisible: false, header: null }
  },

  profileFAQListScreen: {
    screen: FAQList,
    key: Routes.profileFAQListScreen,
    navigationOptions: { tabBarVisible: false }
  },

  profileFAQDetailScreen: {
    screen: FAQDetail,
    key: Routes.profileFAQDetailScreen,
    navigationOptions: { tabBarVisible: false }
  },

  profileNotification: {
    screen: NotificationPreferences,
    key: Routes.profileNotification,
    navigationOptions: { tabBarVisible: false, header: null }
  },
  profileAboutUs: {
    screen: AboutUs,
    key: Routes.profileAboutUs,
    navigationOptions: { tabBarVisible: false, header: null }
  },

  gallery: {
    screen: Gallery,
    key: Routes.gallery,
    navigationOptions: { tabBarVisible: false, header: null }
  }
});

function tabIconNamed(name) {
  /* <Ionicons
      name={name}
      size={28}
      style={{ HERE
        color: tintColor, marginTop: 7, marginBottom: 3 }}
    /> */

  console.log("THIS DOT PROPS", store.getState().demographics.show, name);
  return ({ tintColor, focused }) => (
    <View>
      <Image
        source={name}
        style={[{ marginTop: 0, marginBottom: 0, tintColor: tintColor }]}
      />
      {/* {(name==Images.imageTab4 && !store.getState().demographics.show)?
      <MaterialIcons
              name={'error-outline'}
              size={16}
              style={{color: Color.starYellow,  position:'absolute', bottom:10, right:-12, backgroundColor:'transparent'}}
            />
          :(null)
          } */}
    </View>
  );
}

export const TabbarNav = TabNavigator(
  {
    homeNav: {
      screen: HomeNav,
      key: Routes.homeNav,
      navigationOptions: {
        header: null,
        tabBarLabel: "Home",
        tabBarIcon: tabIconNamed(Images.imageTab1) // ('md-home')
      }
    },
    reportNav: {
      screen: ReportNav,
      key: Routes.reportNav,
      navigation: this.navigation,
      navigationOptions: {
        header: null,
        tabBarLabel: "Reports",
        tabBarIcon: tabIconNamed(Images.imageTab2) // ('ios-paper')
      }
    },
    trackerNav: {
      screen: TrackerNav,
      key: Routes.trackerNav,
      navigationOptions: {
        header: null,
        tabBarLabel: "Trackers",
        tabBarIcon: tabIconNamed(Images.imageTab3) // ('md-stats')
      }
    },
    profileNav: {
      screen: ProfileNav,
      key: Routes.profileNav,
      navigationOptions: {
        header: null,
        tabBarLabel: "Profile",
        tabBarIcon: tabIconNamed(Images.imageTab4) // ('md-person')
      }
    }
  },
  {
    tabBarPosition: "bottom",
    animationEnabled: false,
    swipeEnabled: false,
    lazy: true,
    tabBarOptions: {
      activeTintColor: Color.themeColor,
      inactiveTintColor: "#565656",
      indicatorStyle: {
        // color: 'transparent',
        backgroundColor: "transparent"
      },
      labelStyle: {
        fontSize: 11,
        marginBottom: 6,
        marginTop: Global.iOSPlatform ? -5 : 7
      },
      style: {
        backgroundColor: "#FBFBFB",
        height: Global.isIphoneX ? 85 : 65,

        paddingBottom: Global.isIphoneX ? 16 : 0
      },
      showIcon: true
    }
  }
);

export const AppNavigatorStack = StackNavigator({
  splashScreen: {
    screen: SplashScreen,
    key: Routes.splashScreen,
    navigationOptions: { header: null }
  },

  labsList: {
    screen: LabsList,
    key: Routes.labsList,
    navigationOptions: {
      header: null,
      tabBarVisible: false
    }
  },
  labScreen: {
    screen: LabScreen,
    key: Routes.labScreen,
    navigationOptions: {
      header: null,
      tabBarVisible: false
    }
  },
  loginIntroScreen: {
    screen: AppIntroScreen,
    key: Routes.loginIntroScreen,
    navigationOptions: { header: null }
  },
  blankScreen: {
    screen: BlankScreen,
    key: Routes.blankScreen,
    navigationOptions: { header: null }
  },
  loginScreen: {
    screen: LoginScreen,
    key: Routes.loginScreen,
    navigationOptions: { header: null }
  },
  loginCountryCodeScreen: {
    screen: LoginCountryCodeScreen,
    key: Routes.loginCountryCodeScreen,
    navigationOptions: {
      title: "Change",
      headerStyle: {
        backgroundColor: "white"
      },
      headerTintColor: "black"
    }
  },
  loginVerifyOTPScreen: {
    screen: LoginVerifyOTPScreen,
    key: Routes.loginVerifyOTPScreen,
    navigationOptions: { header: null }
  },
  loginSignupNameScreen: {
    screen: LoginSignupNameScreen,
    key: Routes.loginSignupNameScreen,
    navigationOptions: { header: null }
  },
  loginSignupBDateScreen: {
    screen: LoginSignupBDateScreen,
    key: Routes.loginSignupBDateScreen,
    navigationOptions: { header: null }
  },
  loginSignupEmailScreen: {
    screen: LoginSignupEmailScreen,
    key: Routes.loginSignupEmailScreen,
    navigationOptions: { header: null }
  },
  loginSignupPasswordScreen: {
    screen: LoginSignupPasswordScreen,
    key: Routes.loginSignupPasswordScreen,
    navigationOptions: { header: null }
  },

  updatePasswordScreen: {
    screen: UpdatePasswordScreen,
    key: Routes.updatePasswordScreen,
    navigationOptions: { header: null }
  },

  tabbarNav: {
    screen: TabbarNav,
    key: Routes.tabbarNav,
    navigationOptions: { header: null }
  }
});
