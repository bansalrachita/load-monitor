const os = require('os');
const moment = require('moment');

module.exports = function (app) {
    // TODO: implement interval change data
    app.get('/api/cpu', cpu);

    function cpu(req, res) {
        var params = req.query;
        var data = startCollection(params.interval, params.duration);
        res.json({data: data});
    }

    let data = [];
    let avgs = [];
    let startMeasures = delta();
    let start = false;
    // let avgMinutes = 60 * 2000;
    let avgMinutes = 2000;
    let alertState = false;

    function delta() {
        const cpus = os.cpus();

        return cpus.map(cpu => {
            const times = cpu.times;
            return {
                tick: Object.keys(times).filter(time => time !== 'idle')
                    .reduce((tick, time) => tick + times[time], 0),
                idle: times.idle,
            }
        })
    }

    function storeToAvgs(newAvg, interval) {
        avgs = [newAvg, ...avgs];
        let storeLen = avgMinutes / interval;
        if (storeLen < avgs.length) avgs.shift();
        let avg = avgs.reduce((x, y) => (Number(y) + x), 0) / avgs.length;
        return avg < newAvg && storeLen === avgs.length;
    }

    function storeToData(usage, timestamp, duration, interval) {
        const alert = storeToAvgs(usage, interval);
        console.log("alert: ", alert, alertState);
        if (alert) {
            //TODO:push alert message
            console.log("entering alert state with ", usage, timestamp);
            alertState = true;
        } else if (alertState) {
            //TODO: push recovery message;
            console.log("recovering from alert state", timestamp);
            alertState = !alertState;
        }

        data = [...data, {usage, timestamp, alert}];

        // totalDuration  in seconds / intervals in seconds.
        if ((duration / interval) < data.length) {
            data.shift();
        }
        // console.log(/*'data', data,*/ data.length);
    }

// TODO: send interval and do magic
    function startCollection(interval = 1000, duration = 60000) {
        if (!start) {
            console.log("start interval ", start);
            data = new Array(duration / interval).fill(0).map((x, index) => ({
                usage: 0,
                timestamp: moment().utc().subtract(index, "seconds").format()
            })).reverse();

            setInterval(() => {
                //new interval
                const endMeasures = delta();
                //calculate percentage utilization
                const percentageCPU = endMeasures.map((end, i) => {
                    return (
                        (end.tick - startMeasures[i].tick) /
                        (end.idle - startMeasures[i].idle) * 100
                    ).toFixed(3)
                });

                const totalCPU = percentageCPU.reduce((x, y) => x + Number(y), 0);
                const usage = totalCPU / percentageCPU.length;

                storeToData(usage, new Date(), duration, interval);
                // reset
                startMeasures = delta();
            }, interval);
            start = !start
        }

        return data || [];
    }


}
;