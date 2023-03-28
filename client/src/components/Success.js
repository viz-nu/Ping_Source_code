import React from 'react'
import {Link} from "react-router-dom"
import { useEffect } from "react";
import axios from "axios"
import Alert from "./Alert";
const Success = ({alert,showAlert}) => {
useEffect(() => {
makepro()
async function makepro() {
    try {
        const {data} = await axios.post("/api/pay/userToPro",{},{ headers:{ 'auth-token' : localStorage.getItem("token") } })
        localStorage.setItem("token",data.token);
        showAlert({
            type: "success",
            msg: "Celebrate! payment successfull"
          });
    } catch (error) {
     console.log(error);   
    }
}
}, [])
    return (
        <div>
            <Alert alert={alert} />
            <Link to="/dashboard" >Back to Dashboard</Link>
        </div>
    )
}

export default Success
