import {URLs} from '../const/urls';
import _RESTRequest from '../handlers/network';
import Alert, {getAlertMessage} from './alert.manager';
import {stringsUserDefaults} from '../const/strings';
import UserDefaults from '../handlers/localstorage';
import DeviceInfo from 'react-native-device-info';
import isPositiveResult from './common.manager';
import Routes from '../const/routes';
import {handleErrorWithEmptyResponse, handleError} from './common.manager';
import Intercom from 'react-native-intercom';
import {init, regLiveHealthServer} from '../handlers/notification.remote';

function getDeviceId() {
  var deviceId = DeviceInfo.getUniqueId();
  if (!deviceId) {
    deviceId = 'SIMULATOR';
  }
  deviceId = deviceId.replace('-', '').replace(' ', '');
  console.log('Device Id ', deviceId);
  return deviceId;
}

async function requestOTPToVerifyMobile(
  mobileNumber,
  countrycode,
): Promise<Response> {
  let params = 'contact=' + mobileNumber + '&countryCode=' + countrycode;
  /*
  return new Promise(function (resolve, reject) {
    resolve({ success: true, response: { code: 302 } })
  })
  /**/
  var _this = '';
  return _RESTRequest(_this, 'POST', URLs.checkUser, params)
    .then(result => {
      if (!isPositiveResult(result, [200, 404])) {
        result.success = false;
        //  Alert(result.response.code || 0)
      }
      return result;
    })
    .catch(handleErrorWithEmptyResponse);
}

