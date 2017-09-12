
import { isFunction, isString } from './utils'

export default function action(name, fn) {
  const isFunction = (fn) => typeof fn === "function"
  const isString = (name) => typeof name === "string"
  if (isFunction(fn) && isString(name)) {
    return {
      name,
      fn,
    }
  } else {
    return {
      fn: name,
    }
  }
};
