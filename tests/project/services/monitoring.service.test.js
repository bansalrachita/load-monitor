const { expect } = require('chai');
const service = require('../../../project/services/monitoring.service');

const events = require('../../../events.json');
// eslint-disable
describe('Alerting logic', function() {
  const app = { get: () => {} };
  const monitoringService = service(app);
  const duration = 60000;
  const interval = 1000;
  const minAlertSeconds = 2000;
  // runs before all tests in this block
  // eslint-disable
  before(function() {
    monitoringService.datastore.data = events.data;
    monitoringService.datastore.timeBucket = duration;
    monitoringService.datastore.interval = interval;
    monitoringService.datastore.minAlertSeconds = minAlertSeconds;
    monitoringService.datastore.data.map(({ usage }) =>
      monitoringService.storeToAvgs(usage, interval)
    );
  });
  // eslint-disable
  describe('Alert() function', function() {
    it('Should verify initial state.', function() {
      // console.log("monitoringService.datastore", monitoringService.datastore);
      expect(0).to.equal(monitoringService.datastore.alerts.length);
    });

    it('Should generate high load alert.', function() {
      const usage = 150;
      const timestamp = '2019-03-06T22:02:09Z';

      monitoringService.createAlert(usage, timestamp, duration, interval);
      const alerts = [{}];
      // console.log("monitoringService.datastore", monitoringService.datastore);
      expect(alerts.length).to.equal(monitoringService.datastore.alerts.length);
    });

    it('Should generate recovery alert.', function() {
      const usage = 10;
      const timestamp = '2019-03-06T22:02:09Z';

      monitoringService.createAlert(usage, timestamp, duration, interval);
      const alerts = [{}, {}];
      // console.log("monitoringService.datastore", monitoringService.datastore);
      expect(alerts.length).to.equal(monitoringService.datastore.alerts.length);
    });

    it('Should not generate alert.', function() {
      const usage = 10;
      const timestamp = '2019-03-06T22:02:10Z';

      monitoringService.createAlert(usage, timestamp, duration, interval);
      const alerts = [{}, {}];
      // console.log("monitoringService.datastore", monitoringService.datastore);
      expect(alerts.length).to.equal(monitoringService.datastore.alerts.length);
    });
  });
});
