import axios from "axios";
import { useEffect, useState,useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import "./chatOnline.css";

export default function ChatOnline({
  setReceiver,
  conversations,
  setConversations,
  onlineUsers,
  count,
  currentId,
  setCurrentChat,
  users,
}) {
  const [onlineObjects, setOnlineObjects] = useState([]);
  const [search, setSearch] = useState("");
  const {api} = useContext(AuthContext);
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  useEffect(() => {
    let temp = onlineUsers?.filter((o) => o._id !== currentId);
    setOnlineObjects(temp);
  }, [onlineUsers, users]);
  // console.log(onlineObjects);
  const handleSearch = () => {
    if (search.length > 1) {
      return onlineObjects.filter((object) =>
        object.username.toLowerCase().includes(search.toLowerCase())
      );
    } else {
      return onlineObjects;
    }
  };

  const handleClick_1 = async (user) => {
    setReceiver(user);
    // console.log("Chaat online", user);
    try {
      const res = await axios.get(
        api+`/conversations/find/${currentId}/${user._id}`
      );
      // console.log("Hey this is the res",res.data);
      if (res.data?.warn) {
        setCurrentChat(res.data.conv);
        try {
          const result = await axios.get(api+"/conversations/" + currentId);
          console.log("THis is conversation result",result.data);
          setConversations(result.data);
        } catch (err) {
          console.log(err);
        }
      } else {
        setCurrentChat(res.data);
      }
    } catch (err) {
      console.log(err);
    }

    let count = 0;
    for (var i = 0; i < conversations.length; i++) {
      let a = conversations[i]["members"][0];
      let b = conversations[i]["members"][1];
      if (a === currentId && b === user._id) {
        count = 2;
      } else if (a === user._id && b === currentId) {
        count = 2;
      } else {
        count = 0;
      }
    }
    if (count !== 2) {
      try {
        const res_c = await axios.get(api+"/conversations/" + currentId);
        setConversations(res_c.data);
      } catch (err) {
        console.log(err);
      }
    }
  };
  // console.log("These are Online",onlineUsers);
  return (
    <>
      <div className="chatOnline">
        <input
          placeholder="Search for Online Users"
          className="chatMenuInput"
          type="text"
          onChange={(e) => setSearch(e.target.value)}
        />
        {handleSearch()?.map((o) => (
          <div
            key={o?._id}
            className="chatOnlineFriend"
            onClick={() => handleClick_1(o)}
          >
            <div className="chatOnlineImgContainer">
              <img
                className="chatOnlineImg"
                src={
                  o?.profilePicture
                    ? PF + o.profilePicture
                    : PF + "person/noAvatar.png"
                }
                alt=""
              />
              <div className="chatOnlineBadge"></div>
            </div>
            <div
              style={{
                display: "flex",
                flex: "0.8",
                justifyContent: "space-between",
              }}
            >
              <div className="conversationName">{o?.username}</div>
              {
                <div
                  className={
                    count[[o?._id]] && count[[o?._id]] > 0
                      ? "notifications"
                      : "notifications_1"
                  }
                >
                  {count[[o?._id]]}
                </div>
              }
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
