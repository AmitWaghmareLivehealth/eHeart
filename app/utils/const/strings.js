import RNFetchBlob from "react-native-fetch-blob";
let dirs = RNFetchBlob.fs.dirs;

console.log(dirs.DocumentDir);

const strings = {
  appName: "Bindu_Diagnostics",
  appVersion: "4.0.0",
  tab1Name: "Home",
  tab2Name: "Reports",
  tab3Name: "Search",
  tab4Name: "Trackers",
  tab5Name: "Profile",

  documentsBasePath: dirs.DocumentDir + "/",
  imageTestOrPDFPath: dirs.DocumentDir + "/Test_",
  userProfileImagePath: dirs.DocumentDir + "/Profile_",
  documentReportToUpload: dirs.DocumentDir + "/imageToUpload_",
  labReportPDFPath: dirs.DocumentDir + "/LabReportPDFForReportId_"
};
export default strings;

export const stringsUserDefaults = {
  userToken: "userToken",
  user: "user",
  userDetailsId: "userDetailsId",
  userName: "userName",
  userDesignation: "userDesignation",
  userCountryCode: "userCountryCode",
  userContact: "userContact",
  userEmail: "userEmail",
  userAddress: "userAddress",
  userSex: "userSex",
  userDateOfBirth: "userDateOfBirth",
  currentProfilePicURLFromWeb: "currentProfilePicURLFromWeb",
  tempPassword: "tempPassword",

  demographics: "demographics",
  activenessLevel: "activenessLevel",
  stressLevel: "stressLevel",
  frequencyOfHealthCheckup: "frequencyOfHealthCheckup",
  frequencyOfHealthCheckup_date: "frequencyOfHealthCheckup_date",
  onMedications: "onMedications",
  onMedications_date: "onMedications_date",
  hasInsurance: "hasInsurance",
  insuranceName: "insuranceName",
  hasInsurance_date: "hasInsurance_date",

  bloodGroup: "bloodGroup",
  consumesAlcohol: "consumesAlcohol",
  isChronic: "isChronic",
  isDiabetic: "isDiabetic",
  isSmoker: "isSmoker",
  industryType: "industryType",
  occupation: "occupation",
  height: "height",
  weight: "weight",

  userSelectedCity: "userSelectedCity",
  userSelectedArea: "userSelectedArea",
  userSelectedLat: "userSelectedLat",
  userSelectedLng: "userSelectedLng",
  userSelectedLocType: "userSelectedLocType",
  trackerJson: "trackerJson", //trackers to save API calls
  reportnotification_pref: "reportnotification_pref", //notification handling preferences
  promotionalnotification_pref: "promotionalnotification_pref", //notification handling preferences
  appointmentnotification_pref: "appointmentnotification_pref", //notification handling preferences
  isTrackerUpdated: "isTrackerUpdated",
  pinnedTracker: "pinnedTracker",
  tipCount: "tipCount",
  reduxTracker: "reduxTracker",

  networkConnectionStatus: "networkConnectionStatus",
  notificationFlag: "notificationFlag",
  notificationJson: "notificationJson",
  gcmId: "gcmId",

  addedTest: "addedTest",
  appointment_bundle: "appointment_bundle",
  city_list: "city_list",
  first_entry: "first_entry",
  dictionaryArray: "dictionaryArray"
};

export const stringsAlert = {
  generic: {
    header: "Something went wrong",
    message: "Please retry later."
  },
  noInternet: {
    header: "No Internet",
    message: "There is no Internet connection."
  },
  mobileLength: {
    // header: 'Mobile Number',
    message: "Please enter a valid mobile number"
  },
  invalidOTP: {
    header: "OTP",
    message: "Please enter a valid OTP"
  },
  invalidPassword: {
    header: "Password",
    message: "Please enter a valid password"
  },
  invalidPasswordLength: {
    message: "Password must have minimum eight(8) characters"
  },
  invalidPasswordMismatch: {
    message: "Both passwords must be same."
  },
  invalidName: {
    message: "Please enter a valid full name"
  },
  invalidEmail: {
    message: "Please enter a valid email address"
  },
  invalidSexAndBdate: {
    message: "Select gender and birthdate"
  },
  _OTPwrong: {
    // _302WrongOTPForgotPassword
    header: "OTP",
    message: "OTP does not match, Please try again."
  },
  _OTPsendSuccess: {
    // _302WrongOTPForgotPassword
    header: "OTP",
    message: "OTP has been sent successfully!"
  },
  _404NoUserApp: {
    header: strings.appName,
    message: "User session expired!, Please login again."
  },
  _404UserNotExistForgotPassword: {
    header: "User",
    message: "This mobile number is not registered with " + strings.appName
  },
  _408SlowInternet: {
    header: "Slow Internet",
    message: "Internet connection is slow, try later"
  },
  _500IncorrectPassword: {
    header: "Incorrect Password",
    message: "Incorrect password, please recheck password"
  },
  _500OTPsendFailure: {
    header: "OTP",
    message: "Unable to send OTP. Please check internet"
  }
};

export const stringsAlertFile = {
  generic: {
    header: "File unavailable",
    message: "Unable to retrive requested file. Please try again."
  }
};

export const stringsAlertReports = {
  unableToRetrive: {
    header: "Somthing went wrong",
    message: "Unable to retrive your report. Please check internet connection."
  },
  reportUploadSuccess: {
    header: "Success",
    message: "Report has been uploaded successfully"
  },
  reportUploadFailure: {
    header: "Upload unsuccessful",
    message: "Report upload is unsuccessful. Please check internet connection."
  },
  unknownFileType: {
    header: "File type",
    message: "Only Image or PDF document can be uploaded"
  },
  confirmSeparation: {
    header: "Confirmation",
    message: "Are you sure you wish to separate these reports?"
  }
};

