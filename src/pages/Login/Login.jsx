import React from "react";
import Topbar from "../../components/topbar/Topbar";
import "./Login.css";
import { AuthContext } from "../../context/AuthContext";
import { CircularProgress } from "@material-ui/core";
import { useHistory } from "react-router-dom";
import { useContext, useRef } from "react";
import { ToastContainer, toast } from 'react-toastify';
import axios from 'axios'
import 'react-toastify/dist/ReactToastify.css';
function Login() {
  const email = useRef();
  const {api} = useContext(AuthContext);
  const password = useRef();
  const { user,isFetching, dispatch } = useContext(AuthContext);
  let history = useHistory();
  const handleClick = async (e) => {
    e.preventDefault();
    try{
      let userCredential = {
        email:email.current.value,
        password:password.current.value,
      }
      const res = await axios.post(api+"/auth/login", userCredential);
      if(res.data==="user not found"){
          toast("User Not found !!")
      }
      else if(res.data==="wrong password"){
        toast("Please Enter correct Credentials");
      }
      else{
        toast("Redirecting to Chat");
        dispatch({ type: "LOGIN_SUCCESS", payload: res.data });
        history.push('/chat')
      }
    }
    catch(err){

    }
    
  };
  // console.log(user); 
  return (
    <>
      <Topbar />
      <div className="login">
        <div className="login-left"></div>
        <div className="login-right">
          <form className="login-form" onSubmit={handleClick}>
            <div
              style={{
                display: "flex",
                alignItems: "flex-start",
                marginBottom: "5px",
              }}
            >
              <label style={{fontSize:"15px"}}>Email Address</label>
            </div>
            <input className="login-email"placeholder="Email Address" type="email" required ref={email} />
            <input
              placeholder="Password"
              type="password"
              required
              className="login-email"
              ref={password}
            />
            <button type="submit" disabled={isFetching} className="login-button">
              {isFetching ? (
                <CircularProgress color="white" size="20px" />
              ) : (
                "Log In"
              )}
            </button>
            <span>Don't have an account? <button type = "button" className="login-button" style={{backgroundColor:"#34eb5e"}} onClick={() => history.push("/signup")}>
              {isFetching ? (
                <CircularProgress color="white" size="20px" />
              ) : (
                "Sign Up"
              )}
            </button> </span>
          </form>
          <ToastContainer/>
        </div>
      </div>
    </>
  );
}

export default Login;
