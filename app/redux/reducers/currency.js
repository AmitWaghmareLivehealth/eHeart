import { CURRENCY} from '../actions/types'


const INITIAL_STATE = {
  currency: '\u20B9'
};


export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case CURRENCY:
    return   {...state, currency: action.payload}
    default:
      return state
  }
}
