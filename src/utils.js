
/**
 * To Check it is a Function or not
 * @param {Function} obj The Function to Check
 * @return {Boolean} The result
 */
export function isFunction(func) {
  return typeof(func) === 'function'
}


/**
 * To Check it is a Promise or not
 * @param {Any} appliedFunction The applied Promise function
 * @return {Boolean} The result
 */
export function isPromise(appliedFunction) {
  return appliedFunction.then !== undefined
}


/**
 * To Check it is a Generator Function or not
 * @param {Function} func The Function to check
 * @return {Boolean} The result
 */
export function isGeneratorFunction(func) {
  return typeof(func.prototype.next) === "function"
}


/**
 * To Check it is an Object or not
 * @param {Object} obj The Object to Check
 * @return {Boolean} The result
 */
export function isObject(obj) {
  return typeof(obj) === 'object' && !obj.length
}


/**
 * To Check it is an array or not
 * @param {Array} arr The Array to Check
 * @return {Boolean} The result
 */
export function isArray(arr) {
  return typeof(arr) === 'object' && arr.length
}


/**
 * To check wheter the object is filled or not. This will return false if the object has one keys
 * @param {Object} obj The object to check
 * @return {Boolean} The Result
 */
export function objectHasBeenFilled(obj) {
  return Object.keys(obj).length !== 0
}
