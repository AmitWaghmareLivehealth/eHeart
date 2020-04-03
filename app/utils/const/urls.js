import Global from "./globals";
// const baseURL = "http://192.168.43.50:9000/"
const baseURL = "https://livehealth.in/"; // ******* Live Production ********
// const baseURL = 'https://app.livehealth.in/'
// const baseURL = "https://beta.livehealth.in/"; // ******* Beta Testing ********
// const baseURL = 'http://35.154.77.194/' // ******* Live Production ********

// const baseURL = "http://192.168.2.202:8001/"; // ******* Local Testing *******
// const baseURL = 'http://10.0.3.15:8001/'

const baseURLProvider = "https://livehealth.solutions/"; // ******* Live Production ********
// const baseURLProvider = 'http://beta.livehealth.solutions/' // ******* Beta Testing ********
// const baseURLProvider = 'http://192.168.2.107:8000/' // ******* Local Testing *******

const URLs = {
  /*
   * Please rearrange urls according to your conviniance
   */
  sendQuery:baseURL+'sendQueryToLabAdmin/',
  loginUser: baseURL + "userLoginInternationNumber/",
  regRNLivehealth: baseURL + "registerAPNS/",
  unregRNLivehealth: baseURL + "unregisterAPNS/",

  downloadBillReceipt: baseURLProvider + "billReceiptForPeopleAPI/",

  devId: "&developerId=" + Global.developerId,

  loginURLInternational: baseURL + "userLoginInternationNumber/",
  androidUpdateProfile: baseURL + "androidUpdateProfile/",
  updatePasswordApp: baseURL + "updatePasswordApp/",
  updateProfile: baseURL + "updateProfile/v2/app/",

  offersAndCouponsForUser: baseURL + "getMyCoupons/",
  validateUserCoupon: baseURL + "validateCoupon/",
  fileDownloadPath: "https://s3-ap-southeast-1.amazonaws.com/livehealthuser/",

  checkUserExist: baseURL + "checkUserExist/", // Login number check -> OTP Verify (Login / Signup)
  checkUser: baseURL + "checkUser/v1.1/", // Login number check -> NO OTP -> OTP Verify (Login / Signup)
  resendOTPLogin: baseURL + "requestOTP/app/", // Login Resend OTP
  verifyOTPLogin: baseURL + "verifyOTP/app/", // Login OTP Verification

  // MARK: Forgot Password
  resendOTPForgotPassword: baseURL + "androidForgotPassword/", // Forgot Password OTP Send / Resend
  verifyOTPForgotPassword: baseURL + "androidVerifyOTP/", // Forgot Password OTP Verification
  finishForgotPassword: baseURL + "androidResetPassword/", // Forgot Password

  // MARK: Signup
  TOCURL: baseURL + "terms-and-conditions/",
  resendOTPSignUp: baseURL + "androidResendOTP/", // Sign up OTP Resend
  verifyOTPSignUp: baseURL + "verifySignUpOTP/", // Sign up OTP Verification
  finishSignUp: baseURL + "signUp/app/", // Final Signup

  // MARK: Notification
  regDeviceAPN: baseURL + "registerAPNS/",
  unRegDeviceAPN: baseURL + "unregisterAPNS/",
  regDeviceGCM: baseURL + "registerGCM/",
  unRegDeviceCGM: baseURL + "unregisterGCM/",

  marketingNotificationAcknowledgement:
    baseURLProvider + "updateCampaignRelation/",
  // MARK: Dashboard
  dashboardLoadingURL: baseURL + "mobileDashboard/",

  // reportList: baseURL + 'userReportList/',
  reportListUpdated: baseURL + "userReportListUpdated/",
  mergeUserApp: baseURL + "mergeUserApp/",
  detachReportUser: baseURL + "detachReportUser/",
  // reportListUpdatedUploaded: baseURL + 'userUploadedReportUpdated/',
  // reportListValues: baseURL + 'getUserReportValues/',
  reportView: baseURL + "userReportView/",
  reportPDFDownload: baseURL + "mobileReportPDF/",
  uploadImageReport: baseURL + "uploadImage/",
  uploadPDFReport: baseURL + "uploadFile/",
  awsMediaPath:
    "https://s3-ap-southeast-1.amazonaws.com/livehealthuser/userside/",
  mobilePDFReportDownload: baseURL + "mobileReportPDF/",
  labDataURL: baseURL + "mobileLabViewDetails/",
  checkFeedbackURL: baseURL + "checkFeedbackAPI/v2/",
  saveFeedbackURL: baseURL + "saveUserFeedback/v2/",

  // MARK: Search Labs
  // **** Deprecated --- searchCenterTestsSpecialityURL: baseURL + 'androidLabNameSearch/',
  searchCenterTestsSpecialityURL: baseURL + "search/1/app/",
  getLabDetails: baseURL + "getLabDetails/",
  getSpecialityLabs: baseURL + "androidSpecialityLabs/",
  getTestLabs: baseURL + "searchTestLabs/",
  getTestLabsWithDictionaryId: baseURL + "search/2/app/",
  getAllUserLabs: baseURL + "getRelatedProvidersList/",
  //    getRecentTestOfRecentlyVisitedLab: baseURL + '/',
  // MARK: Lab offers tests
  userBasedOffers: baseURL + "androidLabOffersList/",
  remainingTests: baseURL + "androidGetAllTest/",
  saveAppointmentURL: baseURL + "androidBookAppointment/",
  saveHomeCollectionURL: baseURL + "androidBookHomeCollection/",

  appointmentList: baseURL + "getAllAppointments/",
  homeCollectionList: baseURL + "getAllHomeCollections/",
  rescheduleAppointment: baseURL + "userRescheduleAppointment/",
  rejectAppointment: baseURL + "userRejectAppointment/",
  confirmAppointment: baseURL + "userConfirmAppointment/",
  updateHomecollection: baseURL + "updateHomecollection/",
  // MARK: Trackers

  trackReportValues: baseURL + "trackReportValues/v1/app/",
  getManualTrackerCategories: baseURL + "getManualTrackerCategories/",
  getManualTrackerSubCategories: baseURL + "getDictionaryViaCategory/",
  getManualReportData: baseURL + "getManualReportData/",
  saveManualReport: baseURL + "saveManualReport/",
  deleteAutoManualReport: baseURL + "deleteTracker/v2/app/",
  searchManualTracker: baseURL + "searchManualTracker/",
  dictionaryDetailsForTracker: baseURL + "dictionaryDetails/v1/app/",
  dictionaryFeedback: baseURL + "dictionaryFeedback/v1/app/",
  saveTrackerData: baseURL + "saveTrackerData/v2/app/",

  getTrackerData: baseURL + "getTrackerData/v2/app/",
  startMonitoringTrack: baseURL + "startMonitoringTrack/v2/app/",
  addRemoveFavoriteTracker: baseURL + "addRemoveFavoriteTracker/",
  saveTrackerData: baseURL + "saveTrackerData/v2/app/",
  deleteTracker: baseURL + "deleteTracker/v3/app/",

  dictionaryDetails: baseURL + "dictionaryDetails/v1/app/",

  // MARK: Payments URL - Paytm
  ChecksumGenerationURL: baseURL + "generateChecksum/",
  ChecksumVerificationURL: baseURL + "androidPaymentCallBack/CAS/Response/",
  callbackURLPaytmNew: baseURL + "paytmCallbackPendingBillClear/CAS/Response",
  callbackURLPaytm: baseURL + "androidPaymentCallBack/CAS/Response",

  // MARK: Payments URL - Citrus
  billURLCitrus: baseURL + "citrusBillGenerator/",
  newBillURLCitrus: baseURL + "citrusBillGeneratorPendingBillClear/",
  // MARK: Payments URL - RazorPay
  razorpayCaptureAppAppointment: baseURL + "razorpayCaptureAppAppointment/",
  razorpayCaptureAppHomeCollection:
    baseURL + "razorpayCaptureAppHomeCollection/",
  razorpayReportCaptureApp: baseURL + "razorpayReportCaptureApp/",

  // MARK: Tranasection URLs
  saveTransactionURL: baseURL + "appTransactions/",
  billingHistory: baseURL + "getAllTransaction/", // /old/// baseURL + 'getAllTransactions/',

  // MARK: Checksum URLs - Paytm
  paytmChecksumGenerationURL:
    "https://pguat.paytm.com/paytmchecksum/paytmCheckSumGenerator.jsp",
  paytmChecksumVerificationURL:
    "https://pguat.paytm.com/paytmchecksum/paytmCheckSumVerify.jsp",
  // MARK: Production Server URL - Paytm - SHOULD NOT BE USED OUTSIDE PAYTM SDK
  PaytmProductionServerURL:
    "https://secure.paytm.in/oltp-web/processTransaction",

  // MARK: Location URLs
  latlngOrAddressLookup:
    "https://maps.googleapis.com/" + "maps/api/geocode/json?",
  getAllCities: baseURL + "cityList/",

  // MARK: Information center URL
  infoCenterSearch: baseURL + "dictionaryTestSearchAndroid/",
  // https://livehealth.in/dictionaryTestSearchAndroid/panel/?userToken: c1bc94e6-bad2-11e5-a1ca-00163e12bff6&gt
  infoCenterTestInfoDetails: baseURL + "getDictionaryTestDetailsAndroid/",
  getProfileSummary: baseURL + "getProfileSummary/",
  getLivehealthLogo: baseURL + "media/images/logo_notext_green.png",
  trackPayments: baseURL + "trackPayments/",

  //appointment Categories
  getBookingCategories: baseURL + "getBookingCategories/",
  getTests: baseURL + "getLabwiseTests/v2/",
  bookings: baseURL + "bookings/v2/",
  searchTests: baseURL + "searchTests/v2/",
  ratePhlebotomist: baseURL + "ratePhlebotomist/v1/",
  createNewOrder: baseURL + "createNewOrder/v1/app/",

  //Dmographic Details
  savePatientDemographicDetails: baseURL + "savePatientDemographicDetails/"

  // https://livehealth.in/getDictionaryTestDetailsAndroid/?userToken: c1bc94e6-bad2-11e5-a1ca-00163e12bff6&dictionaryId: 356&gt
  //    }
};
module.exports = {
  URLs,
  baseURL,
  baseURLProvider
};
