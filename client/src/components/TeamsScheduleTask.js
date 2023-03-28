
import axios from "axios";
import { useState } from "react";
import Loading from "./Loading";
import Alert from "./Alert";
import Navbar from "./Navbar";


function TeamsScheduleTask({ loading, showLoading, alert, showAlert }) {
    // eslint-disable-next-line 
    const [from, Setfrom] = useState("teams")

    //..........................for collecting group emails
    const [emails, setEmails] = useState([]);
    function handleEChange(index, event) {
        const newEmails = [...emails];
        newEmails[index] = event.target.value;
        setEmails(newEmails);
    }
    function handleEAdd() {
        const newEmails = [...emails];
        newEmails.push("");
        setEmails(newEmails);
    }

    function handleERemove(index) {
        const newEmails = [...emails];
        newEmails.splice(index, 1);
        setEmails(newEmails);
    }

    //.................for collecting group phone numbers
    const [phones, setPhones] = useState([]);
    function handlePChange(index, event) {
        const newPhones = [...phones];
        newPhones[index] = event.target.value;
        setPhones(newPhones);
    }
    function handlePAdd() {
        const newPhones = [...phones];
        newPhones.push("");
        setPhones(newPhones);
    }

    function handlePRemove(index) {
        const newPhones = [...phones];
        newPhones.splice(index, 1);
        setPhones(newPhones);
    }
    const [disable, setDisable] = useState(true);
    const [formData, setFormData] = useState({
        taskname: "",
        deadline: "",
        notificationType: "",
        reminder_number: 0,
        email_pool: [],
        phone_pool: [],
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
        }
        else {
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
            formData.email_pool = [...new Set(emails)]
            formData.phone_pool = [...new Set(phones)]
            const { data } = await axios.post("/api/team/add", formData, { headers: { 'auth-token': localStorage.getItem("token") } });
            console.log(formData);
            showAlert({
                type: "success",
                msg: data.success
            });
        } catch (error) {
            console.log(error.response.data.error)
            showAlert({
                type: "danger",
                msg: error.response.data.error
            });
        }
    }




    return (
        <>
            <Navbar from={from} />
            <div style={{ overflow: "auto" }}>
                {loading && <Loading />}
                <div className="main">

                    <Alert alert={alert} />
                    <div className="edit-task">

                        <form onSubmit={handleSubmit} autoComplete="off">
                            <label htmlFor="taskname">
                                <b>Task Name</b>
                            </label><br />
                            <input type="text" placeholder="Enter your taskname" name="taskname" value={formData.taskname} onChange={handleChange} /><br />
                            <label htmlFor="email_pool">
                                <b>Group Emails</b>
                            </label><br />
                            <div>
                                {emails.map((email, index) => (
                                    <div key={index}>
                                        <input type="email" placeholder="Email" value={email} onChange={(event) => handleEChange(index, event)} />
                                        <button type="button" onClick={() => handleERemove(index)}>   Remove   </button>
                                    </div>))}
                                <button type="button" onClick={handleEAdd}>
                                    Add Email
                                </button>
                            </div>
                            <label htmlFor="phone_pool">
                                <b>Group Phone numbers</b>
                                <p>(with country codes)</p>
                            </label><br />

                            <div>
                                {phones.map((phone, index) => (
                                    <div key={index}>
                                        <input type="tel" placeholder="+91-123-456-7890" value={phone} onChange={(event) => handlePChange(index, event)} />
                                        <button type="button" onClick={() => handlePRemove(index)}>  Remove   </button>
                                    </div>))}
                                <button type="button" onClick={handlePAdd}> Add Phone number </button>
                            </div>
                            <label htmlFor="deadline">
                                <b>Deadline</b>
                            </label> <br />
                            <input type="datetime-local" placeholder="Enter your Task Deadline" name="deadline" value={formData.deadline} onChange={handleChange} /><br />
                            <label htmlFor="reminder_number">  <b>Number of reminders your team needs</b> </label><br />
                            <input type="number" placeholder="Enter number of reminders" name="reminder_number" value={formData.reminder_number} onChange={handleChange} /><br />
                            <label htmlFor="notificationType"><b>Notification Type</b></label> <br />

                            <select name="notificationType" onChange={handleChange}>
                                <option value="">Choose your Notification Type</option>
                                <option value="sms">SMS</option>
                                <option value="email">Email</option>
                                <option value="both">Both</option>
                            </select>
                            <hr />
                            <br />
                            <input type="checkbox" name="agree" value={formData.agree} onChange={handleChange} ></input>

                            <label htmlFor="agree">  By clicking Schedule Job Button below, you agree to receive emails  and messages as reminder notifications  </label> <br />
                            <br /><br />
                            <input className="btn btn-primary rounded color:blue mb-4 rounded !text-500 text-white" type="submit" value="Schedule Job" id="button" disabled={disable} />

                        </form></div>
                </div>

            </div>


        </>
    )
}

export default TeamsScheduleTask;