import {Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";
import Loading from "./Loading";
import Alert from "./Alert";
import Navbar from "./Navbar";
import { UserState } from "../Context/UserProvider";
import EditProfile from "./EditProfile";


function Dashboard({ loading, showLoading, alert, showAlert }) {
  const { user, setUser }= UserState()
  let navigate = useNavigate();
  const [phoneEdit,setPhoneEdit]=useState(false)
  const [tasks, setTasks] = useState([]);
  const [edit, setEdit] = useState(false);
  const [taskId, setTaskId] = useState();
  const [formData, setFormData] = useState({
    taskname: "",
    deadline: "",
    notificationType: "",
    isCompleted: false
  });
 


  const OnclickHandler = async (id) => {
    try {
      await axios.delete(`api/task/delete/${id}`, {
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
      isCompleted: ele.isCompleted
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
      const { data } = await axios.put(`/api/task/edit/${id}`, formData, {
        headers: {
          'auth-token': localStorage.getItem("token")
        }
      });
      showAlert({
        type: "success",
        msg: data.success
      });

      let newArray = tasks.filter((task) => {
        return task._id !== id;
      })

      newArray = newArray.push(formData);

      setTasks(newArray);

      navigate("/");


    }
    catch (error) {
      console.log(error.response.data.error)
      console.log(error);
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
 
  // console.log(user);
  // email:"vishnu.teja101.vt@gmail.com"
  // exp:1679675678
  // fname:"vishnu teja"
  // iat:1679672078
  // pro : true
  // user_id:"63fb516bf445a9d6dbd51f7b"
  useEffect(() => {
    async function getTasks() {
      try {
        const { data } = await axios.get("/api/task/", {
          headers: {
            'auth-token': localStorage.getItem("token")
          }
        })
        setTasks(data.tasks);
        const obj = await axios.get("/api/user/auth", {
          headers: {
            'auth-token': localStorage.getItem("token")
          }
        });
        setUser(obj.data.userDetails);
        
      }
      catch (error) {
        console.log(error);
        localStorage.removeItem("token");
        navigate("/");
      }
    }
    getTasks();
    
    // eslint-disable-next-line 
  }, [])
  return (
    <>

      <Navbar from={"ind"} user={user} />
      
      <div className="chinnapapa" >
        {loading && <Loading />}
        {(user) ? <><div className="main">
          <Alert alert={alert} />
          <h1>Hi! <b> {user.fname}</b></h1>
          {phoneEdit && <EditProfile />}
          <Link onClick={()=>setPhoneEdit(!phoneEdit)} >{ phoneEdit? "Cancel edit":"Edit phone number?"}</Link>
         <br />
          {(tasks.length === 0) ? <h2 style={{ textAlign: "center" }}> <b>There are no Jobs currently </b></h2> : (
            <>
              <table id="tasklist">
                <thead>
                  <tr>
                    <th>S. No </th>
                    <th>Task Name</th>
                    <th>Deadline</th>
                    <th>Notification Type</th>
                    <th>Task Status</th>
                    <th >Edit</th>
                    {edit ? null : (<th>Delete</th>)}
                  </tr>
                </thead>
                {edit ? (
                  <tbody>
                    <tr>
                      <td>1</td>
                      <td>
                        <input type="text" placeholder="Enter your taskname" name="taskname" value={formData.taskname} onChange={onChange} />
                      </td>
                      <td>
                        <input type="datetime-local" placeholder="Enter your Task Deadline" name="deadline" value={formData.deadline} onChange={onChange} />
                      </td>
                      <td >
                        <select name="notificationType" onChange={onChange} value={formData.notificationType}>
                          <option value="">
                            Choose your Notification Type
                          </option>
                          <option value="sms">SMS</option>
                          <option value="email">Email</option>
                          <option value="both">Both</option>
                        </select>
                      </td>
                      <td >
                        <input type="checkbox" name="isCompleted" checked={formData.isCompleted} onChange={onChange} ></input>
                      </td>
                      <td>
                        <button className="btn2" onClick={() => { isGonnaSave(taskId) }}> Save </button>
                      </td>
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
                          <td>{ele.isCompleted ? "true" : "false"}</td>
                          <td>{ele.isCompleted ? "Cannot Edit" : <button className="btn2" onClick={() => EditingHandler(ele)}> Edit  </button>}</td>
                          <td><button className="btn2" style={{ color: "red", backgroundColor: "white" }} onClick={() => OnclickHandler(ele._id)}> Delete </button> </td>
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

export default Dashboard;

