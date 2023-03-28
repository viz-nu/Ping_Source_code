
import { useNavigate } from "react-router-dom";
import { useState,useEffect } from "react";
import Alert from "./Alert";
import axios from 'axios';
import Loading from "./Loading";

function Register({ alert, showAlert, loading, showLoading, handleTabClick }) {
  let navigate = useNavigate();
  const [registerData, setRegisterData] = useState({
    fname: "",
    email: "",
    phone: "",
    password: "",
    password2: ""
  });

  const onChangeHandler = (e) => {
    setRegisterData({
      ...registerData,
      [e.target.name]: e.target.value
    });
  }
  const onSubmitHandler = async (e) => {
    try {
      e.preventDefault();
      if (registerData.password !== registerData.password2) {
        showAlert({
          type: "danger",
          msg: "Passwords do not match"
        });

      } else {

        showLoading(true);
        showAlert({
          type: "success",
          msg: "Passwords do match"
        });
        // console.log(registerData);
        const { data } = await axios.post("/api/user/register", registerData);
        showLoading(false);
        showAlert({
          type: "success",
          msg: data.success
        });
        localStorage.setItem("token", data.token);
        navigate("/2_factorAuth", { replace: true })        
      }
    } catch (error) {
      // console.log(error.response.data.errors[0].msg);
      showAlert({
        type: "danger",
        msg: error.response.data.errors[0].msg
      })
      showLoading(false);
    }
  }
  useEffect(() => {
    if (localStorage.getItem("token")) {
      console.log("token exists", localStorage.getItem("token"));
      navigate("/2_factorAuth", { replace: true })
    }
  });
  return (

      <div>

            {loading && <Loading />}
        <center>
          <Alert alert={alert} />
          <form onSubmit={onSubmitHandler} autoComplete="off">
            {/* <label htmlFor="fname"><b>Full Name : </b></label> */}
            <input type="text" name="fname" placeholder="Enter Fullname" onChange={onChangeHandler} style={{ "width": "50%" }} /><br />
            {/* <label htmlFor="email"><b>Email : </b></label> */}
            <input type="email" name="email" placeholder="Enter Email"  onChange={onChangeHandler} style={{ "width": "50%" }} /><br />
            {/* <label htmlFor="phone number" ><b>Phone Number(with country code):</b></label><br/> */}
            <input type="tel" name="phone" placeholder="+91-123-456-7890"  onChange={onChangeHandler} style={{ "width": "50%" }}  /><br />
            {/* <label htmlFor="lname"><b>Password</b></label> */}
            <input type="password" name="password" placeholder="Enter Password"  onChange={onChangeHandler} style={{ "width": "50%" }}  /><br />
            {/* <label htmlFor="lname"><b>Confirm Password</b></label> */}
            <input type="password" name="password2" placeholder="Re-enter Password"  onChange={onChangeHandler}  style={{ "width": "50%" }} /><br />
            <input type="submit" value="Register" className="btn btn-primary rounded color:pink mb-4 rounded !text-500 hover:text-white"/>
          </form>
          <p>Already have an account ? <button className="!text-blue-500 hover:!text-white-500" onClick={() => handleTabClick('pills-login')} > Login </button></p>
        </center>
      </div>


  )
}

export default Register;















