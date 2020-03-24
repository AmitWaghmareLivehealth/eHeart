import { Alert } from 'react-native'
import { logout } from './login.manager'
import { stringsAlert } from '../const/strings'

export function AlertGeneric (
  header = stringsAlert.generic.header,
  message = stringsAlert.generic.message,
  actionArray = [{text: 'OK', onPress: () => {}}]) 
{
  Alert.alert(
    header,
    message,
    actionArray,
    { cancelable: true }
  )
}

export function AlertGenericWithTimeout (alert,
  actionArray = [{text: 'OK', onPress: () => {}}],
  timeOut = 1000) {
  setTimeout(() => {
    Alert.alert(
      alert.header,
      alert.message,
      actionArray
    )
  }, timeOut)
}

export function getAlertMessage (code) {
  var msg = stringsAlert.generic
  var actionArray = []
  var okAction = () => {}
  switch (code) {
    case 109:
      msg = stringsAlert.noInternet
      break
    case 2002:
      msg = stringsAlert._OTPsendSuccess
      break
    case 404:
      msg = stringsAlert._404NoUserApp
      okAction = () => {
        logout()
      }
      break
    case 3022:
    case 4042:
      msg = stringsAlert._OTPwrong
      break
    case 4043:
      msg = stringsAlert._404UserNotExistForgotPassword
      break
    case 408:
      msg = stringsAlert._408SlowInternet
      break
    case 5002:
      msg = stringsAlert._500IncorrectPassword
      break
    case 5003:
      msg = stringsAlert._500OTPsendFailure
      break
    default: break
  }
  actionArray.push({ text: 'OK', onPress: okAction })
  msg.actionArray = actionArray
  return msg
}

export default function LHTAlert (code) {
  let msg = getAlertMessage(code)
  Alert.alert(
    msg.header,
    msg.message,
    msg.actionArray
  )
}
