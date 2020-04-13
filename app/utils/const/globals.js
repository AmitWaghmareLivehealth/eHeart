import {Dimensions, Platform} from 'react-native';

const deviceHeight = Dimensions.get('window').height;
const deviceWidth = Dimensions.get('window').width;
const dimen = Dimensions.get('window');

const Global = {
  labId: 1614,
//   labId: 1837,
  labName:'eHeart',
  // labId: 1614,
  screenWidth: deviceWidth,
  screenHeight: deviceHeight,
  iOSPlatform: Platform.OS === 'ios',
  osVersion: Platform.Version > 22,
  developerId: 'c4a03b1a-676a-11ea-bc55-0242ac130003',
//   developerId: 1,

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
   aboutUs: `Rana Diagnostics is a popular location in Amritsar for more than twenty five years. 
   
   Dr. Amrita Rana is an acknowledged authority in Sonolography & Foetal medicine.
   
   Dr.  Parminder Singh Rana has been renowned in the field of Echocardiography especially in Dobutamine Stress echo.
   
   eHeart Doorstep Diagnosis is an innovative use of medical technology along with information & software system for segregation of normal population from one with abnormal findings for saving precious lives by timely coordination of trained paramedics in remote & rural areas with centralized experts . 
   `,
};

export default Global;
