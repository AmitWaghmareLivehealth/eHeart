
import { UDAction } from './types'

export function setUserDefault (val):UDAction {
  return {
    type: UDAction.SET_UD,
    payload: { val: val }
  }
}

export function setUserDefaultValue (key, val):UDAction {
  return {
    type: UDAction.SET_UD_VAL,
    payload: { key: key, val: val }
  }
}

export function setReduxUserDefaults (val): UDAction {
  return {
    type: UDAction.RESET_UD_STATE,
    payload: {}
  }
}

export function syncUserDefaultsToStorage (val): UDAction {
  return {
    type: UDAction.SYNC_UD_WITH_STORE,
    payload: { }
  }
}
