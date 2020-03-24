
import { TrackerAction, SET_JSON, GET_JSON, GET_UPDATED, SET_UPDATED } from './types'

export function getJson ():String {
  return {
    type: GET_JSON
  }
}

export function setJson (json: string):TrackerAction {
  return {
    type: SET_JSON,
    payload: json
  }
}
