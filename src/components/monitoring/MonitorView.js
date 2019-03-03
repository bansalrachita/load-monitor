import React, {useEffect, useState, Fragment} from "react";
import {
    Resizable,
    Legend,
    Charts,
    ChartContainer,
    ChartRow,
    YAxis,
    BarChart,
    styler
} from "react-timeseries-charts";
import {TimeSeries, Index, TimeRange} from "pondjs";
import {getLoadData} from "../../utils";
import "./monitoring.scss";
import moment from "moment";

const MonitorView = () => {
    const [data, setData] = useState([]);
    const duration = 1000;

    useEffect(() => {
        //poll data every 5 seconds.
        const interval = setInterval(() => getLoadData(setData), duration);

        return () => clearInterval(interval);
    });

    const series = new TimeSeries({
        name: "usage",
        columns: ["index", "usage", "alert"],
        points: data.map(({timestamp, usage, alert}, index) => [
            Index.getIndexString(`1s`, new Date(timestamp)),
            usage,
            alert
        ])
    });

    const style = styler([
        {
            key: "usage",
            color: "green"
        },
        {
            key: "alert",
            color: "red"
        }
    ]);

    console.log("data: ", data);

    if(!data.length){
        return (
            <div>
                Loading...
            </div>
        )
    }
    return (
        <div className="monitoring-container">
            <Fragment>
                <Legend
                    type="swatch"
                    style={style}
                    categories={[
                        {
                            key: "usage",
                            label: "Usage"
                        },
                        {
                            key: "alert",
                            label: "Alert"
                        }
                    ]}
                />
                <Resizable>
                    <ChartContainer enablePanZoom={true} timeRange={series.range()}
                        // new TimeRange([moment().format("YYYY-MM-DD HH:mm"), moment().subtract(1, "seconds").format("YYYY-MM-DD HH:mm")])
                    >
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
                                        const {_d: data} = column;
                                        const alert = data.get("data").get("alert");
                                        return {
                                            normal: {
                                                fill: alert ? "red" : "green",
                                                opacity: 0.8
                                            }
                                        };
                                    }}
                                    spacing={1}
                                    columns={["usage"]}
                                    series={series}
                                    minBarHeight={0}
                                />
                            </Charts>
                        </ChartRow>
                    </ChartContainer>
                </Resizable>
            </Fragment>
        </div>
    )
};

export default MonitorView;