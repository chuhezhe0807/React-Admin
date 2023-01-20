import moment from "moment"
import { useEffect, useState, useRef, useReducer } from "react"

// /**
//  * @description 获取本地时间
//  */
// export const useTimes = () => {
//   const timer: any = useRef(null)
//   const [time, setTime] = useState(moment().format("YYYY年MM月DD日 HH:mm:ss"))

//   useEffect(() => {
//     timer.current = setInterval(() => {
//       setTime(moment().format("YYYY年MM月DD日 HH:mm:ss"))
//     }, 1000)

//     return () => {
//       clearInterval(timer.current)
//     }
//   }, [time])

//   return {
//     time,
//   }
// }

// 另一种写法 使用 useReducer 这一种更好，解耦 actions 和 状态如何响应，React保证在dispatch在组件生命周期内不变，所以我们不用再重新订阅定时器
/**
 * @description 获取本地时间
 */
const initialState = {
  time: null,
}

function reducer(state: any, action: any) {
  switch (action.type) {
    case "setTime":
      return { time: moment().format("YYYY年MM月DD日 HH:mm:ss") }
    default:
      return state
  }
}

export const useTimes = () => {
  const [state, dispatch] = useReducer(reducer, initialState)

  useEffect(() => {
    const id = setInterval(() => {
      dispatch({ type: "setTime" })
    }, 1000)

    return () => {
      clearInterval(id)
    }
  }, [dispatch])

  return {
    time: state.time,
  }
}