export const stringsSex = {
  Male: "Male",
  Female: "Female",
  Other: "Other"
};

export const stringsDesignation = {
  Mr: "Mr.",
  Mrs: "Mrs.",
  Ms: "Ms.",
  Master: "Master",
  Baby: "Baby",
  Miss: "Miss",
  Smt: "Smt.",
  Dr: "Dr."
};

export const stringsNotifications = {
  GOOGLE_PROJECT_ID: "781312092782",

  GCMCAT_NEW_REPORT: "New Report",
  GCMCAT_PACKAGES: "Packages",
  GCMCAT_PROMOTIONS: "Promotions",
  GCMCAT_APPOINTMENT_CONFIRMATION: "Appointment Confirmation",
  GCMCAT_UPDATED_REPORT_1: "Report State Change",
  GCMCAT_NEW_COUPON: "New Coupon",
  GCMCAT_APPOINTMENT_CONFIRM: "Appointment Change",
  GCMCAT_CAMPAIGN_PUSH: "Campaign Push",
  GCMCAT_APP_UPDATE: "App Update",
  GCMCAT_ALL_APPOINTMENTS: "Appointment Change",
  GCMCAT_ALL_HOMECOLLECTION: "Homecollection Change",
  GCMCAT_ALL_PHLEBO: "Rate Phlebotomist",

  GCMKEY_MESSAGE_KEY: "message",
  GCMKEY_LAB_ID: "labId",
  GCMKEY_REFERENCE_ID: "referenceId",
  GCMKEY_CATEGORY: "category"
  /*
  iOS Keys
    var token : String = ""

    var labId : Int = 0
    var referenceId: Int = 0
    var referenceId_string: Int = 0
    var category:String = ""
    var message:String = ""
    var changeType: Int = 0
    var appointmentId: Int = 0
    var notificationCat: LTHNotificationCategory = .None

    var attachment_url:String = ""
    var title:String = ""

    var userType: Int = 0
    var relationId: Int = 0
  */
};

export const stringDictId = {
  activenessLevel: 1022,
  stressLevel: 1023
};

export const stringReportStatus = {
  report_registered: "Tests Acknowledged",
  report_processing: "Processing Sample",
  report_pending: "Pending Authorisation",
  report_completed: "Reports Ready"
};

export const stringReportStages = {
  txt_report_registered:
    "Your request is received and acknowledged. This step confirms your requested tests are received by the provider, acknowledged, and to be forwarded for processing.",
  txt_report_processing:
    "Your sample is received in the processing centre in good condition and ready to be processed for requested tests.",
  txt_report_pending:
    "Your tests are conducted and the results are ready to be verified and interpreted by the doctors. Once approved, we will notify you right on the app.",
  txt_report_completed:
    "Your tests are ready, please pay the remaining amount (if any) to view else you can view your reports right away."
};

export const stringfeedBack = {
  low_feedback_1: "Poor Service",
  low_feedback_2: "Late delivery",
  low_feedback_3: "Unhygienic",
  low_feedback_4: "Long wait time",
  low_feedback_5: "Other",

  high_feedback_1: "Poor Service",
  high_feedback_2: "Late delivery",
  high_feedback_3: "Poor Hygiene",
  high_feedback_4: "Long wait time",
  high_feedback_5: "Other",

  high_1_feedback_1: "Prompt Service",
  high_1_feedback_2: "Faster delivery",
  high_1_feedback_3: "Better Hygiene",
  high_1_feedback_4: "Reduce waiting period",
  high_1_feedback_5: "Other",

  high_2_feedback_1: "Prompt Service",
  high_2_feedback_2: "Faster delivery",
  high_2_feedback_3: "Better Hygiene",
  high_2_feedback_4: "Other",

  high_3_feedback_1: "Service from the lab",
  high_3_feedback_2: "Mobile & Digital Experience",
  high_3_feedback_3: "Quick delivery",
  high_3_feedback_4: "Very Clean Hygiene",

  _low_feedback_1: "Poor Service",
  _low_feedback_2: "Unskilled Phlebotomist",
  _low_feedback_3: "Unhygienic",
  _low_feedback_4: "Safety Precautions",
  _low_feedback_5: "Other",

  _high_feedback_1: "Poor Service",
  _high_feedback_2: "Delayed Sample Collection",
  _high_feedback_3: "Poor Hygiene",
  _high_feedback_4: "Poorly Trained Phlebotomist",
  _high_feedback_5: "Other",

  _high_1_feedback_1: "Prompt Service",
  _high_1_feedback_2: "On Time Collection",
  _high_1_feedback_3: "Better Hygiene",
  _high_1_feedback_4: "Trained Phlebotomist",
  _high_1_feedback_5: "Other",

  _high_2_feedback_1: "Prompt Service",
  _high_2_feedback_2: "Skilled Phlebotomist",
  _high_2_feedback_3: "Better Hygiene",
  _high_2_feedback_4: "Other",

  _high_3_feedback_1: "Service from the lab",
  _high_3_feedback_2: "Highly Trained Phlebotomist",
  _high_3_feedback_3: "Quick Sample Collection",
  _high_3_feedback_4: "Good Hygiene"
};

export const stringRazorPay = {
  //Live Key
  razorpayKey: "rzp_live_ytIYOfbG4I2nWK"

  //Test Key
  //  razorpayKey: 'rzp_test_MdhWQeMJTkdfz0'
};

export const stringsAppId = {
  androidId: "com.livehealth.eheart",
  iosId: "livehealth/id1078847801"
};
