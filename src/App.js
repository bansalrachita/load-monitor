import React, {Component} from 'react';
import './App.scss';
import {MonitorView} from "./components";

class App extends Component {
    render() {
        return (
            <div className="App">
                <MonitorView/>
            </div>
        );
    }
}

export default App;
