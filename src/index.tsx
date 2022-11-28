import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import * as serviceWorker from './serviceWorker';
import AppWithRedax from "./AppWithRedax";
import {store} from "./State/Store";
import {Provider} from "react-redux";

ReactDOM.render(
    <Provider store={store}>
        <AppWithRedax/>
    </Provider>, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();