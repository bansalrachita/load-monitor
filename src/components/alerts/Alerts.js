import React from 'react';
import uuidV4 from 'uuid/v4';
import moment from 'moment';

import Alert from './Alert';
import { fetchAlerts } from '../../hooks';

import './alerts.scss';

const Alerts = () => {
  const { alerts, error } = fetchAlerts();

  return (
    <div className="alert-history-container">
      <hr />
      <h3 className="title">Alert History</h3>
      <p>{moment().format('LLL')}</p>
      {error && <div>{error.message}</div>}
      <table className="table">
        <thead>
          <tr className="tbl-tr">
            <th scope="col" className="tbl-th">
              Date
            </th>
            <th scope="col" className="tbl-th">
              Usage
            </th>
            <th scope="col" className="tbl-th">
              Alert Message
            </th>
          </tr>
        </thead>
        {!alerts.length && (
          <tbody>
            <tr>
              <td colSpan={3} className="no-data">
                No data found...
              </td>
            </tr>
          </tbody>
        )}
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
