import React from 'react';
import { Monitor, Alerts } from './components';
import './app.scss';

const App = () => {
  return (
    <div className="app">
      <Monitor />
      <Alerts />
    </div>
  );
};

export default App;
