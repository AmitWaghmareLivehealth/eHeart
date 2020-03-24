
import type, { Action } from '../actions/types'
import { SET_COUNT } from '../actions/user'

export type State = {
    userCount: number
}

const initialState = {
  userCount: 0
};

export default function (state:State = initialState, action:Action): State {
  if (action.type === SET_COUNT) {
    return {
      ...state,
      userCount: action.payload
    }
  }
  return state
}
