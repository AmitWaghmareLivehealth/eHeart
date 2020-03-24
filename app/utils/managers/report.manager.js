import moment from 'moment'
import _ from 'underscore'

import Alert from './alert.manager'
import isPositiveResult, { handleErrorWithEmptyResponse } from './common.manager'

import { URLs } from '../const/urls'
import strings, { stringsUserDefaults } from '../const/strings'
import Global from '../const/globals'

import _RESTRequest from '../handlers/network'
import UserDefaults from '../handlers/localstorage'
import downloadFile, { uploadFile } from '../handlers/network.image'


export async function getReports (_this): Promise<Response> {
  return UserDefaults.get(stringsUserDefaults.userToken).then((token) => {
    let params = 'userToken=' + token || ''
    return _RESTRequest(_this,'POST', URLs.reportListUpdated, params)
    .then((result) => {
      if (!isPositiveResult(result)) {
        result.success = false
        Alert(result.response.code || 0)
        return result
      } else {
        return this.renderReportList(result.response.data, result.response.uploadedData)
      }
    }).catch(handleErrorWithEmptyResponse)
  //*/
  }).catch(handleErrorWithEmptyResponse)
}

export async function renderReportList (data: Array, uploadedData: Array, pendingFlag) {
  return UserDefaults.get(stringsUserDefaults.userName).then((userName) => {
    try {
      var allRegularReports = data.filter((item) => {
        if (pendingFlag) {
          if (item.isDismissed === 0 & item.reportStatus !== 1) {
            if (item.reportId) {
              return true
            } else {
              return false
            }
          }
          return false
        } else {
          if (item.isDismissed === 0 & item.reportStatus === 1) {
            return true
          }
          return false
        }
      })
      allRegularReports.push.apply(allRegularReports, uploadedData)
      var dateFormat = 'YYYY-MM-DDTHH:mm:ssZ'
      var uploadedReportString = 'Uploaded Report'
      var resultDict = { }
      var isRefZeroKey = ''
      var isRefZeroUserDetailsId = 0
      _.chain(allRegularReports)
      .groupBy((report) => {
        let labName = (report.labForId) ? report.labForId.labName : uploadedReportString
        report.reportDateString = (labName === uploadedReportString) ? report.uploadDate : report.reportDate
        report.reportDateString = report.reportDateString.substring(0, 20)
        var isReferral = report.isReferral || '0'
        var fullName = (report.fullName || userName).replace('-', '').trim()
        fullName = (fullName.length > 1) ? fullName : userName
        var userDetailsId = (report.userDetailsId || {}).id
        report.reportDateDateFormat = moment(report.reportDateString, dateFormat).utc()
        return report.reportDateDateFormat.local().startOf('day').format(Global.dateFormatDisplay) +
        Global.splitter + labName +
        Global.splitter + isReferral +
        Global.splitter + fullName +
        Global.splitter + userDetailsId
      }).map((section, dateAndLab) => {
        let dateAndLabSep = dateAndLab.split(Global.splitter)
        var obj = {
          reportDate: moment(dateAndLabSep[0] || '', Global.dateFormatDisplay),
          labName: (dateAndLabSep[1] || ''),
          dateAndLab: dateAndLab,
          section: section,
          isReferral: (dateAndLabSep[2] || '0'),
          fullName: dateAndLabSep[3],
          userDetailsId: dateAndLabSep[4]
        }
        var key = obj.fullName.trim() + Global.splitter + obj.userDetailsId

        if (obj.isReferral === '0' && isRefZeroKey.length === 0 && obj.userDetailsId) {
          isRefZeroKey = key
          isRefZeroUserDetailsId = obj.userDetailsId
        }

        if (isRefZeroKey.length > 0 && (isRefZeroUserDetailsId === obj.userDetailsId || obj.userDetailsId === 'undefined')) {
          if (!resultDict[isRefZeroKey]) {
            // Create an entry in the map for the category if it hasn't yet been created
            resultDict[isRefZeroKey] = []
          }
          resultDict[isRefZeroKey].push(obj)
        } else {
          if (!resultDict[key]) {
            // Create an entry in the map for the category if it hasn't yet been created
            resultDict[key] = []
          }
          resultDict[key].push(obj)
        }
      })

      Object.keys(resultDict).forEach(function (key) {
        var allReportSortedCatMap = {} // Create the blank map
        resultDict[key].sort((a, b) => {
          return moment.utc(b.reportDate).diff(moment.utc(a.reportDate))
        })
        resultDict[key].forEach((reportSecObj) => {
          if (!(allReportSortedCatMap[reportSecObj.dateAndLab])) {
            // Create an entry in the map for the category if it hasn't yet been created
            allReportSortedCatMap[reportSecObj.dateAndLab] = []
          }
          allReportSortedCatMap[reportSecObj.dateAndLab] = reportSecObj.section
        })
        resultDict[key] = allReportSortedCatMap
      })
      var result = {
        response: {
          allReportSortedCatMap: resultDict
        },
        success: true
      }
      result.response.activeUserSection = (isRefZeroKey.length > 0) ? isRefZeroKey : Object.keys(resultDict).length > 0 ? Object.keys(resultDict)[0] : ''
      return result
      // this.props.setList(allReportSorted)
    } catch (error) {
      console.error(error)
      return {
        response: {
          allReportSortedCatMap: []
        },
        success: true
      }
    }
  }).catch(handleErrorWithEmptyResponse)
}


