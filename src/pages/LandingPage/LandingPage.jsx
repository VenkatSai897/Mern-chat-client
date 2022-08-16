import React from 'react'
import Topbar from '../../components/topbar/Topbar'
import './Landingpage.css'
import QuestionAnswerIcon from '@material-ui/icons/QuestionAnswer';
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useHistory } from "react-router-dom";
function LandingPage() {
  const { user } = useContext(AuthContext);
  let history = useHistory();
  const handleChange=()=>{
    if(user){
      history.push('/chat');
    }
    else{
      history.push('/login');
    }
  }
  return (
    <div>
        <Topbar/>
        <div className = "banner">
          <div className="banner-left">
          <div>
            <div style={{marginBottom:"10px",fontSize:"30px"}}>
            <h1 >Share the world with your friends</h1>
            </div>
            <div style={{marginBottom:"10px"}}>
            <p>Chat App lets you connect with the world</p>
            </div>
          </div>
              <div className='banner-button'onClick={handleChange}>
              <span style={{marginLeft:"4px"}} >Get Started </span>
              <QuestionAnswerIcon/>
              
              </div>
          </div>
          <div className='banner-right'>
            
          </div>
        </div>
    </div>
  )
}

export default LandingPage