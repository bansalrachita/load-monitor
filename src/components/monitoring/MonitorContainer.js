import React, {Component} from "react";
import MonitorView from "./MonitorView";
import "./monitoring.scss";

class MonitorContainer extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const {
            data
        } = this.state;

        return (
            <MonitorView data={data} />
        )
    }
}

export default MonitorContainer;