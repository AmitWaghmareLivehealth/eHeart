import {Dimensions, Platform} from 'react-native';

const deviceHeight = Dimensions.get('window').height;
const deviceWidth = Dimensions.get('window').width;
const dimen = Dimensions.get('window');

const Global = {
  labId: 25,
  // labId: 1837,
  labName:'Aspira Diagnostics',
  // labId: 1614,
  screenWidth: deviceWidth,
  screenHeight: deviceHeight,
  iOSPlatform: Platform.OS === 'ios',
  osVersion: Platform.Version > 22,
  // developerId: 'c4a03b1a-676a-11ea-bc55-0242ac130003',
  developerId: 1,

  currencySymbol: '\u20B9',
  LTHDateFormat: "yyyy-MM-dd'T'HH:mm:ss'Z'",
  LTHDateFormatMoment: 'YYYY-MM-DDTHH:mm:ss',
  dateFormatDisplay: 'Do MMM YYYY',
  splitter: '$--$',
  splitter2: '-$$-',
  appVersion: '1.0',
  regexMultiSpace: '/s+/g', // standered-no-useless-escape
  /* VERY IMPORTANT
     Production                 : DebugModeOff = true
     Test and Build Environment : DebugModeOff = false
     */
  DebugModeOff: true, // false for testing true for live
  isIphoneX:
    Platform.OS === 'ios' &&
    !Platform.isPad &&
    !Platform.isTVOS &&
    (dimen.height === 812 || dimen.width === 812),
   aboutUs: `AspiraHealth is an exclusive app that’s specifically built to track your diagnostic tests at Aspira Pathlabs easier. It’s an exclusive app that was built with the intention to provide mobile tracking of diagnostic tests. This makes the process for our customers, hassle free.

    (AspiraHealth is a product of Aspira Pathlab and Diagnostics which is an inventive venture in quality healthcare and the pioneer in comprehensive reliance on technological automation. For our partner app, check AspiraDr)
    
    AspiraHealth is designed to track, save and share your diagnostic reports at our pathlabs.
    
    Having to visit pathlabs with the impending anxiety of the test results can be very stressful and time consuming. So, don’t visit us. We’ll bring you your test results ON YOUR PHONE. AspiraHealth is designed for exactly that.
    
    Here’s How
    Find an Aspira registered healthcare provider/lab near you : SEARCH SIMPLER
    Book an appointment for Home/Lab visits : HASSLE FREE BOOKINGS
    Check status of appointments : REAL TIME APPROVALS DIRECTLY FROM LAB CENTRES
    Track your tests and reports right on your phone : TRACK RESULTS
    Understand your reports with our indicators : INTERPRET RESULTS BETTER
    Track health with automated archives : DOWNLOAD/SAVE/SHARE ARCHIVED REPORTS
    
    If you’ve not tried Aspira yet, and just need a regular health tracking system, just enter your diagnostic test results manually and we’ll keep track of your health.`,
};

export default Global;
