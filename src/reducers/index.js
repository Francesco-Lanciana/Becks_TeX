import { combineReducers } from 'redux';

import {selectionReducer} from './selection';

const rootReducer = combineReducers({
  selection: selectionReducer,
});

export default rootReducer;
