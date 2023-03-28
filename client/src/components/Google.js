import React,{useEffect, useState} from "react";
import axios from "axios"
import { GoogleOAuthProvider,GoogleLogin } from '@react-oauth/google';
import jwt_decode from "jwt-decode";
import {useNavigate} from "react-router-dom"

function Google() {
    
  let navigate = useNavigate();
    const [user,SetUser]= useState(null)
    const [Key,SetKey]= useState(null)
   if (user) {
    takeUserIn(user) 
    }
    async function takeUserIn(user) {
     try {
         const {data} = await axios.post("/api/Oauth/oauthLogin",user)
         localStorage.setItem("token",data.token);
         navigate("/2_factorAuth",{replace:true})
     } catch (error) {
         console.error(error);
     }
    }
 
    useEffect(() => {
      getGoogleID();
      if (localStorage.getItem("token")) {
          navigate("/2_factorAuth", { replace: true })
      }
    async function getGoogleID() {
      try {
       const {data} = await axios.get("/api/Oauth/oauthkey")
       SetKey(data.key)
      } catch (error) {
        console.log(error);
      }
    }
    })
    return (
        <center>
 <GoogleOAuthProvider clientId={Key}>
          <GoogleLogin
            onSuccess={credentialResponse =>SetUser(jwt_decode(credentialResponse.credential))}
            onError={() => console.log('Login Failed')}
          /></GoogleOAuthProvider>
        </center>
               
    )
}

export default Google
