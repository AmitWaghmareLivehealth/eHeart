
import type { Action } from './types'

export const SET_COUNT = 'SET_COUNT'

export function setCount(count:int):Action {
  return {
    type: SET_COUNT,
    payload: count
  }
}
