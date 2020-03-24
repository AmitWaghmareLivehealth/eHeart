
import { UDAction } from '../actions/types'

import { UserDefaults, stringsUserDefaults } from '../../utils'

function handleError (error) {
  console.log(error)
}

const initialState = {
  userdefaults: {
    Hello: ''
  }
}

export default function (state = initialState, action) {
  switch (action.type) {
    case UDAction.SET_UD:
      return {
        ...state,
        userdefaults: action.payload.val || ''
      }
    case UDAction.SET_UD_VAL:
      let newState = state
      if (newState.userdefaults === undefined) {
        newState.userdefaults = { }
      }
      newState.userdefaults[action.payload.key] = action.payload.val
      return newState
    case UDAction.RESET_UD_STATE:
      let newState2 = state
      if (newState2.userdefaults === undefined) {
        newState2.userdefaults = {}
      }
      for (var key in stringsUserDefaults) {
        if (Object.prototype.hasOwnProperty.call(stringsUserDefaults, key)) {
          newState2.userdefaults[key] = UserDefaults.get(key).then(result => result || '').catch(handleError)
        }
      }
      return newState
    case UDAction.SYNC_UD_WITH_STORE:
      async () => {
        for (var key in state.userdefaults) {
          if (Object.prototype.hasOwnProperty.call(state.userdefaults, key)) {
            UserDefaults.set(key, state.userdefaults[key]).then(result => result).catch(handleError)
          }
        }
      }
      return state
    default: return state
  }
}
