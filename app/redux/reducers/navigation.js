import { NavigationActions } from 'react-navigation'
import { AllNavActions } from '../actions/types'
import { AppNavigatorStack } from '../../scenes/container/router'
import { Routes } from '../../utils'

var BACKUP_KEY = getBackupKey()

export function getBackupKey (key = Routes.splashScreen) {
  BACKUP_KEY = key
  return BACKUP_KEY
}

export default function allActions (state, action) {
  const initialState = {
    key: 'global',
    index: 0,
    routes: [
      { key: BACKUP_KEY, routeName: BACKUP_KEY, index: 0 }
    ]
  }
  if (state === undefined) {
    state = initialState
  }
  switch (action.type) {
    case AllNavActions.PUSH_NEW_ROUTE:
      return AppNavigatorStack.router.getStateForAction(NavigationActions.navigate({
        key: (action.payload || {}).key || BACKUP_KEY,
        routeName: (action.payload || {}).key || BACKUP_KEY,
        index: state.routes[(state.routes.length > 0 ? state.routes.length - 1 : 0)]
      }), state) || state
    case AllNavActions.POP_ROUTE:
      return AppNavigatorStack.router.getStateForAction(NavigationActions.back(), state) || state
    case AllNavActions.POP_TO_ROUTE:
      return AppNavigatorStack.router.getStateForAction(NavigationActions.back({ key: (action.payload || {}).key || BACKUP_KEY, routeName: (action.payload || {}).key || BACKUP_KEY }), state) || state

    case AllNavActions.LOGIN | AllNavActions.LOGOUT | AllNavActions.REPLACE_OR_PUSH_ROUTE |
      AllNavActions.REPLACE_ROUTE:
      return AppNavigatorStack.router.getStateForAction(NavigationActions.init({ routeName: (action.payload || {}).key || BACKUP_KEY, key: BACKUP_KEY })) || state
    default:
      return AppNavigatorStack.router.getStateForAction(action, state) || state
 
    }
}
