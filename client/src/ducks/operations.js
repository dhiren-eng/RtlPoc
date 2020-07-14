import axios from "axios";
const addItem = async (todoItem, dispatch) => {
  try {
    await axios.post("/api/category", todoItem);
    await fetchItems(dispatch);
  } catch (error) {
    console.log(error);
  }
};
const fetchItems = async (dispatch) => {
  try {
    const items = await axios.get("/api/category/all");
    console.log(items);
    dispatch({ type: "GET_LIST", payload: items.data });
  } catch (error) {
    console.log(error);
  }
};
const updateItem = async (dispatch, item) => {
  try {
    const res = await axios.put(`/api/category/${item._id}`, item);
    await fetchItems(dispatch);
  } catch (error) {
    console.log(error);
  }
};
const deleteItem = async (dispatch, id) => {
  try {
    await axios.delete(`/api/category/${id}`);
    await fetchItems(dispatch);
  } catch (error) {
    console.log(error);
  }
};
export default { addItem, fetchItems, updateItem, deleteItem };
