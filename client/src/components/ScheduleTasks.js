import {  useNavigate } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";
import Loading from "./Loading";
import Alert from "./Alert";
import Navbar from "./Navbar";

function ScheduleTask({ loading, showLoading,alert,showAlert }) {

    let navigate = useNavigate();
    const [UserData, SetUserData] = useState(null)
    const [disable, setDisable] = useState(true);
    const [formData, setFormData] = useState({
        taskname: "",
        deadline: "",
        notificationType: "",
        agree: ""
    });



    const handleChange = (e) => {

        let name = e.target.name;
        let value = e.target.value;

        if (name === "agree") {
            setFormData({
                ...formData,
                [name]: e.target.checked
            });
            (e.target.checked) ? setDisable(false) : setDisable(true)
        } else {
            setFormData({
                ...formData,
                [name]: value
            });
        }

    }

    const handleSubmit = async (e) => {
        try {
            e.preventDefault();
            formData.deadline = new Date(formData.deadline);
            const { data } = await axios.post("/api/task/add", formData, {
                headers: {
                    'auth-token': localStorage.getItem("token")
                }
            });
            showAlert({
                type: "success",
                msg: data.success
            });
            navigate("/dashboard");
        } catch (error) {
            console.log(error.response.data.error)
            console.log(error);
            showAlert({
                type: "danger",
                msg: error.response.data.error
            });
        }
    }

    useEffect(() => {
        async function fetchUser() {
            try {
                showLoading(true);
                const { data } = await axios.get("/api/user/auth", {
                    headers: {
                        'auth-token': localStorage.getItem("token")
                    }
                });
                showLoading(false);
                 SetUserData(data.userDetails)
            } catch (error) {
                localStorage.removeItem("token");
                showLoading(false);
                navigate("/");
            }
        }
        fetchUser();
        // eslint-disable-next-line
    }, []);


    return (
        <>
            <Navbar  UserData={UserData}/>

            <div style={{ overflow: "auto" }}>
                {loading && <Loading />}
                <div className="main">
                    <Alert alert={alert} />
                    <div className="edit-task">
                    <form onSubmit={handleSubmit} autoComplete="off">
                        <label htmlFor="taskname">
                            <b>Task Name</b>
                        </label><br />
                        <input
                            type="text"
                            placeholder="Enter your taskname"
                            name="taskname"
                            value={formData.taskname}
                            onChange={handleChange}
                        />
                        <label htmlFor="deadline">
                            <b>Deadline</b>
                        </label> <br />
                        <input
                            type="datetime-local"
                            placeholder="Enter your Task Deadline"
                            name="deadline"
                            value={formData.deadline}
                            onChange={handleChange}
                        /><br />
                        <label htmlFor="notificationType"><b>Notification Type</b></label> <br />

                        <select name="notificationType" onChange={handleChange}>
                            <option value="">Choose your Notification Type</option>
                            <option value="sms">SMS</option>
                            <option value="email">Email</option>
                            <option value="both">Both</option>
                        </select>
                        <hr />
                        <br />
                        <input
                            type="checkbox"
                            name="agree"
                            value={formData.agree}
                            onChange={handleChange}
                        ></input>

                        <label htmlFor="agree">
                            By clicking Schedule Job Button below, you agree to receive emails
                            and messages as reminder notifications
                        </label> <br />
                        <br /><br />
                        <input className="btn btn-primary rounded color:blue mb-4 rounded !text-500 text-white" type="submit" value="Schedule Job" id="button" disabled={disable} />
                    </form></div>
                </div>
                
              
            </div>
            
        </>
    )
}

export default ScheduleTask;