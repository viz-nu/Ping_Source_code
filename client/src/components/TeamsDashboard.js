import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";
import Loading from "./Loading";
import Alert from "./Alert";
import Navbar from "./Navbar";
import { UserState } from "../Context/UserProvider";

function TeamsDashboard({ loading, showLoading, alert, showAlert }) {
  const { user } = UserState()
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


  let navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [edit, setEdit] = useState(false);
  const [taskId, setTaskId] = useState();
  const [formData, setFormData] = useState({
    taskname: "",
    deadline: "",
    notificationType: "",
    isCompleted: false
  });
  const [analytics, SetAnalytics] = useState("Click To See")

  const OnclickHandler = async (id) => {
    try {


      await axios.delete(`api/team/delete/${id}`, {
        headers: {
          'auth-token': localStorage.getItem("token")
        }
      });

      const newArray = tasks.filter((task) => {
        return task._id !== id;
      })
      setTasks(newArray);
    }
    catch (error) {
      console.log(error);

    }
  }

  const EditingHandler = (ele) => {
    setEdit(true);
    setTaskId(ele._id);
    setFormData({
      taskname: ele.taskname,
      deadline: ele.deadline,
      notificationType: ele.notificationType,
      isCompleted: ele.isCompleted,
      teamMemberEmails: ele.teamMemberEmails,
      teamMemberPhones: ele.teamMemberPhones,
      reminder_number: ele.reminders.length
    })

  }

  const onChange = (e) => {

    let name = e.target.name;
    let value = e.target.value;


    if (name === "isCompleted") {
      setFormData({
        ...formData,
        [name]: e.target.checked
      });

    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }

  }

  const isGonnaSave = async (id) => {
    try {
      formData.deadline = new Date(formData.deadline);
      formData.email_pool = [...new Set(emails)]
      formData.phone_pool = [...new Set(phones)]
      const { data } = await axios.put(`/api/team/edit/${id}`, formData, {
        headers: {
          'auth-token': localStorage.getItem("token")
        }
      });
      showAlert({
        type: "success",
        msg: data.success
      });

      let newArray = tasks.filter((task) => task._id !== id)
      newArray = newArray.push(formData);
      setTasks(newArray);
      window.location.reload(false);
    }
    catch (error) {
      console.log(error.response.data.error)
      showAlert({
        type: "danger",
        msg: error.response.data.error
      });
    }
  }

  const convertDate = (date) => {
    const d = new Date(date);
    return d.toLocaleString();
  }
  async function getTasks() {
    try {
      const { data } = await axios.get("/api/team/", {
        headers: {
          'auth-token': localStorage.getItem("token")
        }
      })
      setTasks(data.tasks);
    }
    catch (error) {
      console.log(error);
      localStorage.removeItem("token");
      navigate("/");
    }
  }
  useEffect(() => {
    getTasks();
    // eslint-disable-next-line 
  }, [])
  return (
    <>
      <Navbar from={from} />

      <div >
        {loading && <Loading />}
        <Alert alert={alert} />
        {(user) ? <><div className="main">

          <h2>Hi! <b>{user.fname}</b></h2>
          {(tasks.length === 0) ? <h2 style={{ textAlign: "center" }}> <b>There are no Jobs currently </b></h2> : (
            <>
              <table id="tasklist">
                <thead>
                  <tr>
                    <th>S. No </th>
                    <th>Task Name</th>
                    <th>Deadline</th>
                    <th>Notification Type</th>
                    <th>Team emails</th>
                    <th>Phone numbers</th>
                    <th>Task Status</th>
                    <th >Edit</th>
                    {edit ? null : (<th>Delete</th>)}
                    <th>Remainders yet to come</th>
                  </tr>
                </thead>
                {edit ? (
                  <tbody>
                    <tr>
                      <td>1</td>
                      <td>  <input type="text" placeholder="Enter your taskname" name="taskname" value={formData.taskname} onChange={onChange} /> </td>
                      <td>  <input type="datetime-local" placeholder="Enter your Task Deadline" name="deadline" value={formData.deadline} onChange={onChange} />  </td>
                      <td >
                        <select name="notificationType" onChange={onChange} value={formData.notificationType}>
                          <option value=""> Choose your Notification Type  </option>
                          <option value="sms">SMS</option>
                          <option value="email">Email</option>
                          <option value="both">Both</option>
                        </select>
                      </td>
                      <td>
                        <div>
                          {emails.map((email, index) => (
                            <div key={index}>
                              <input type="email" placeholder="Email" value={email} onChange={(event) => handleEChange(index, event)} />
                              <button type="button" onClick={() => handleERemove(index)}> Remove </button>
                            </div>))}
                          <button type="button" onClick={handleEAdd}> Add Email  </button>
                        </div>
                      </td>
                      <td>

                        <div>
                          {phones.map((phone, index) => (
                            <div key={index}>
                              <input type="tel" placeholder="+91-123-456-7890" value={phone} onChange={(event) => handlePChange(index, event)} />
                              <button type="button" onClick={() => handlePRemove(index)}>   Remove </button>
                            </div>))}
                          <button type="button" onClick={handlePAdd}> Add Phone number</button>
                        </div>
                      </td>
                      <td>
                        <input type="checkbox" name="isCompleted" checked={formData.isCompleted} onChange={onChange} ></input>
                      </td>
                      <td>
                        <button className="btn2" onClick={() => { isGonnaSave(taskId) }}> Save </button>
                      </td>
                      <td><input type="number" placeholder="number of reminders" name="reminder_number" value={formData.reminder_number} onChange={onChange} /></td>
                    </tr>
                  </tbody>
                ) : (
                  <tbody>
                    {
                      tasks.map((ele, index) => (
                        <tr key={index}>
                          <td>{index + 1}</td>
                          <td>{ele.taskname}</td>
                          <td>{convertDate(ele.deadline)}</td>
                          <td>{ele.notificationType}</td>
                          <td>{ele.teamMemberEmails.map((element, i) => (<li key={i}>{element}</li>))}</td>
                          <td>{ele.teamMemberPhones.map((element, i) => (<li key={i}>{element}</li>))}</td>
                          <td>{ele.isCompleted ? "true" : "false"}</td>
                          <td>{ele.isCompleted ? "Cannot Edit" : <button className="btn2" onClick={() => EditingHandler(ele)}> Edit  </button>}</td>
                          <td><button className="btn2" style={{ color: "red", backgroundColor: "white" }} onClick={() => OnclickHandler(ele._id)}> Delete </button> </td>
                          <td><button onClick={() => {
                            let Totalnum = ele.reminders.length, num = ele.reminders.filter((e) => (new Date(e) > new Date())).length
                            SetAnalytics(`${num}/${Totalnum}`);
                          }}>{analytics}</button></td>
                        </tr>

                      ))}
                  </tbody>
                )}
              </table>
            </>
          )}
        </div>
        </> : <></>}
      </div>
    </>
  )

}

export default TeamsDashboard
