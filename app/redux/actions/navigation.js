import { NavAction } from './types'

export function popToRoute (key):Action {
  return {
    type: NavAction.POP_TO_ROUTE,
    payload: { key: key }
  }
}

export function popRoute ():Action {
  return {
    type: NavAction.POP_ROUTE,
    payload: {}
  }
}

export function pushRoute (key):Action {
  return {
    type: NavAction.PUSH_NEW_ROUTE,
    payload: { key: key }
  }
}

export function replaceRoute (key, newKey):Action {
  return {
    type: NavAction.REPLACE_ROUTE,
    payload: { key: key, newKey: newKey }
  }
}

export function replaceOrPushRoute(key, newKey):Action {
  return {
    type: NavAction.REPLACE_OR_PUSH_ROUTE,
    payload: { key: key, newKey: newKey }
  }
}
