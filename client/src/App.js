import React, { useState, useEffect, useContext } from "react";
import { contextObject } from "./Context/Store";
import todoOperations from "./ducks/operations";
import { store } from "./Context/Store";
const App = () => {
  const [state, updateState] = useState({ title: "", description: "" });
  const [elements, updateElement] = useState({});
  const { todos } = useContext(contextObject);
  const [todoList, dispatch] = todos;
  useEffect(() => {
    const getItems = async () => {
      await todoOperations.fetchItems(dispatch);
    };
    getItems();
  }, [dispatch]);
  useEffect(() => {
    updateElement(() => ({}));
    todoList.forEach((element) => {
      updateElement((prevState) => ({
        ...prevState,
        [element._id]: { ...element, flag: 0 },
      }));
    });
  }, [todoList.length]);
  const handleTitle = (e) => {
    const value = e.target.value;
    updateState((prevState) => ({ ...prevState, title: value }));
  };
  const handleDescription = (e) => {
    const value = e.target.value;
    updateState((prevState) => ({ ...prevState, description: value }));
  };
  const handleTitleEdit = (e, id) => {
    const value = e.target.value;
    updateElement((prevState) => ({
      ...prevState,
      [id]: { ...prevState[id], title: value },
    }));
  };
  return (
    <div className="container-fluid p-3">
      <ul>
        {todoList.map((element) => {
          return (
            <li>
              <div className="card">
                <div className="card-body">
                  <div className="row">
                    <div className="column">
                      Title :{" "}
                      <b>
                        {Object.keys(elements).length != todoList.length ? (
                          element.title
                        ) : elements[element._id].flag === 0 ? (
                          element.title
                        ) : (
                          <input
                            type="text"
                            data-testid="editTextBox"
                            value={elements[element._id].title}
                            onChange={(e) => {
                              handleTitleEdit(e, element._id);
                            }}
                          />
                        )}{" "}
                      </b>
                      <br />
                      Description : {element.description}
                    </div>
                    <div className="column ml-auto">
                      {Object.keys(elements).length != todoList.length ? (
                        <b>Null</b>
                      ) : elements[element._id].flag === 1 ? (
                        <button
                          className="btn btn-primary"
                          onClick={async () => {
                            await todoOperations.updateItem(
                              dispatch,
                              elements[element._id]
                            );
                            updateElement((prevState) => ({
                              ...prevState,
                              [element._id]: {
                                ...prevState[element._id],
                                flag: 0,
                              },
                            }));
                          }}
                        >
                          Save
                        </button>
                      ) : (
                        <div>
                          <button
                            className="btn btn-info"
                            onClick={() => {
                              updateElement((prevState) => ({
                                ...prevState,
                                [element._id]: {
                                  ...prevState[element._id],
                                  flag: 1,
                                },
                              }));
                            }}
                            data-testid="updateItem"
                          >
                            Edit
                          </button>
                          <button
                            className="btn btn-danger"
                            onClick={async () => {
                              await todoOperations.deleteItem(
                                dispatch,
                                element._id
                              );
                            }}
                            data-testid="deleteItem"
                          >
                            Delete
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
      <br />
      <div className="card">
        <div className="card-body">
          <input
            type="text"
            value={state.title}
            onChange={handleTitle}
            className="form-control"
            placeholder="To-Do Title"
          ></input>
          <br />
          <textarea
            type="text"
            value={state.description}
            onChange={handleDescription}
            className="form-control"
            placeholder="To-Do Description"
          ></textarea>
          <br />
          <button
            className="btn btn-primary"
            onClick={async (e) => {
              e.preventDefault();
              await todoOperations.addItem(state, dispatch);
            }}
          >
            Add To-Do Item
          </button>
        </div>
      </div>
    </div>
  );
};
export default App;
