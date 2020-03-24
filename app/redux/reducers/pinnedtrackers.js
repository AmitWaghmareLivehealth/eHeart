
import { PinnedAction, SET_LIST, GET_LIST } from '../actions/types'
import { getList, setList } from '../actions/pinnedtrackers'

export type State = {
  pinnedTrackers: string
}

const initialState = {
  pinnedTrackers: []
}

export default function (state:State = initialState, action: PinnedAction): State {
  if (action.type === GET_LIST) {
    return state
  }

  if (action.type === SET_LIST) {
    return {
      ...state,
      pinnedTrackers: action.payload
    }
  }
  return state
}
