import { useNavigate } from "react-router-dom";
import clock from "./clock_img.jpg";
import React, { useEffect, useState } from "react";
import axios from "axios";
import Alert from "./Alert";
const TwoFactAuth = ({ alert, showAlert }) => {
    const navigate = useNavigate()
    const [UserData, SetUserData] = useState(null)
    const [OTP, SetOTP] = useState(0)
    const [otp, Setotp] = useState(0)
    const [clicked, Setclicked] = useState(null)


    const onChangeHandler = (e) => SetOTP(e.target.value)
    const onSubmitHandler = (e) => {
        try {
            e.preventDefault();
            
            (OTP === otp) ? navigate("/dashboard", { replace: true }) : showAlert({ type: "danger", msg: "Please enter valid OTP" })

        } catch (error) {
            console.error(error);
        }
    }
    const onClickHandler=async (e)=>{
        try {
            e.preventDefault()
            Setclicked(true)
            const {data} = await axios.post("/api/user/otp", UserData)
            console.log(data.pswd);
            Setotp(data.pswd)
        } catch (error) {
            console.log(error)
        }
        

    }
    
    useEffect(() => {
        fetchUser();
        async function fetchUser() {
            try {
                const { data } = await axios.get("/api/user/auth", {
                    headers: {
                        'auth-token': localStorage.getItem("token")
                    }
                });
                SetUserData(data.userDetails);


            } catch (error) {
                localStorage.removeItem("token");
                navigate("/sign");
            }
        }
        // eslint-disable-next-line
    }, []);
    return (
        <>
            <div className="home">
                <div className="container">
                    <center>
                        <h2><b>Almost done! just one step</b> </h2>
                        <div>
                            <img src={clock} alt="img" />
                        </div>
                        
                        <Alert alert={alert} />
                        <div className="btn btn-primary rounded color:blue mb-4 rounded !text-500 text-white">
                        {clicked ? <button onClick={onClickHandler}>resend otp</button> :<button onClick={onClickHandler}>send otp</button>}
                        </div>
                        <form onSubmit={onSubmitHandler}>
                            <label htmlFor="OTP">Enter one-time password that is sent to  </label><br />
                            <input type="text" onChange={onChangeHandler} />
                            
                            <input className="btn btn-primary rounded color:blue mb-4 rounded !text-500 text-white" type="submit" value="Validate" />
                        </form>
                    </center>
                </div>

            </div>
        </>
    )
}

export default TwoFactAuth
