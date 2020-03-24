import {UNREAD, SetUnreadFlag} from './types'


  export function setUnreadFlag (json): SetUnreadFlag {
    return {
      type: UNREAD,
      payload: json
    }
  }
   
