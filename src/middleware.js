
import Runner from './Runner';
import { isGeneratorFunction } from './utils';

const doAction = (action, store) => {
  const useRunner = isGeneratorFunction(action)
  if (useRunner) {
    return Runner(action, store)
  }
  const { getState, dispatch } = store
  return action({ getState, dispatch })
}

export default function ReduxRunner(store) {
  return next => action => {
    if (action.name && action.fn) {
      // Action with name
      store.dispatch({ type: action.name })
      return doAction(action.fn, store)
    } else if (!action.name && action.fn){
      // Action without name
      return doAction(action.fn, store)
    } else {
      // If Ordinary dispatch (for store state mutation)
      return next(action)
    }
  }
}
