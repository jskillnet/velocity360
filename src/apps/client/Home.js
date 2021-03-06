import React, { Componet } from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import store from '../../stores'
import Home from '../Home'

const initialState = window.__PRELOADED_STATE__

const app = (
	<Provider store={store.configureStore(initialState)}>
		<Home />
	</Provider>
)

ReactDOM.render(app, document.getElementById('root'))