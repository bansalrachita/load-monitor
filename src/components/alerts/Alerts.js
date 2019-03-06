import React, { useState, useEffect } from 'react';
import uuidV4 from 'uuid/v4';
import './alerts.scss';
import { getAlertData } from '../../utils';
import Alert from './Alert';

const Alerts = () => {
  const [alerts, setAlerts] = useState([]);
  const duration = 10000;

  useEffect(() => {
    // poll data every 5 seconds.
    const interval = setInterval(() => getAlertData(setAlerts), duration);
    return () => clearInterval(interval);
  });

  return (
    <div className="alert-history-container">
      <hr />
      <h3 className="tittle">Alert History</h3>
      <table className="table">
        <thead>
          <tr>
            <th scope="col" style={{ padding: 10 }}>
              Date
            </th>
            <th scope="col" style={{ padding: 10 }}>
              Usage
            </th>
            <th scope="col" style={{ padding: 10 }}>
              Alert Message
            </th>
          </tr>
        </thead>
        <tbody>
          {alerts.map((tr, i) => {
            return <Alert key={`alert-${uuidV4()}`} {...tr} i={i} />;
          })}
        </tbody>
      </table>
    </div>
  );
};

export default Alerts;
