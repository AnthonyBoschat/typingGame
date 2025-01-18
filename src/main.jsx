import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import client from "./appollo-client.js"
import { Provider } from 'react-redux'
import { store } from '@Redux/store.js'
import { BrowserRouter } from 'react-router-dom'
import { ApolloProvider } from '@apollo/client'
import "@Sass/animation.scss"
import "@Sass/constants.scss"
import "@Sass/functions.scss"
import "@Sass/reset.scss"

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <Provider store={store}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </Provider>
    </ApolloProvider>
  </React.StrictMode>,
)
