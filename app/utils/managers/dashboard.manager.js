import { URLs } from '../const/urls'
import _RESTRequest from '../handlers/network'
import Alert from './alert.manager'
import isPositiveResult, { handleErrorWithEmptyResponse } from './common.manager'
import { stringsUserDefaults } from '../const/strings'
import UserDefaults from '../handlers/localstorage'

export async function getReportDetails () {
  return UserDefaults.get(stringsUserDefaults.userToken).then((token) => {
    /*
    return new Promise(function (resolve, reject) {
      resolve({ success: true, response: { code: 302 } })
    })
    *//* data / user / 0 / com.livehealth / files */
    let params = 'token=' + token || ''
    return _RESTRequest('POST', URLs.dashboardLoadingURL, params)
      .then((result) => {
        if (!isPositiveResult(result)) {
          result.success = false
        }
        return result
      }).catch(handleErrorWithEmptyResponse)
    // */
  }).catch(handleErrorWithEmptyResponse)
}
