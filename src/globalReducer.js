function makeReducer(globalState, action, name, realReducer) {
  const subStoreState = globalState[name]
  return {
    ...globalState,
    [name]: realReducer(subStoreState, action)
  }
}

export default function globalReducer(modules, reducers, initialState, state = initialState, action) {
  state = state || initialState
  let newState = state

  switch (action.type) {
    case "$$PATCHER$$": {
      const { args, getState } = action
      const subStoreName = args[0]
      let patchFunction = args[0]
      if (typeof subStoreName === "string") {
        patchFunction = args[1]
        const mutation = patchFunction(getState()[subStoreName])
        newState = {
          ...state,
          [subStoreName]: {
            ...state[subStoreName],
            ...mutation
          }
        }
      } else {
        const mutation = patchFunction(getState())
        newState = {
          ...state,
          ...mutation
        }
      }
    }
  }

  if (action.type === "$$PATCHER$$") return newState

  // https://medium.com/@nate_wang/a-new-approach-for-managing-redux-actions-91c26ce8b5da
  return reducers.reduce((currentState, currentReducer, index) => {
    return makeReducer(currentState, action, modules[index].name, currentReducer)
  }, newState)
}
