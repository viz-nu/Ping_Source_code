
import Alert from "./Alert";
import { useState, useEffect } from "react";
import axios from 'axios'
import { Link, useNavigate } from "react-router-dom";
import Loading from "./Loading";

function Login({ alert, showAlert, loading, showLoading ,handleTabClick }) {
  const navigate = useNavigate()

  useEffect(() => {
    if (localStorage.getItem("token")) {
      console.log("token exists", localStorage.getItem("token"));
      navigate("/2_factorAuth", { replace: true })
    }
  });

  const [loginData, setLoginData] = useState({
    email: "",
    password: ""
  });
  const onChangeHandler = (e) => {
    setLoginData({
      ...loginData,
      [e.target.name]: e.target.value
    });
  }

  const onSubmitHandler = async (e) => {
    try {
      e.preventDefault();
      showLoading(true);
      const { data } = await axios.post("/api/user/login", loginData);
      showLoading(false);
      localStorage.setItem("token", data.token);
      navigate("/2_factorAuth", { replace: true })
    } catch (error) {
      if (localStorage.getItem("token")) { localStorage.removeItem("token") }
      console.log(error);

      showAlert({
        type: "danger",
        msg: error.response.data.error
      })
      showLoading(false);
    }
  }
  return (
    <div>
      {loading && <Loading />}
      <center>
        <Alert alert={alert} />
        <form onSubmit={onSubmitHandler} >
            <label htmlFor="email"><b>Email</b></label><br />
            <input type="email" name="email" onChange={onChangeHandler} style={{ "width": "50%" }} placeholder="acz@xyz.com"/><br />
            <label htmlFor="password"><b>Password</b></label><br />
            <input type="password" name="password" style={{ "width": "50%" }} onChange={onChangeHandler} placeholder="Enter password"/><br />
          <Link to="/ResetPwd" className="text-pink-500  hover:underline"><b> Forgot password ?</b> </Link><br />
          <input type="submit" value="Login" className="btn btn-primary rounded color:pink mb-4 rounded !text-500 hover:text-white" />
        </form>
        <p> Not a member ? <button className="!text-pink-500 hover:!text-white-500 " onClick={() => handleTabClick('pills-register')} > Register</button></p>
      </center>
    </div>
  );
}

export default Login;