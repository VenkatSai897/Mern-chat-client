import "./topbar.css";
import { Forum } from "@material-ui/icons";
import { Link } from "react-router-dom";
import { useContext} from "react";
import { AuthContext } from "../../context/AuthContext";
import { useHistory } from "react-router-dom";
import { io} from "socket.io-client";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
export default function Topbar() {
  const { user, dispatch} = useContext(AuthContext);
  const PF = process.env.REACT_APP_PUBLIC_FOLDER
  let history = useHistory();
  const handleLogout = () => {
    let userId = user._id;
    dispatch({ type: "LOGOUT" });
    io("https://mern-chat-1.herokuapp.com").emit("deleteUser",userId);
    localStorage.clear();
    history.push('/');
  };
  const handleChat = () => {
    if (user) {
      history.push("/chat");
    } else {
      toast("Please login to continue to chat");
    }
  };
  return (
    <div className="topbarContainer">
      <div className="topbarLeft">
        <Link to="/" className="logo">
          <div style={{ marginRight: "20px" }}>
            <Forum />
          </div>
          <div style={{ border: "none" }}>
            <span>Chat App</span>
          </div>
        </Link>
      </div>
      <div className="topbarRight">
        <div className="topbarButtons">
        <div className="topbarButton" onClick={handleChat}>
          Chat
        </div>
        <ToastContainer/>
        {!user && (
          <>
            <div
              className="topbarButton"
              onClick={() => history.push("/login")}
            >
              Sign In
            </div>
          </>
        )}

        {user && (
          <>
            <div
              className="topbarButton"
              onClick={handleLogout}
            >
              Logout
            </div>

            </>
        )}
        </div>
        <div className="topBarAvatar">
        {user&&(
          <>
            <Link to={`/profile/${user._id}`} style={{textDecoration:"none",cursor:"pointer"}}>
              <img
                src={
                  user.profilePicture
                    ? PF+user.profilePicture
                    : PF + "person/noAvatar.png"
                }
                alt=""
                className="topbarImg"
              />
              <p style={{ color: "white" }}>{user.username}</p>
            </Link>
          </>
        )}
        </div>
      </div>
    </div>
  );
}
