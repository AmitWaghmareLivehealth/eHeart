
import { ReportListAction, SET_UNREAD } from './types'

// export function getUnread ():String {
//   return {
//     type: GET_LIST
//   }
// }

export function setUnread (unreadFlag: boolean): ReportListAction {
  return {
    type: SET_UNREAD,
    payload: unreadFlag
  }
}