async function saveSmallLoginData(data, _this) {
  // For quickacess
  // init(data.token || '')
  // init()
  try {
    var gcmIdApns = '';
    UserDefaults.get(stringsUserDefaults.gcmId)
      .then(gcmId => {
        if (gcmId) {
          gcmIdApns = gcmId;
          regLiveHealthServer(gcmIdApns, data.token || '', _this);
        }
      })
      .catch(error => {
        console.error(error);
      });
  } catch (error) {
    console.error(error);
  }

  try {
    Intercom.registerIdentifiedUser({
      userId: (data.user.fullName || '').trim(),
    });
  } catch (error) {
    console.log(error);
  }

  try {
    var city = '';
    try {
      city = data.user.city;
    } catch (error) {
      console.error(error);
    }

    Intercom.updateUser({
      email: data.user.user.email,
      contact: data.user.contact,
      city: city,
    });
  } catch (error) {
    console.log(error);
  }

  if (data.token || ''.length > 0) {
    UserDefaults.set(stringsUserDefaults.userToken, data.token || '');
    UserDefaults.set(stringsUserDefaults.user, data.user);
    UserDefaults.set(stringsUserDefaults.userDetailsId, data.user.id || 0);
    UserDefaults.set(
      stringsUserDefaults.userName,
      data.user.fullName.trim() || '',
    );
    UserDefaults.set(
      stringsUserDefaults.userDesignation,
      data.user.designation.trim() || '',
    );
    UserDefaults.set(
      stringsUserDefaults.userCountryCode,
      data.user.countryCode || '',
    );
    UserDefaults.set(stringsUserDefaults.userContact, data.user.contact || '');
    UserDefaults.set(stringsUserDefaults.userEmail, data.user.user.email || '');
    UserDefaults.set(stringsUserDefaults.userAddress, data.user.city || '');
    UserDefaults.set(stringsUserDefaults.userSex, data.user.sex || '');
    UserDefaults.set(
      stringsUserDefaults.userDateOfBirth,
      data.user.dateOfBirth || '',
    );
    UserDefaults.set(
      stringsUserDefaults.currentProfilePicURLFromWeb,
      data.user.profilepic || '',
    );
    UserDefaults.set(stringsUserDefaults.reportnotification_pref, true);
    UserDefaults.set(stringsUserDefaults.promotionalnotification_pref, true);
    UserDefaults.set(stringsUserDefaults.appointmentnotification_pref, true);
    UserDefaults.set(stringsUserDefaults.tipCount, 1);
    UserDefaults.set(stringsUserDefaults.tempPassword, data.user.tempPassword);

    UserDefaults.set(
      stringsUserDefaults.weight,
      data.weight ? data.weight : '',
    );
    UserDefaults.set(
      stringsUserDefaults.height,
      data.height ? data.height : '',
    );
  }

  if (data.demographics) {
    if (data.demographics.found) {
      UserDefaults.set(
        stringsUserDefaults.demographics,
        data.demographics || '',
      );

      // UserDefaults.set(stringsUserDefaults.activenessLevel,
      //  data.demographics._source.activenessLevel || '')

      // UserDefaults.set(stringsUserDefaults.stressLevel,
      //    data.demographics._source.stressLevel || '')

      UserDefaults.set(
        stringsUserDefaults.frequencyOfHealthCheckup,
        data.demographics._source.frequencyOfHealthCheckup || '',
      );

      UserDefaults.set(
        stringsUserDefaults.frequencyOfHealthCheckup_date,
        data.demographics._source.frequencyOfHealthCheckup_date || '',
      );

      UserDefaults.set(
        stringsUserDefaults.onMedications,
        data.demographics._source.onMedications || '',
      );

      UserDefaults.set(
        stringsUserDefaults.onMedications_date,
        data.demographics._source.onMedications_date || '',
      );

      UserDefaults.set(
        stringsUserDefaults.hasInsurance,
        data.demographics._source.hasInsurance,
      );

      UserDefaults.get(stringsUserDefaults.hasInsurance).then(insurance => {
        console.log('HAS INSURANCE', insurance);
      });

      UserDefaults.set(
        stringsUserDefaults.hasInsurance_date,
        data.demographics._source.hasInsurance_date || '',
      );

      UserDefaults.set(
        stringsUserDefaults.insuranceName,
        data.demographics._source.insuranceName || '',
      );

      UserDefaults.set(
        stringsUserDefaults.bloodGroup,
        data.demographics._source.bloodGroup || '',
      );

      UserDefaults.set(
        stringsUserDefaults.consumesAlcohol,
        data.demographics._source.consumesAlcohol || '',
      );

      UserDefaults.set(
        stringsUserDefaults.industryType,
        data.demographics._source.industryType || '',
      );

      UserDefaults.set(
        stringsUserDefaults.occupation,
        data.demographics._source.occupation || '',
      );

      UserDefaults.set(
        stringsUserDefaults.isChronic,
        data.demographics._source.isChronic || '',
      );

      UserDefaults.set(
        stringsUserDefaults.isDiabetic,
        data.demographics._source.isDiabetic || '',
      );

      UserDefaults.set(
        stringsUserDefaults.isSmoker,
        data.demographics._source.isSmoker || '',
      );
    }
  }

  if (data.activenessLevels) {
    UserDefaults.set(
      stringsUserDefaults.activenessLevel,
      data.activenessLevels || '',
    );
  }

  if (data.stressLevels) {
    UserDefaults.set(stringsUserDefaults.stressLevel, data.stressLevels || '');
  }
}

async function login(
  mobileNumber,
  countrycode,
  password = '',
  isAuthenticated = 0,
  showAlert,
  _this,
): Promise<Response> {
  let deviceId = getDeviceId();
  let params =
    'username=' +
    countrycode +
    mobileNumber +
    '&password=' +
    password +
    '&gcmId=&isAuthenticated=' +
    isAuthenticated +
    '&deviceId=' +
    deviceId;
  /*
  return new Promise(function (resolve, reject) {
    resolve({ success: true, response: { code: 302 } })
  })
  */
  return _RESTRequest(_this, 'POST', URLs.loginURLInternational, params)
    .then(result => {
      if (!isPositiveResult(result)) {
        result.success = false;
        var alertNum = result.response.code || 0;
        if (alertNum === 500) {
          alertNum = 5002;
        }
        if (showAlert && alertNum !== 0) {
          Alert(alertNum);
        } else {
          result.message = getAlertMessage(alertNum).message;
        }
      } else {
        saveSmallLoginData(result.response, _this);
      }
      return result;
    })
    .catch(handleErrorWithEmptyResponse);
}

