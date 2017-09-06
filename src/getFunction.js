
export default function getFunction(thunk) {
  const action = thunk()
  const actionWithName = typeof action === "object" && action.length === 2
  if (actionWithName) return action[1]
  if (typeof action === "function") return action
}
