import React from "react"
import ReactDOM from "react-dom/client"
import App from "./App"
import { store, persistor } from "./redux"
import { Provider } from "react-redux"
import { PersistGate } from "redux-persist/integration/react"
import "@/language/index"
import "virtual:svg-icons-register"
import "@/styles/common.less"
import "@/styles/reset.less"
import "@/assets/iconfont/iconfont.less"
import "@/assets/fonts/font.less"

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <Provider store={store}>
    <PersistGate persistor={persistor}>
      <App />
    </PersistGate>
  </Provider>
)

// import ReactDOM from "react-dom"
// ReactDOM.render(
//   // * react严格模式
//   // <React.StrictMode>
//   <Provider store={store}>
//     <PersistGate persistor={persistor}>
//       <App />
//     </PersistGate>
//   </Provider>,
//   // </React.StrictMode>,
//   document.getElementById("root")
// )
