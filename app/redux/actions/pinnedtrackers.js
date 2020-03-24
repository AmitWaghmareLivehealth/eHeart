
import { PinnedAction, SET_LIST, GET_LIST } from './types'

export function getList ():String {
  return {
    type: GET_LIST
  }
}

export function setList (list: string):PinnedAction {
  return {
    type: SET_LIST,
    payload: list
  }
}
