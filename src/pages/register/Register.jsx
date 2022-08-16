import axios from "axios";
import { useState, useRef, useContext } from "react";
import "./register.css";
import { useHistory } from "react-router";
import Topbar from "../../components/topbar/Topbar";
import { AuthContext } from "../../context/AuthContext";
import { CircularProgress } from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
export default function Register() {
  const username = useRef();
  const email = useRef();
  const password = useRef();
  const filepickerRef = useRef(null);
  const passwordAgain = useRef();
  const [fetching, setFetching] = useState(false);
  const { setUsers } = useContext(AuthContext);
  const [file, setFile] = useState(null);
  const [fileUrl, setFileUrl] = useState("");
  const {api} = useContext(AuthContext);
  const history = useHistory();
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const handleUpload = (e) => {
    const reader = new FileReader();
    if (e.target.files[0]) {
      reader.readAsDataURL(e.target.files[0]);
      setFile(e.target.files[0]);
      reader.addEventListener("load", (event) => {
        setFileUrl(event.target.result);
      });
    }
  };
  const handleClick = async (e) => {
    e.preventDefault();
    let fileName = "";
    if (passwordAgain.current.value !== password.current.value) {
      passwordAgain.current.setCustomValidity("Passwords don't match!");
    } else {
      if (file) {
        const data = new FormData();
        fileName = Date.now() + file.name;
        data.append("name", fileName);
        data.append("file", file);
        try {
          await axios.post(api+"/upload", data);
        } catch (err) {}
      }
      const user = {
        username: username.current.value,
        email: email.current.value,
        password: password.current.value,
        profilePicture: fileName,
      };
      try {
        const res = await axios.post(api+"/auth/register", user);
        setFetching(true);

        history.push("/login");
      } catch (err) {
        console.log(err);
      }

      
    }
  };
  return (
    <>
      <Topbar />
      <div className="login">
        <div
          className="login-left"
          style={{
            backgroundImage:
              "url(https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTN8fGNoYXR8ZW58MHx8MHx8&auto=format&fit=crop&w=500&q=60)",
          }}
        ></div>
        <div className="login-right">
          <div
            className="profile-avatar"
            onClick={() => filepickerRef.current.click()}
          >
            <img
              src={fileUrl ? fileUrl : PF + "person/noAvatar.png"}
              className="avatar-image"
              alt=""
            />
            <div className="profile-add-icon">
              <AddIcon style={{ textAlign: "center" }} />
            </div>
          </div>
          <form
            className="login-form"
            style={{ top: "20%", left: "10%" }}
            onSubmit={handleClick}
          >
            <label
              style={{
                fontSize: "15px",
                textAlign: "start",
                marginBottom: "5px",
              }}
            >
              Email Address
            </label>

            <input
              className="login-email"
              placeholder="Email Address"
              type="email"
              required
              ref={email}
            />
            <label
              style={{
                fontSize: "15px",
                textAlign: "start",
                marginBottom: "5px",
              }}
            >
              User Name
            </label>
            <input
              className="login-email"
              placeholder="Username"
              type="text"
              required
              ref={username}
            />
            <label
              style={{
                fontSize: "15px",
                textAlign: "start",
                marginBottom: "5px",
              }}
            >
              Enter Password
            </label>
            <input
              placeholder="Password"
              type="password"
              required
              className="login-email"
              minLength={5}
              ref={password}
            />
            <label
              style={{
                fontSize: "15px",
                textAlign: "start",
                marginBottom: "5px",
              }}
            >
              Re-enter password
            </label>
            <input
              placeholder="Password"
              type="password"
              required
              minLength={5}
              className="login-email"
              ref={passwordAgain}
            />
            <button
              type="submit"
              className="login-button"
              style={{ backgroundColor: "#34eb5e" }}
            >
              {fetching ? (
                <CircularProgress color="white" size="20px" />
              ) : (
                "Sign Up"
              )}
            </button>

            <div>
              <input
                ref={filepickerRef}
                type="file"
                hidden
                onChange={handleUpload}
              />
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
