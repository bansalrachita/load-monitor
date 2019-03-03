import React, {useState} from "react";

export const AlertHistory = () => {
    const [selections] = useState([]);
    const [selected] = useState(false);

    return (
        <div className="col-md-12">
            <hr />
            <table className="table">
                <thead>
                <tr>
                    <th scope="col">Date</th>
                    <th scope="col">Usage</th>
                </tr>
                </thead>
                <tbody>
                {selections.map((tr, i) => {
                    return (
                        <tr
                            key={i}
                            style={
                                i === selected
                                    ? { background: "#46abff60" }
                                    : {}
                            }
                        >
                            {/*<td*/}
                                {/*onClick={() => this.setState({ selected: i })}*/}
                            {/*>{`${tr.humanize()}`}</td>*/}
                            {/*<td style={{ padding: 10 }}>{`${formatter(*/}
                                {/*trafficSeries.crop(tr).avg("in")*/}
                            {/*)}b`}</td>*/}
                            {/*<td style={{ padding: 10 }}>{`${formatter(*/}
                                {/*trafficSeries.crop(tr).avg("out")*/}
                            {/*)}b`}</td>*/}
                        </tr>
                    );
                })}
                </tbody>
            </table>
        </div>
    )
};