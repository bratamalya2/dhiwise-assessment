import React from 'react';
import { Provider } from 'react-redux';

import store from './store/store';

import LeftPanel from './components/leftPanel';
import RightPanel from './components/rightPanel';
import ResultPanel from './components/resultPanel';

export default function App() {
  return (
    <Provider store={store}>
      <div className="flex relative">
        <LeftPanel />
        <RightPanel />
        <ResultPanel />
      </div>
    </Provider>
  );
}
