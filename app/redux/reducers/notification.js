
import { FLAG} from '../actions/types'


const INITIAL_STATE = {
  text: ''
};


export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case FLAG:
    return   {...state, text: action.payload}
    default:
      return state
  }
}