async function verifyOTP(
  mobileNumber,
  countrycode,
  otp,
  isUserExist,
  isFromForgotPass,
  showAlert,
  _this,
): Promise<Response> {
  // login(mobileNumber, countrycode, '', 1)
  /*
  return new Promise(function (resolve, reject) {
    resolve({ success: true, response: { code: 200 } })
  })
/*
verifyOTPForForgotPassword
                  let params = "contact=\(self.contactNumber)&verify_key=\(otp)&countryCode=\(self.countryCode)"
verifyOTPForLogin
                let param = "username=\(self.countryCode)\(self.contactNumber)&verifyKey=\(self.otpString)"
verifyOTPForSignUp
                let params = "contact=\(self.contactNumber)&verifyKey=\(self.otpString)"
*/
  var params =
    'username=' + countrycode + mobileNumber + '&verifyKey=' + otp + URLs.devId;
  var url = URLs.verifyOTPLogin;
  if (!isUserExist) {
    params =
      'contact=' +
      mobileNumber +
      '&countryCode=' +
      countrycode +
      '&verifyKey=' +
      otp;
    url = URLs.verifyOTPSignUp;
  } else if (isFromForgotPass) {
    params =
      'contact=' +
      mobileNumber +
      '&countryCode=' +
      countrycode +
      '&verify_key=' +
      otp;
    url = URLs.verifyOTPForgotPassword;
  }

  return _RESTRequest(_this, 'POST', url, params)
    .then(result => {
      var alertNum = 0;
      if (!isPositiveResult(result) && url === URLs.verifyOTPForgotPassword) {
        let code = result.response.code || 0;
        result.success = false;
        if (code === 404) {
          alertNum = 4043;
        } else if (code === 302) {
          alertNum = 3022;
        } else {
          alertNum = 500;
        }
      } else if (!isPositiveResult(result)) {
        let code = result.response.code || 0;
        result.success = false;
        if (code === 404) {
          alertNum = 4042; // _WrongOTP
        } else {
          alertNum = 500;
        }
      } else {
        showAlert = false;
        if (url === URLs.verifyOTPLogin) {
          return login(mobileNumber, countrycode, '', 1, showAlert)
            .then(result => {
              return result;
            })
            .catch(handleErrorWithEmptyResponse);
        }
      }
      if (showAlert && alertNum !== 0) {
        Alert(alertNum);
      } else {
        result.message = getAlertMessage(alertNum).message;
      }
      return result;
    })
    .catch(handleErrorWithEmptyResponse);
}

async function resendOTP(
  mobileNumber,
  countrycode,
  isUserExist,
  isFromForgotPass,
  _this,
): Promise<Response> {
  // login(mobileNumber, countrycode, '', 1)
  /*
  return new Promise(function (resolve, reject) {
    resolve({ success: true, response: { code: 200 } })
  })
resendOTPForForgotPassword
            let param2 = "contact=\(self.contactNumber)&countryCode=\(self.countryCode)"
resendOTPForLogin
            let param2 = "username=\(self.contactNumber)&countryCode=\(self.countryCode)"
resendOTPForSignUp
        let params = "mobile=\(self.contactNumber)&countryCode=\(self.countryCode)"
*/
  var params = 'username=' + mobileNumber + '&countryCode=' + countrycode;
  var url = URLs.resendOTPLogin;
  if (!isUserExist) {
    params = 'mobile=' + mobileNumber + '&countryCode=' + countrycode;
    url = URLs.resendOTPSignUp;
  } else if (isFromForgotPass) {
    params = 'contact=' + mobileNumber + '&countryCode=' + countrycode;
    url = URLs.resendOTPForgotPassword;
  }

  return _RESTRequest(_this, 'POST', url, params)
    .then(result => {
      if (!isPositiveResult(result)) {
        result.success = false;
        let code = result.response.code || 0;
        if (code === 500) {
          Alert(5003);
        }
      }
      return result;
    })
    .catch(handleErrorWithEmptyResponse);
}

