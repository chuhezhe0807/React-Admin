import { legacy_createStore as createStore, combineReducers } from "redux";
import { persistStore, persistReducer } from "redux-persist";
import storage from 'redux-persist/lib/storage'
import global from "./modules/global/reducer";
import auth from './modules/auth/reducer'
import menu from './modules/menu/reducer'
import breadcrumb from './modules/breadcrumb/reducer'
import tabs from "./modules/tabs/reducer";

// 合并reducer
const reducer = combineReducers({
  global,
  auth,
  menu,
  breadcrumb,
  tabs
})

// redux 持久化配置
const persistConfig = {
  key: 'redux-persist',
  storage
}
const persistReducerConfig = persistReducer(persistConfig, reducer)

// 创建Store
const store = createStore(persistReducerConfig)

// 创建持久化 store 
const persistor = persistStore(store)

export { store, persistor }

// 从 store 本身推断出 `RootState` 和 `AppDispatch` types
export type RootState = ReturnType<typeof store.getState>;
// 类型推断: {posts: PostsState, comments: CommentsState, users: UsersState}
export type RootDispatch = typeof store.dispatch;