import React from 'react';
import { Monitor, Alerts } from './components';
import './App.scss';

const App = () => {
  return (
    <div className="App">
      <Monitor />
      <Alerts />
    </div>
  );
};

export default App;