async function signup(paramDict, _this): Promise<Response> {
  // login(mobileNumber, countrycode, '', 1)
  /*
  return new Promise(function (resolve, reject) {
    resolve({ success: true, response: { code: 200 } })
  })
signUp
   let param = "fullName=\(self.userFromSegue.fullName)&password=\(self.userFromSegue.password)&countryCode=\(self.userFromSegue.countryCode)&contact=\(self.userFromSegue.mobile)&gender=\(self.userFromSegue.gender)&email=\(self.userFromSegue.email)&dob=\(self.userFromSegue.dob)&age=\(self.userFromSegue.age)&designation=\(self.userFromSegue.designation)"
*/
  var params =
    'fullName=' +
    paramDict.name +
    '&password=' +
    paramDict.pass +
    '&countryCode=' +
    paramDict.countryCode +
    '&contact=' +
    paramDict.mobile +
    '&gender=' +
    paramDict.sex +
    '&email=' +
    paramDict.email +
    '&dob=' +
    paramDict.bdate +
    '&age=' +
    paramDict.age +
    '&designation=' +
    paramDict.designation;

  return _RESTRequest(_this, 'POST', URLs.finishSignUp, params)
    .then(result => {
      if (!isPositiveResult(result)) {
        result.success = false;
        Alert(result.response.code || 0);
      } else {
        saveSmallLoginData(result.response, _this);
      }
      return result;
    })
    .catch(handleErrorWithEmptyResponse);
}

async function resetForgotPass(paramDict, _this) {
  /*
        var params = "contact=\(mobileNumber)&verify_key=\(otp)&password=\(pass)&countryCode=\(countryCode)&gcmId=&deviceId="
*/
  let deviceId = getDeviceId();

  var params =
    '&contact=' +
    paramDict.mobile +
    '&verify_key=' +
    paramDict.otp +
    '&password=' +
    paramDict.pass +
    '&countryCode=' +
    paramDict.countryCode +
    '&gcmId=&deviceId=' +
    deviceId;

  return _RESTRequest(_this, 'POST', URLs.finishForgotPassword, params)
    .then(result => {
      if (!isPositiveResult(result)) {
        /**
         ** STRICT INSTRUCTION -> THIS API USES 'LIVE DB' TO LOGIN
         ** DONT BE SURPRISE IF U GET 404 ON BETA Server. The token generated belongs to LIVE Server.
         **/
        result.success = false;
        Alert(result.response.code || 0);
      } else {
        saveSmallLoginData(result.response, _this);
      }
      return result;
    })
    .catch(handleErrorWithEmptyResponse);
}

async function changeTempPass(param, isNotTemp, _this) {
  return UserDefaults.get(stringsUserDefaults.userToken)
    .then(token => {
      /*
  return new Promise(function (resolve, reject) {
    resolve({ success: true, response: { code: 302 } })
  })
  */ /* data / user / 0 / com.livehealth / files */
      let params = 'userToken=' + (token || '') + '&new=' + param.newPass;
      if (isNotTemp) {
        params = params + '&old=' + param.oldPass;
      }

      return _RESTRequest(_this, 'POST', URLs.updatePasswordApp, params)
        .then(result => {
          if (!isPositiveResult(result)) {
            result.success = false;
          }
          return result;
        })
        .catch(handleErrorWithEmptyResponse);
      //*/h
    })
    .catch(handleErrorWithEmptyResponse);
}

