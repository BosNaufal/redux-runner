
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
    // Identity For Current Async Action
    const actionWithName = typeof action === "object" && action.length === 2
    if (actionWithName) {
      const NAME = action[0]
      store.dispatch({ type: NAME })
      return doAction(action[1], store)
    }
    if (typeof action === "function") return doAction(action, store)
    // If Ordinary dispatch (for store state mutation)
    return next(action)
  }
}
