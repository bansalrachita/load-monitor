import React, { useState, useEffect } from 'react';

const Alert = ({ i, timestamp, usage, message }) => {
  const isAlertState = date => {
    const date1 = new Date();
    const date2 = new Date(date);
    const timeDiff = Math.abs(date2.getTime() - date1.getTime());
    const diffSeconds = Math.ceil(timeDiff / 1000);
    // console.log('date1: ', date1, 'date2: ', date2, diffSeconds, timeDiff);
    return diffSeconds < 15;
  };

  const initialAlertState = isAlertState(timestamp);
  const [alertState, setAlertState] = useState(initialAlertState);

  useEffect(() => {
    if (alertState) {
      const interval = setTimeout(() => {
        setAlertState(isAlertState(timestamp));
      }, 10000);

      return () => clearInterval(interval);
    }

    return () => {};
  });

  return (
    <tr key={i} style={alertState ? { background: '#aaa', color: 'red' } : {}}>
      <td style={{ padding: 10 }}>{`${timestamp}`}</td>
      <td style={{ padding: 10 }}>{`${usage}`}</td>
      <td style={{ padding: 10 }}>{`${message}`}</td>
    </tr>
  );
};

export default Alert;