export async function getReportDetails (reportId, _this): Promise<Response> {
  return UserDefaults.get(stringsUserDefaults.userToken).then((token) => {
    /*
    return new Promise(function (resolve, reject) {
      resolve({ success: true, response: { code: 302 } })
    })
    *//* data / user / 0 / com.livehealth / files */
    // let params = 'userToken=2261ac74-4528-11e7-a72b-0a2ce1603801'
    // reportId = 555851
    let params = 'userToken=' + token || ''
    return _RESTRequest(_this,'POST', URLs.reportView + reportId + '/', params)
      .then((result) => {
        if (!isPositiveResult(result)) {
          result.success = false
          Alert(result.response.code || 0)
        }
        return result
      }).catch(handleErrorWithEmptyResponse)
  }).catch(handleErrorWithEmptyResponse)
}

export async function mergeReport (primaryUserDetailsId, secondaryUserDetailsId, _this) {
  return UserDefaults.get(stringsUserDefaults.userToken).then((token) => {
    /*
    return new Promise(function (resolve, reject) {
      resolve({ success: true, response: { code: 302 } })
    })
    */
    let params = 'userToken=' + (token || '') + '&secondaryUserDetailsId=' + secondaryUserDetailsId + '&primaryUserDetailsId=' + primaryUserDetailsId
    return _RESTRequest(_this,'POST', URLs.mergeUserApp, params)
    .then((result) => {
      if (!isPositiveResult(result)) {
        result.success = false
        Alert(result.response.code || 0)
      }
      return result
    }).catch(handleErrorWithEmptyResponse)
  }).catch(handleErrorWithEmptyResponse)
}

export async function detachReport (billId, _this) {
  return UserDefaults.get(stringsUserDefaults.userToken).then((token) => {
    let params = 'token=' + (token || '') + '&billId=' + billId
    return _RESTRequest(_this, 'POST', URLs.detachReportUser, params)
    .then((result) => {
      if (!isPositiveResult(result)) {
        result.success = false
        Alert(result.response.code || 0)
      }
      return result
    }).catch(handleErrorWithEmptyResponse)
  }).catch(handleErrorWithEmptyResponse)
}

export async function downloadReportImage (path, id) {
  return downloadFile(URLs.awsMediaPath + path, strings.imageTestOrPDFPath + id + '.' + (path.split('.').pop()))
  .then(response => {
    return response
  }).catch(handleErrorWithEmptyResponse)
}

export async function downloadPDF (reportId) {
  return UserDefaults.get(stringsUserDefaults.userToken).then((token) => {
    let urlForReportPDFDownload = URLs.mobilePDFReportDownload + '?userToken=' + token + '&userReportId=' + reportId

    if (Global.iOSPlatform) {
      return downloadFile(urlForReportPDFDownload, strings.labReportPDFPath + reportId + '.pdf')
      .then(result => {
        return result
      }).catch(handleErrorWithEmptyResponse)
    } else {
      return { success: true, response: { path: urlForReportPDFDownload } }
    }
  }).catch(handleErrorWithEmptyResponse)
}

export async function uploadReport (isPDF = false, title, date, tags, comments, filePath): Promise<Response> {
  return UserDefaults.get(stringsUserDefaults.userToken).then((token) => {
    /*
    return new Promise(function (resolve, reject) {
      resolve({ success: true, response: { code: 302 } })
    })
*/
    let params = 'userToken=' + (token || '') + '&comments=' + (comments || '') + '&uploadDate=' + date + '&reportType=' + (tags || '') + '&title=' + (title || 'User Report')
    return uploadFile(isPDF ? URLs.uploadPDFReport : URLs.uploadImageReport, params, isPDF, filePath)
      .then((result) => {
        if (!isPositiveResult(result)) {
          result.success = false
          //Alert(result.response.code || 0)
        }
        return result
      }).catch(handleErrorWithEmptyResponse)
  }).catch(handleErrorWithEmptyResponse)
}
