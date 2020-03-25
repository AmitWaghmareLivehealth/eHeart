const initialState = { };

export const rawData = (state = initialState, action) => {
  switch (action.type) {
    case 'UPDATE_RAW_DATA':
      return {...state, ...action.data};
    default:
      return {...state};
  }
};
