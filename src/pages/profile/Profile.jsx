import "./profile.css";
import Topbar from "../../components/topbar/Topbar";
import { useState, useContext, useRef } from "react";
import axios from "axios";
import {  useHistory } from "react-router";
import { AuthContext } from "../../context/AuthContext";
import "react-toastify/dist/ReactToastify.css";
import {  toast } from "react-toastify";
import VisibilityIcon from "@material-ui/icons/Visibility";
import VisibilityOffIcon from "@material-ui/icons/VisibilityOff";
export default function Profile() {
  const { user, dispatch, setUpdate} = useContext(AuthContext);
  let history = useHistory();
  const [username, setUsername] = useState(user.username);
  const [email, setEmail] = useState(user.email);
  const [password, setPassword] = useState(user.unhashedPassword);
  const [newPassword, setNewPassword] = useState(user.unhashedPassword);
  const filePickerRef = useRef();
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState(user.profilePicture);
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const [localFile, setLocalFile] = useState(PF + (user.profilePicture?user.profilePicture:"person/noAvatar.png"));
  const [passwordShown, setPasswordShown] = useState(false);
  const [passwordShown_1, setPasswordShown_1] = useState(false);
  const {api} = useContext(AuthContext);
  const togglePassword_1 = () => {
    setPasswordShown_1(!passwordShown_1);
  };
  const togglePassword = () => {
    setPasswordShown(!passwordShown);
  };
  const handleUpload = (e) => {
    const reader = new FileReader();
    if (e.target.files[0]) {
      reader.readAsDataURL(e.target.files[0]);
      setFile(e.target.files[0]);
      reader.addEventListener("load", (event) => {
        setLocalFile(event.target.result);
      });
    }
  };
  const handleSubmit = async (e) => {
    let fileName_1 = user.profilePicture;
    e.preventDefault();
    if (password !== newPassword) {
      toast("Passwords do not match !!");
    } else {
      if (file) {
        const data = new FormData();
        fileName_1 = Date.now() + file.name;
        setFileName(fileName);
        data.append("name", fileName_1);
        data.append("file", file);
        try {
          await axios.post(api+"/upload", data);
        } catch (err) {}
      }

      const user_1 = {
        username: username,
        email: email,
        password: password,
        profilePicture: fileName_1,
        unhashedPassword:password
      };
      try {
        const res = await axios.put(api+`/users/${user._id}`, user_1);
        console.log("Update Response", res.data);
        dispatch({ type: "UPDATE", payload: res.data });
        setUpdate((prev) => {
          return prev + 1;
        });
        history.push("/chat");
      } catch (err) {
        console.log(err);
      }
    }
  };
  return (
    <>
      <Topbar />
      <div className="profile">
        <div className="profile-left">
          <img src={localFile} alt=""/>
          <div
            className="profile-upload"
            onClick={() => filePickerRef.current.click()}
          >
            <button type="button">
              Upload Image
              <input
                ref={filePickerRef}
                type="file"
                hidden
                onChange={handleUpload}
              />
            </button>
          </div>
        </div>
        <div className="profile-right">
          <form className="profile-form" onSubmit={handleSubmit}>
            <div>
              <label>Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="profile-form-input"
              />
            </div>
            <div>
              <label>Email</label>
              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="profile-form-input"
              />
            </div>
            <div>
              <label>New Password</label>
              <input
                type={passwordShown ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="profile-form-input"
              />
              <div onClick={togglePassword}>
                {passwordShown && <VisibilityIcon style={{cursor:"pointer",color:"violet"}}/>}
                {!passwordShown && <VisibilityOffIcon style={{cursor:"pointer",color:"violet"}}/>}
              </div>
            </div>
            <div>
              <label>Re Enter New Password</label>
              <input
                type={passwordShown_1 ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="profile-form-input"
              />
              <div onClick={togglePassword_1}>
                {passwordShown_1 && <VisibilityIcon style={{cursor:"pointer",color:"violet"}}/>}
                {!passwordShown_1 && <VisibilityOffIcon style={{cursor:"pointer",color:"violet"}}/>}
              </div>
            </div>
            <div className="form-button">
              <button type="submit"> Update Profile</button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
