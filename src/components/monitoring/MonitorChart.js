import React from 'react';
import {
  BarChart,
  ChartContainer,
  ChartRow,
  Charts,
  Resizable,
  YAxis
} from 'react-timeseries-charts';
import moment from 'moment';
import { TimeSeries, Index } from 'pondjs';

const MonitorChart = ({ data }) => {
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

  return (
    <Resizable>
      <ChartContainer enablePanZoom timeRange={series.range()}>
        <ChartRow height="150" width={100}>
          <YAxis
            id="usage"
            min={0}
            max={300}
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
  );
};

export default MonitorChart;
