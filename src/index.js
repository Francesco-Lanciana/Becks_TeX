import React from 'react';
import {render} from 'react-dom';
import {Provider, connect} from 'react-redux';

import GraphUI from 'Components/GraphUI';
import store from 'App/store';

import 'Styles/base';

function renderApp() {
    render(
      <Provider store={store}>
        <GraphUI/>
      </Provider>,
      document.getElementById('root')
    );
}

renderApp(); // Renders App on init
