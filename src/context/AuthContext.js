import { createContext, useEffect, useReducer } from "react";
import AuthReducer from "./AuthReducer";
import axios from "axios";
import { useState } from "react";
const INITIAL_STATE = {
  user: JSON.parse(localStorage.getItem("user")) || null,
  isFetching: false,
  error: false,
};
export const AuthContext = createContext(INITIAL_STATE);
export const AuthContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(AuthReducer, INITIAL_STATE);
  const [users, setUsers] = useState(JSON.parse(localStorage.getItem("users")) || []);
  const [update, setUpdate] = useState(localStorage.getItem("update")||0);
  const [count, setCount] = useState(JSON.parse(localStorage.getItem("count")) || {});
  
  const [api, setApi] = useState("https://mern-chat-1.herokuapp.com/api");
  useEffect(() => {
    localStorage.setItem("user", JSON.stringify(state.user));
  }, [state.user]);
  useEffect(() => {
    const getUsers = async () => {
      try {
        const res = await axios.get(api+"/users/all");
        setUsers(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    getUsers();
  },[]);

  useEffect(()=>{
    localStorage.setItem("users", JSON.stringify(users));
  }, [users]);
  useEffect(()=>{
    localStorage.setItem("count",JSON.stringify(count));
  },[count])
  useEffect(()=>{
    localStorage.setItem("update",JSON.stringify(update));
  },[update])
  return (
    <AuthContext.Provider
      value={{
        user: state.user,
        isFetching: state.isFetching,
        error: state.error,
        dispatch,
        users,
        setUsers,
        update,
        setUpdate,
        count,
        setCount,
        api,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
