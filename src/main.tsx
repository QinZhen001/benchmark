import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import { Provider } from "react-redux"
import store from "./store"

import './styles/global.css'

createRoot(document.getElementById('root')!).render(
  <Provider store={store}>
    <App />
  </Provider>
)