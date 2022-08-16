import "./messenger.css";
import Topbar from "../../components/topbar/Topbar";
import Conversation from "../../components/conversations/Conversation";
import Message from "../../components/message/Message";
import ChatOnline from "../../components/chatOnline/ChatOnline";
import { useContext, useEffect, useRef, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import axios from "axios";
import { io } from "socket.io-client";
import { Send } from "@material-ui/icons";
export default function Messenger() {
  const [conversations, setConversations] = useState(JSON.parse(localStorage.getItem("conversations")) || []);
  const [currentChat, setCurrentChat] = useState(JSON.parse(localStorage.getItem("currentChat")) || null);
  const [messages, setMessages] = useState(JSON.parse(localStorage.getItem("messages")) || []);
  const [newMessage, setNewMessage] = useState("");
  const [arrivalMessage, setArrivalMessage] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState(JSON.parse(localStorage.getItem("onlineUsers")) || []);
  const [receiver, setReceiver] = useState(JSON.parse(localStorage.getItem("receiver")) || null);
  const [receiverStatus, setReceiverStatus] = useState("offline");
  const [currentIndex, setCurrentIndex] = useState(JSON.parse(localStorage.getItem("currentIndex")) || -1);
  const [search, setSearch] = useState("");
  const { user, users, count, setCount, update, setUsers } =
    useContext(AuthContext);
  const scrollRef = useRef();
  const [tracker, setTracker] = useState(JSON.parse(localStorage.getItem("tracker")) || {});
  const [updatedId, setUpdatedId] = useState(JSON.parse(localStorage.getItem("updatedId")) || "");
  const socket = useRef();
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const { api } = useContext(AuthContext);
  useEffect(()=>{
    localStorage.setItem("conversations", JSON.stringify(conversations));
  },[conversations])
  useEffect(()=>{
    localStorage.setItem("currentChat", JSON.stringify(currentChat));
  },[currentChat])
  useEffect(()=>{
    localStorage.setItem("messages", JSON.stringify(messages));
  },[messages])
  useEffect(()=>{
    localStorage.setItem("onlineUsers", JSON.stringify(onlineUsers));
  },[onlineUsers])
  useEffect(()=>{
    localStorage.setItem("receiver", JSON.stringify(receiver));
  },[receiver]);
  useEffect(()=>{
    localStorage.setItem("currentIndex", JSON.stringify(currentIndex));
  },[currentIndex]);
  useEffect(()=>{
    localStorage.setItem("updatedId", JSON.stringify(updatedId));
  },[updatedId]);
  useEffect(()=>{
    localStorage.setItem("updatedId", JSON.stringify(tracker));
  },[tracker]);
  useEffect(() => {
    socket.current = io("https://mern-chat-1.herokuapp.com");
    socket.current?.on("getMessage", (data) => {
      setArrivalMessage({
        sender: data?.senderId,
        text: data?.text,
        createdAt: Date.now(),
      });
      setCount(data?.notifications);
    });
  }, []);
  useEffect(() => {
    arrivalMessage &&
      currentChat?.members.includes(arrivalMessage.sender) &&
      setMessages((prev) => [...prev, arrivalMessage]);
  }, [arrivalMessage, currentChat]);
  ////console.log("Messages", messages);

  socket.current?.on("getUsers", (data) => {
    setOnlineUsers(data?.users);
    if (data?.id) {
      setUpdatedId(data?.id);
      setTracker(data?.update_track);
    }
  });

  //console.log("Update", update);
  useEffect(() => {
    //console.log(socket.current);
    //console.log("daaa");
    socket.current?.emit("updatedUser", user);
  }, [update]);

  useEffect(() => {
    const getUpdatedUser = async () => {
      try {
        const res = await axios.get(api + "/users?userId=" + updatedId);
        setUsers((current) => {
          return current?.map((o) => {
            if (o._id === updatedId) {
              return { ...o, ...res.data };
            } else {
              return o;
            }
          });
        });
        if (updatedId === receiver?._id) {
          setReceiver(res.data);
        }
      } catch (err) {
        console.log(err);
      }
    };
    if (updatedId) {
      getUpdatedUser();
    }
  }, [tracker?.[updatedId]]);

  useEffect(() => {
    if (user) {
      socket.current?.emit("addUser", user);
    }
    socket.current?.on("getUsers", (data) => {
      setOnlineUsers(data?.users);
    });
  }, [user]);

  useEffect(() => {
    ////console.log("Is this receiver called");
    setReceiverStatus(
      onlineUsers?.find((m) => m?._id === receiver?._id) ? "online" : "offline"
    );
  }, [onlineUsers, receiver]);
  ////console.log("current chat ",currentChat)
  useEffect(() => {
    const getConversations = async () => {
      try {
        const res = await axios.get(api + "/conversations/" + user._id);
        setConversations(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    if (user) {
      getConversations();
    }
  }, [user._id]);

  useEffect(() => {
    const getMessages = async () => {
      try {
        const res = await axios.get(api + "/messages/" + currentChat?._id);
        setMessages(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    if (currentChat?._id) {
      getMessages();
    }
  }, [currentChat]);
  const handleSearch = () => {
    let conv_1 = [];
    
    if (users.length > 0 && conversations.length > 0) {
      let conv_ids = conversations?.map((c) =>
        c?.members?.find((mem) => mem !== user._id)
      );
      let conv_otherMember = conv_ids?.map((o) => {
        let x = users.find((l) => l._id === o);
        //console.log("X value is ", x);
        if (x) {
          return x;
        } else {
          const getNewData = async () => {
            try {
              const res = await axios.get(api + "/users?userId=" + o);
              setUsers((u) => [...u, res.data]);
              return res.data;
            } catch (err) {
              console.log(err);
              return null;
            }
          };
          return getNewData();
        }
      });
      conv_1 = conv_ids?.map((obj, ind) => ({
        ...conversations[ind],
        otherMember: conv_otherMember[ind],
      }));
      //console.log(conv_1);
      if (search.length > 1) {
        return conv_1.filter((c, index) =>
          c?.otherMember?.username?.toLowerCase().includes(search.toLowerCase())
        );
      } else {
        return conv_1;
      }
    }
    return [];
  };
  ////console.log("THis is the count values",count);
  const handleConversation = (conversation, index) => {
    const friendId = conversation.members.find((m) => m !== user?._id);
    const getUser = async () => {
      try {
        const res = await axios(api + "/users?userId=" + friendId);
        let ids = onlineUsers.map((key) => key._id);
        setReceiverStatus(
          ids.find((m) => m === friendId) !== -1 ? "online" : "offline"
        );
        setReceiver(res.data);

        setCurrentIndex(index);
      } catch (err) {
        console.log(err);
      }
    };
    
    getUser();
    setCurrentChat(conversation);
  
  };

  ////console.log("Receiver ",receiver);
  useEffect(() => {
    if (receiver?._id.length > 0 && user?._id.length > 0) {
      socket.current?.emit("read", {
        receiverId: user?._id,
        senderId: receiver?._id,
      });

      setCount((prev) => ({ ...prev, [[receiver?._id]]: 0 }));
    }
  }, [count?.[receiver?._id]]);
  // //console.log(conversations);
  const handleSubmit = async (e) => {
    e.preventDefault();
    const receiverId = currentChat?.members?.find(
      (member) => member !== user?._id
    );
    const message = {
      sender: user?._id,
      text: newMessage,
      conversationId: currentChat?._id,
    };
    socket.current.emit("sendMessage", {
      senderId: user?._id,
      receiverId,
      text: newMessage,
    });

    if(message){
    try {
      const res = await axios.post(api + "/messages", message);
      setMessages([...messages, res.data]);
      setNewMessage("");
    } catch (err) {
      console.log(err);
    }
  }
  };
  ////console.log("Count 2", count);
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);
  return (
    <>
      <Topbar />
      <div className="messenger">
        <div className="chatMenu">
          <div className="chatMenuWrapper">
            <input
              placeholder="Search for friends"
              className="chatMenuInput"
              type="text"
              onChange={(e) => setSearch(e.target.value)}
            />
            {handleSearch().map((c, index) => (
              <div
                className={index === currentIndex ? "conv-sel" : "conv"}
                onClick={() => {
                  handleConversation(c, index);
                }}
              >
                <Conversation count={count} otherMember={c?.otherMember} />
              </div>
            ))}
          </div>
        </div>
        <div className="chatBox">
          <div className="chatBoxWrapper">
            {currentChat ? (
              <>
                <div className="chatBoxTopBar">
                  <div className="chatTopText">
                    <img
                      className="conversationImg"
                      src={
                        receiver?.profilePicture
                          ? PF + receiver.profilePicture
                          : PF + "person/noAvatar.png"
                      }
                      alt=""
                    />
                    <div style={{ display: "flex", flexDirection: "column" }}>
                      <span>{receiver?.username}</span>
                      <span style={{ fontSize: "12px" }}>{receiverStatus}</span>
                    </div>
                  </div>
                </div>
                <div className="chatBoxMain">
                  {messages.length > 0 &&
                    messages.map((m) => (
                      <div ref={scrollRef} key={m?._id}>
                        <Message message={m} own={m.sender === user._id} />
                      </div>
                    ))}
                </div>
                <div className="chatBoxBottom">
                  <form
                    style={{
                      width: "100%",
                      display: "flex",
                      justifyContent: "space-between",
                      marginRight: "10px",
                      alignItems: "center",
                    }}
                    onSubmit={handleSubmit}
                  >
                    <input
                      className="chatMessageInput"
                      placeholder="Send Message  ..."
                      onChange={(e) => setNewMessage(e.target.value)}
                      value={newMessage}
                    ></input>

                    <button className="chatSubmitButton" type="submit">
                      <Send />
                    </button>
                  </form>
                </div>
              </>
            ) : (
              <span className="noConversationText">
                Open a conversation to start a chat.
              </span>
            )}
          </div>
        </div>
        <div className="chatOnline">
          <div className="chatOnlineWrapper">
            <ChatOnline
              setReceiver={setReceiver}
              conversations={conversations}
              setConversations={setConversations}
              onlineUsers={onlineUsers}
              count={count}
              users={users}
              currentId={user._id}
              setCurrentChat={setCurrentChat}
            />
          </div>
        </div>
      </div>
    </>
  );
}
