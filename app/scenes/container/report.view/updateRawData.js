import configureStore from '../../../redux/configstore';

export const updateRawData = data => {
  const store = configureStore();
  store.dispatch({type: 'UPDATE_RAW_DATA', data: {...data}});
};
