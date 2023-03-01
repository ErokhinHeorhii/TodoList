import React from 'react'

import './index.css'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { HashRouter } from 'react-router-dom'

import AppWithRedax from './app/AppWithRedux'
import * as serviceWorker from './serviceWorker'
import { store } from './State/Store'

export const rerenderEntireTree = () => {
  ReactDOM.render(
    <HashRouter>
      <Provider store={store}>
        <AppWithRedax />
      </Provider>
    </HashRouter>,
    document.getElementById('root')
  )
}

rerenderEntireTree()

if (process.env.NODE_ENV !== 'development' && module.hot) {
  module.hot.accept('./app/AppWithRedux', () => rerenderEntireTree())
}
// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister()
