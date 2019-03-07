const os = require('os');
const moment = require('moment');

const datastore = {
  data: [],
  avgs: [],
  alerts: [],
  alertState: false,
  start: false,
  minAlertSeconds: 2000 * 60,
  timeBucket: 600000,
  interval: 10000
};

module.exports = function getLoad(app) {
  function getAlerts(req, res) {
    const duration = datastore.timeBucket;
    const startTime = new Date();
    const alertSlice = datastore.alerts.filter(alert => {
      return Math.ceil(Math.abs(startTime - alert.timestamp)) < duration;
    });

    datastore.alerts = [...alertSlice];
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
    const alertTimeBucket = datastore.minAlertSeconds / interval;
    if (alertTimeBucket < datastore.avgs.length) datastore.avgs.pop();
    const avg =
      datastore.avgs.reduce((x, y) => Number(y) + x, 0) / datastore.avgs.length;
    return (
      avg <= newAvg && avg >= 100 && alertTimeBucket === datastore.avgs.length
    );
  }

  function createAlert(usage, timestamp, duration, interval) {
    const newAlert = storeToAvgs(usage, interval);
    if (newAlert) {
      const obj = {
        message: `High load generated an alert - load = ${usage.toFixed(
          2
        )} triggered at ${moment(timestamp)
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

    return newAlert;
  }

  function storeToData(usage, timestamp, duration, interval) {
    const alert = createAlert(usage, timestamp, duration, interval);
    datastore.data = [...datastore.data, { usage, timestamp, alert }];
    // totalDuration  in seconds / intervals in seconds.
    if (duration / interval < datastore.data.length) {
      datastore.data.shift();
    }
  }

  function startCollection(
    interval = datastore.interval,
    duration = datastore.timeBucket
  ) {
    if (!datastore.start) {
      let startMeasures = delta();
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
  }

  // collect cpu data at an interval and duration.
  function cpu(req, res) {
    const params = req.query;
    startCollection(params.interval, params.duration);
    res.json({ data: datastore.data });
  }

  app.get('/api/cpu', cpu);
  app.get('/api/alerts', getAlerts);

  //  for testing purpose.
  return {
    datastore,
    createAlert,
    storeToAvgs
  };
};
