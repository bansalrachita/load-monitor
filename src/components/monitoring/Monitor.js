import React, { Fragment } from 'react';
import moment from 'moment';
import {
  Resizable,
  Legend,
  Charts,
  ChartContainer,
  ChartRow,
  YAxis,
  BarChart,
  styler
} from 'react-timeseries-charts';
import { TimeSeries, Index } from 'pondjs';
import { fetchLoad } from '../../hooks';
import './monitoring.scss';

const Monitor = () => {
  // get data from state.
  const { data, error } = fetchLoad();
  // Create a new instance of TimeSeries.
  const series = new TimeSeries({
    name: 'usage',
    columns: ['index', 'usage', 'alert'],
    points: data.map(({ timestamp, usage, alert }) => [
      Index.getIndexString(
        `10s`,
        moment(timestamp)
          .utc()
          .format('YYYY-MM-DD hh:mm:ss Z')
      ),
      usage,
      alert
    ])
  });
  const style = styler([
    {
      key: 'usage',
      color: 'green'
    },
    {
      key: 'alert',
      color: 'red'
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
      {data && !data.length && <div className="loading">Loading...</div> // until the server responds back. Display text.
      }
      {data && data.length > 0 && (
        <Fragment>
          <h3 className="title">CPU Usage</h3>
          <Legend type="swatch" style={style} categories={categories} />
          <Resizable>
            <ChartContainer enablePanZoom timeRange={series.range()}>
              <ChartRow height="150">
                <YAxis
                  id="usage"
                  min={0}
                  max={200}
                  format=".2f"
                  width="40"
                  type="linear"
                />
                <Charts>
                  <BarChart
                    axis="usage"
                    style={(event, column) => {
                      const { _d: value } = column;
                      const alert = value.get('data').get('alert');
                      return {
                        normal: {
                          fill: alert ? 'red' : 'green',
                          opacity: 0.8
                        }
                      };
                    }}
                    spacing={1}
                    columns={['usage']}
                    series={series}
                    minBarHeight={0}
                  />
                </Charts>
              </ChartRow>
            </ChartContainer>
          </Resizable>
        </Fragment>
      )}
    </div>
  );
};

export default Monitor;
