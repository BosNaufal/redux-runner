
import globalReducer from './globalReducer'

export function registerModule(store, name, module) {
  const nextReducer = combineModule({ ...store.Store.modules, [name]: module }).reducer
  store.replaceReducer(nextReducer)
}

export function combineModule(modules) {
  let flatModule = []
  let reducers = []
  let initialState = {}
  Object.keys(modules).forEach((name) => {
    const module = modules[name]
    const reducer = module.reducer
    const state = module.initialState
    reducers = [
      ...reducers,
      reducer
    ]

    initialState = {
      ...initialState,
      [name]: state
    }

    flatModule = [
      ...flatModule,
      { ...module, name },
    ]
  })

  const reducer = globalReducer.bind(null, flatModule, reducers, initialState)
  return { reducer, initialState, modules }
}
