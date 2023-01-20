// import { useEffect, useCallback, useRef } from "react"

// function useThrottle(fn: Function, delay: number, dep = []) {
//   const { current } = useRef<{ fn: Function; timer?: number | null }>({ fn, timer: null })
//   useEffect(
//     function () {
//       current.fn = fn
//     },
//     [fn]
//   )

//   return useCallback(function f(this: any, ...args: any[]) {
//     if (!current.timer) {
//       current.timer = window.setTimeout(() => {
//         delete current.timer
//       }, delay)
//       current.fn.call(this, ...args)
//     }
//   }, dep)
// }

// export default useThrottle

import { useCallback, useEffect, useRef } from "react"

const useThrottle = (fn: Function, throttle: number, deps: any[] = []) => {
  const { current } = useRef<{ fn: Function; timer?: NodeJS.Timeout }>({ fn })

  useEffect(() => {
    current.fn = fn
  }, [fn])

  return useCallback(function f(this: any, ...args: any[]) {
    if (!current.timer) {
      current.timer = setTimeout(() => {
        delete current.timer
      }, throttle)

      current.fn.apply(this, args)
    }
  }, deps)
}

export default useThrottle
