import { legacy_createStore as createStore, combineReducers, Store } from "redux";
import { persistStore, persistReducer } from "redux-persist";
import storage from 'redux-persist/lib/storage'
import global from "./modules/global/reducer";
import auth from './modules/auth/reducer'
import menu from './modules/menu/reducer'
import breadcrumb from './modules/breadcrumb/reducer'

// 合并reducer
const reducer = combineReducers({
  global,
  auth,
  menu,
  breadcrumb
})

// redux 持久化配置
const persistConfig = {
  key: 'redux-persist',
  storage
}
const persistReducerConfig = persistReducer(persistConfig, reducer)

// 创建Store
const store: Store = createStore(persistReducerConfig)

// 创建持久化 store 
const persistor = persistStore(store)

export { store, persistor }