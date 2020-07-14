import React, { useReducer, createContext } from "react";
import todoReducer from "../ducks/reducer";
var contextObject = createContext();
const { Provider } = contextObject;
var store;
const StateProvider = (props) => {
  var [todoList, dispatch] = useReducer(todoReducer, []);
  console.log(todoList);
  store = {
    todos: [todoList, dispatch],
  };
  return <Provider value={store}>{props.children}</Provider>;
};
export default StateProvider;
export { contextObject, store };
