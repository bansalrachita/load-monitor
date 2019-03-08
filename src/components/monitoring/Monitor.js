import React, { Fragment } from 'react';
import { Legend, styler } from 'react-timeseries-charts';
import { fetchLoad } from '../../hooks';
import './monitoring.scss';
import MonitorChart from './MonitorChart';

const Monitor = () => {
  // get data from state.
  const { data, error } = fetchLoad();
  const style = styler([
    {
      key: 'usage',
      color: '#1D7324'
    },
    {
      key: 'alert',
      color: '#B85033'
    }
  ]);
  const categories = [
    {
      key: 'usage',
      label: 'Usage'
    },
    {
      key: 'alert',
      label: 'Alert'
    }
  ];

  return (
    <div className="monitoring-container">
      {error && <div className="error">{error.message}</div>}
      {data && !data.length && <div className="loading">Loading...</div>}
      {data && data.length > 0 && (
        <Fragment>
          <h3 className="title">CPU Usage</h3>
          <Legend type="swatch" style={style} categories={categories} />
          <MonitorChart data={data} />
        </Fragment>
      )}
    </div>
  );
};

export default Monitor;
