export const AllNavActions = {
  PUSH_NEW_ROUTE: 'PUSH_NEW_ROUTE',
  POP_ROUTE: 'POP_ROUTE',
  POP_TO_ROUTE: 'POP_TO_ROUTE',
  REPLACE_ROUTE: 'REPLACE_ROUTE',
  REPLACE_OR_PUSH_ROUTE: 'REPLACE_OR_PUSH_ROUTE',
  LOGIN: 'LOGIN',
  LOGOUT: 'LOGOUT',
}

export type Dispatch = (action:NavAction | Array<NavAction>) => any
export type GetState = () => Object
export type PromiseAction = Promise<NavAction>

export const GET_LIST = 'GET_LIST'
export const SET_LIST = 'SET_LIST'
export type PinnedActionType = SET_LIST | GET_LIST
export type PinnedAction = { type: PinnedActionType, payload: string }

export const SET_UNREAD = 'SET_UNREAD'
export type ReportListActionType = SET_UNREAD
export type ReportListAction = { type: ReportListActionType, payload: boolean }

export const GET_JSON = 'GET_JSON'
export const SET_JSON = 'SET_JSON'
export type TrackerActionType = SET_JSON | GET_JSON
export type TrackerAction = { type: TrackerActionType, payload: string }


export const FLAG = 'FLAG'
export type SetNotification = { type: FLAG, payload: string}

export const UNREAD = 'UNREAD'
export type SetUnreadFlag  = { type: UNREAD, payload: int}


export const DEMOGRAPHICS = 'DEMOGRAPHICS'
export type SetDemographics = {type:DEMOGRAPHICS, payload : {}}

export const GET_UPDATED = 'GET_UPDATED'
export const SET_UPDATED = 'SET_UPDATED'
export type TrackerUpdateActionType = GET_UPDATED | SET_UPDATED
export type TrackerUpdateAction = { type: TrackerUpdateActionType, payload: boolean }

export const CURRENCY = 'CURRENCY'
export type SetCurrency = {type:CURRENCY, payload : {}}


export const UDAction = {
  SET_UD: 'SET_UD',
  SET_UD_VAL: 'SET_UD_VAL',
  RESET_UD_STATE: 'RESET_UD_STATE',
  SYNC_UD_WITH_STORE: 'SYNC_UD_WITH_STORE'
}
