
import { stringsUserDefaults, stringsAlert } from '../const/strings'
import UserDefaults from '../handlers/localstorage'
import { AlertGeneric } from '../managers/alert.manager'

export function handleError (error, onCompletion = () => { }) {
  console.log(error)
}

export function handleErrorWithMsg (error, header = stringsAlert.generic.header, message = stringsAlert.generic.message) {
  console.log(error)
  AlertGeneric(header, message)
}

export function handleErrorWithEmptyResponse (error) {
  console.log(error)
  return { success: false, response: {} }
}

export function handleErrorWithResponseCode (error, code = 109) {
  console.log(error)
  return { success: false, response: { code: code } }
}

// ****** User Default
export function setReduxUserDefaults () {
  this.props.userdefaults = {}
  for (var key in stringsUserDefaults) {
    if (Object.prototype.hasOwnProperty.call(stringsUserDefaults, key)) {
      this.props.userdefaults[key] = UserDefaults.get(key).then(result => result || '').catch(handleError)
    }
  }
}

export function syncUserDefaultsToStorage () {
  for (var key in this.props.userdefaults) {
    if (Object.prototype.hasOwnProperty.call(this.props.userdefaults, key)) {
      UserDefaults.set(key, this.props.userdefaults[key]).then(result => result).catch(handleError)
    }
  }
}

// result typecheck for every Possible combination
export default function isPositiveResult (result, codeArray = [200]) {
  return (result.success && codeArray.includes(result.response.code || 0))
}
