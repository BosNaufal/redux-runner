
import { isFunction, isString } from './utils'

export default function action(name, fn) {
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
