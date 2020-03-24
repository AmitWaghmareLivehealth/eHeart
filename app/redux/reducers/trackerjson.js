
import { TrackerAction, SET_JSON, GET_JSON } from '../actions/types'
import { getJson, setJson } from '../actions/trackerjson'

export type State = {
  trackerJson: string
}

const initialState = {
  trackerJson: '[]'
}

export default function (state:State = initialState, action: TrackerAction): State {
  if (action.type === GET_JSON) {
    return state
  }

  if (action.type === SET_JSON) {
    return {
      ...state,
      trackerJson: action.payload
    }
  }
  return state
}
