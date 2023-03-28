import { Link, useNavigate } from "react-router-dom";
import axios from "axios"
import { UserState } from "../Context/UserProvider";
const Navbar = ({ from}) => {
    let navigate = useNavigate();
    const { user } = UserState()
    console.log(from,user);
const clickHandlerPayments = async (e) => {
    try {
      e.preventDefault()
      console.log("before call");
      const { data } = await axios.post("/api/pay/checkout", {}, { headers: { 'auth-token': localStorage.getItem("token") } })
      window.location.href = data.url;
      console.log("after call");
    }
    catch (error) { console.log(error); }
  }
    const logout = () => {
        localStorage.removeItem("token");
        navigate('/');
      }

    return (
        <div className="nav" >
        <nav id="header" className="fixed w-full text-white">
           
           <div className="w-full mx-auto flex flex-wrap color-blue  justify-between ">
               <div className="pl-4 flex items-center">
               <p className="toggleColour text-white no-underline font-bold text-2xl lg:text-4xl" >
                       <svg className="h-8 fill-current inline" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" width="24" height="25">
                           <g style={{ animation: "mobile-vibration 1.5s linear infinite both" }}>
                               <path fill="#f0f0f2" fillRule="evenodd" d="M11.55 4.097c-1.275-.341-2.6.469-2.96 1.81L5.75 16.505c-.359 1.341.384 2.705 1.66 3.047l5.04 1.35c1.275.342 2.6-.468 2.96-1.81l2.84-10.597c.359-1.341-.384-2.705-1.66-3.047l-5.04-1.35zm-1.7 2.148c.164-.61.766-.978 1.346-.823l.31.083c-.03.07-.055.142-.075.217-.216.804.23 1.623.995 1.828l1.68.45c.765.205 1.56-.28 1.776-1.086.02-.075.035-.15.044-.225l.31.083c.58.156.917.776.753 1.386l-2.84 10.597c-.162.61-.765.978-1.345.823l-5.04-1.35c-.58-.156-.917-.776-.754-1.386L9.85 6.245zm2.82-.428l2.091.56c.04.071.053.158.03.245a.313.313 0 01-.377.23l-1.68-.45a.312.312 0 01-.211-.388.328.328 0 01.147-.197z" clipRule="evenodd" />
                               <path stroke="#f5f6fa" strokeLinecap="round" strokeWidth="1.5" d="M6.312 8.905L5.277 12.77m13.446-.539l-1.035 3.864" />
                           </g>
                       </svg>
                            <Link to="/dashboard">Ping</Link> 
                       
                   </p>
               </div>
               <div className="block lg:hidden pr-4" >
                   <button id="nav-toggle" className="flex items-center p-1 text-pink-800 hover:text-gray-900 focus:outline-none focus:shadow-outline transform transition hover:scale-105 duration-300 ease-in-out">
                       <svg className="fill-current h-6 w-6" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                           <title>Menu</title>
                           <path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z" />
                       </svg>
                   </button>
               </div>
               <div className="w-full flex-grow lg:flex lg:items-center lg:w-auto hidden mt-2 lg:mt-0  lg:bg-transparent text-black p-4 lg:p-0 z-20" id="nav-content">
                   <ul className="list-reset lg:flex justify-end flex-1 items-center" >
                            {user ?
                             <li className="mr-3">
                                {from === "teams" ? 
                                <Link to="/dashboard">Individual mode</Link> 
                                :
                                <>
                                            {(user.pro) ? <Link to="/TeamsDashboard">Switch to teams mode</Link> : <button className="inline-block py-2 px-4 bg-transparent text-white font-bold" onClick={clickHandlerPayments}>UPGRADE</button>}
                            </> 
                            }</li> :<></>}
                       <li className="mr-3">
                                <Link className="inline-block py-2 px-4 bg-transparent text-white font-bold" to={from === "teams" ? "/TeamsDashboard/add":"/dashboard/add"}>Add a new task</Link>
                       </li>
                       <li className="mr-3">
                           <button onClick={logout} className="inline-block py-2 px-4 bg-transparent text-white font-bold" to="">Logout</button>
                       </li>

                   </ul>

               </div>
           </div>
       </nav><br/>
   </div>
        
    )
}

export default Navbar
