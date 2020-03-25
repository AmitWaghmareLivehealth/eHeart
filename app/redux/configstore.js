import {AsyncStorage} from 'react-native';
import devTools from 'remote-redux-devtools';
import {combineReducers, createStore, applyMiddleware, compose} from 'redux';
import thunk from 'redux-thunk';
import {persistStore} from 'redux-persist';
import {navigation, pinnedTrackers, trackerJson, reportList} from './reducers';
import promise from './promise';
import logger from 'redux-logger';
import {
  TabbarNav,
  AppNavigatorStack,
  HomeNav,
  ReportNav,
  TrackerNav,
  ProfileNav,
} from '../scenes/container/router';
import notification from './reducers/notification';
import unread from './reducers/unread';
import demographics from './reducers/demographics';
import currency from './reducers/currency';
import {rawData} from './reducers/rawData';

export default function configureStore(onCompletion: () => void): any {
  const enhancer = compose(
    applyMiddleware(thunk, promise, logger),
    devTools({
      name: 'Livehealth',
      realtime: true,
    }),
  );
  const reducers = {
    //Object.assign({}, reducer, {
    navigation,
    pinnedTrackers,
    trackerJson,
    reportList,
    notification,
    unread,
    demographics,
    currency,
    rawData,
    appNavigatorStack: (state, action) =>
      AppNavigatorStack.router.getStateForAction(action, state),
  };
  const store = createStore(combineReducers(reducers), enhancer);
  persistStore(store, {storage: AsyncStorage}, onCompletion);
  return store;
}
