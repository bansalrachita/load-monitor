import React, { useState, useEffect } from 'react';
import moment from 'moment';

const Alert = ({ i, timestamp, usage, message }) => {
  const isAlertState = date => {
    const date1 = new Date();
    const date2 = new Date(date);
    const timeDiff = Math.abs(date2.getTime() - date1.getTime());
    const diffSeconds = Math.ceil(timeDiff / 1000);
    return diffSeconds < 40;
  };

  const initialAlertState = isAlertState(timestamp);
  const [alertState, setAlertState] = useState(initialAlertState);

  useEffect(() => {
    const interval = setTimeout(() => setAlertState(false), 10000);
    return () => clearInterval(interval);
  });

  return (
    <tr key={i} className={`tbl-tr ${alertState ? 'alert-state' : ''}`}>
      <td className="tbl-td">{`${moment(timestamp).format('lll')}`}</td>
      <td className="tbl-td">{`${usage.toFixed(3)}`}</td>
      <td className="tbl-td">{`${message}`}</td>
    </tr>
  );
};

export default Alert;
