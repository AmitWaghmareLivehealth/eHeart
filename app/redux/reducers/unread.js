
import { UNREAD} from '../actions/types'


const INITIAL_STATE = {
  flag: 0
};


export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case UNREAD:
    return   {...state, flag: action.payload}
    default:
      return state
  }
}
