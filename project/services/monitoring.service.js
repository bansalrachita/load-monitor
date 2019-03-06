const os = require('os');
const moment = require('moment');

const datastore = {
  data: [],
  avgs: [],
  alerts: [],
  alertState: false,
  start: false,
  avgMinutes: 2000 * 60,
  timeBucket: 600000,
  interval: 10000
};

module.exports = function getLoad(app) {
  // collect cpu data at an interval and duration.
  function cpu(req, res) {
    // const params = req.query;
    res.json({ data: datastore.data });
  }

  function getAlerts(req, res) {
    // const params = req.query;
    // const duration = params.duration ? params.duration : datastore.timeBucket;
    // const currentTime = moment()
    //   .utc()
    //   .subtract(duration, 'seconds')
    //   .format();
    // console.log(currentTime);
    // const alertSlice = datastore.alerts.filter(
    //   alert => alert.timestamp > currentTime
    // );
    res.json({ data: datastore.alerts });
  }

  function delta() {
    const cpus = os.cpus();
    return cpus.map(c => {
      const { times } = c;
      return {
        tick: Object.keys(times)
          .filter(time => time !== 'idle')
          .reduce((tick, time) => tick + times[time], 0),
        idle: times.idle
      };
    });
  }

  function storeToAvgs(newAvg, interval) {
    datastore.avgs = [newAvg, ...datastore.avgs];
    const storeLen = datastore.avgMinutes / interval;
    if (storeLen < datastore.avgs.length) datastore.avgs.shift();
    const avg =
      datastore.avgs.reduce((x, y) => Number(y) + x, 0) / datastore.avgs.length;
    return avg < newAvg && storeLen === datastore.avgs.length;
  }

  function storeToData(usage, timestamp, duration, interval) {
    const newAlert = storeToAvgs(usage, interval);
    // console.log("alert: ", alert, alertState);
    if (newAlert) {
      const obj = {
        message: `Entering alert state with ${usage.toFixed(
          2
        )} utilization at ${moment(timestamp)
          .utc()
          .format()}`,
        usage,
        timestamp
      };
      datastore.alerts.unshift({ ...obj });
      datastore.alertState = true;
    } else if (datastore.alertState) {
      datastore.alerts.unshift({
        message: `Recovering from alert state at ${moment(timestamp)
          .utc()
          .format()}`,
        timestamp,
        usage
      });
      datastore.alertState = !datastore.alertState;
    }
    datastore.data = [...datastore.data, { usage, timestamp, alert: newAlert }];
    // totalDuration  in seconds / intervals in seconds.
    if (duration / interval < datastore.data.length) {
      datastore.data.shift();
    }
    // console.log(/*'data', data,*/ data.length);
  }

  (function startCollection(
    interval = datastore.interval,
    duration = datastore.timeBucket
  ) {
    let startMeasures = null;
    if (!datastore.start) {
      //  set initial state of data.
      datastore.data = new Array(duration / interval)
        .fill(0)
        .map((x, index) => ({
          usage: 0,
          timestamp: moment()
            .utc()
            .subtract(index, 'seconds')
            .format()
        }))
        .reverse();
      //  monitor the avg load at an interval for a time duration specified above.
      setInterval(() => {
        // new interval
        const endMeasures = delta();
        // calculate percentage utilization
        const percentageCPU = endMeasures.map((end, i) => {
          return (
            ((end.tick - startMeasures[i].tick) /
              (end.idle - startMeasures[i].idle)) *
            100
          ).toFixed(3);
        });
        const totalCPU = percentageCPU.reduce((x, y) => x + Number(y), 0);
        const usage = totalCPU / percentageCPU.length;
        storeToData(usage, new Date(), duration, interval);
        // reset
        startMeasures = delta();
      }, interval);
      datastore.start = !datastore.start;
    }
  })();

  app.get('/api/cpu', cpu);
  app.get('/api/alerts', getAlerts);
};