async function logout(_this) {
  Intercom.reset();

  try {
    UserDefaults.get(stringsUserDefaults.userToken)
      .then(token => {
        let params = 'userToken=' + (token || '');
        return _RESTRequest(
          _this,
          'POST',
          URLs.unRegDeviceCGM + token + '/',
          params,
        )
          .then(result => {
            if (!isPositiveResult(result)) {
              result.success = false;
            }
            return result;
          })
          .catch(handleErrorWithEmptyResponse);
      })
      .catch(handleErrorWithEmptyResponse);
  } catch (error) {
    console.error(error);
  }

  UserDefaults.remove(stringsUserDefaults.userToken)
    .then(result => console.log(stringsUserDefaults.userToken + 'removed'))
    .catch(handleError);

  UserDefaults.remove(stringsUserDefaults.pinnedTracker)
    .then(result => console.log(stringsUserDefaults.pinnedTracker + 'removed'))
    .catch(handleError);

  UserDefaults.remove(stringsUserDefaults.dictionaryArray)
    .then(result =>
      console.log(stringsUserDefaults.dictionaryArray + 'removed'),
    )
    .catch(handleError);

  UserDefaults.remove(stringsUserDefaults.demographics)
    .then(result => console.log(stringsUserDefaults.demographics + 'removed'))
    .catch(handleError);

  UserDefaults.remove(stringsUserDefaults.activenessLevel)
    .then(result => console.log(stringsUserDefaults.demographics + 'removed'))
    .catch(handleError);

  UserDefaults.remove(stringsUserDefaults.stressLevel)
    .then(result => console.log(stringsUserDefaults.demographics + 'removed'))
    .catch(handleError);

  UserDefaults.remove(stringsUserDefaults.hasInsurance)
    .then(result => console.log(stringsUserDefaults.hasInsurance + 'removed'))
    .catch(handleError);
  UserDefaults.remove(stringsUserDefaults.hasInsurance_date)
    .then(result =>
      console.log(stringsUserDefaults.hasInsurance_date + 'removed'),
    )
    .catch(handleError);

  UserDefaults.remove(stringsUserDefaults.frequencyOfHealthCheckup)
    .then(result =>
      console.log(stringsUserDefaults.frequencyOfHealthCheckup + 'removed'),
    )
    .catch(handleError);

  UserDefaults.remove(stringsUserDefaults.frequencyOfHealthCheckup_date)
    .then(result =>
      console.log(
        stringsUserDefaults.frequencyOfHealthCheckup_date + 'removed',
      ),
    )
    .catch(handleError);

  UserDefaults.remove(stringsUserDefaults.onMedications)
    .then(result => console.log(stringsUserDefaults.onMedications + 'removed'))
    .catch(handleError);

  UserDefaults.remove(stringsUserDefaults.onMedications_date)
    .then(result =>
      console.log(stringsUserDefaults.onMedications_date + 'removed'),
    )
    .catch(handleError);

  UserDefaults.remove(stringsUserDefaults.height)
    .then(result => console.log(stringsUserDefaults.height + 'removed'))
    .catch(handleError);

  UserDefaults.remove(stringsUserDefaults.weight)
    .then(result => console.log(stringsUserDefaults.weight + 'removed'))
    .catch(handleError);

  // UserDefaults.remove(stringsUserDefaults.gcmId)
  // .then(result => console.log(stringsUserDefaults.gcmId + 'removed'))
  // .catch(handleError)

  setTimeout(() => {
    return;
  }, 50);
}

const isLoggedIn = async () => {
  return UserDefaults.get(stringsUserDefaults.userToken)
    .then(token => {
      return {
        success: (token || '').length > 0,
        response: {token: token},
      };
    })
    .catch(handleErrorWithEmptyResponse);
};

module.exports = {
  isLoggedIn,
  logout,
  signup,
  resendOTP,
  login,
  verifyOTP,
  requestOTPToVerifyMobile,
  changeTempPass,
};
