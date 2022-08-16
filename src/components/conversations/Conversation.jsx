import "./conversation.css";

export default function Conversation({otherMember,count}) {  
  // console.log(otherMember)
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const {_id,username,profilePicture} = otherMember;
  return (
    <div className="conversation">
      <div style={{position:"relative",display:"flex",flex:"0.2"}}>      
        <img
        className="conversationImg"
        src={
          profilePicture
            ? PF + profilePicture
            : PF + "person/noAvatar.png"
        }
        alt=""
      />
      
      </div>
      <div style={{display:"flex",flex:"0.8",justifyContent:"space-between"}}>
      <div className="conversationName">{username}</div>
      {<div className={count[[_id]]&&count[[_id]]>0?"notifications":"notifications_1"} >{count[[_id]]}</div>}
      </div>
    </div>
  );
}
