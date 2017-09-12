
export default function getFunction(thunk, payload) {
  const action = thunk(payload)
  return action.fn
}
