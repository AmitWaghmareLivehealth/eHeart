
import { ReportListAction, SET_UNREAD } from '../actions/types'
import { setUnread } from '../actions/reportlist'

export type State = {
  unreadFlag: boolean
}

const initialState = {
  unreadFlag: false
}

export default function (state:State = initialState, action: ReportListAction): State {
  if (action.type === SET_UNREAD) {
    return {
      ...state,
      unreadFlag: action.payload
    }
  }
  return state
}
