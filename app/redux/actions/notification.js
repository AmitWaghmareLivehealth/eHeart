import {FLAG, SetNotification} from './types'


  export function setNotification (json): SetNotification {
    return {
      type: FLAG,
      payload: json
    }
  }
   
