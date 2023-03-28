import { Link } from "react-router-dom";
import hero from "./hero1.png"
import React, { useState } from "react";
import Sign from './Sign';

function Home({ alert, showAlert, loading, showLoading }) {
    const [click, setclick] = useState()
    const clicked = () => {
        setclick(true)
    }
    return (
        <div className=" text-white " style={{ "background": "linear-gradient(90deg, #3633d5 0%, #da51c5 100%)" }} >
            <div className="pt-32"  >
                <div className=" px-3  flex   items-center">
                        {click ?
                        <div className="flex flex-col w-full md:w-3/5 justify-center items-start ">
                            <Sign alert={alert} showAlert={showAlert} loading={loading} showLoading={showLoading} />
                        </div>
                            :
                        (<div className="flex flex-col w-full md:w-3/5 items-start text-center md:text-left">
                            <h1 className="uppercase tracking-loose w-full"><b>Problem with frequent distractions ?</b></h1>
                                <h1 className="my-4 text-5xl font-bold leading-tight">
                                    Get on your toes using Ping!
                                </h1>
                                <p className="leading-normal text-2xl mb-8">
                                    Reminds your deadlines in fixed intervals to prevent stressful last-minute scramble
                                </p>
                                <br />
                                <Link onClick={clicked} className="mx-auto lg:mx-0 hover:underline bg-white text-gray-800 font-bold rounded-half my-6 py-4 px-8 shadow-lg focus:outline-none focus:shadow-outline transform transition hover:scale-105 duration-300 ease-in-out">
                                    Get started
                                </Link>
                        </div>
                            )}
                    <div className="w-full md:w-2/5 py-6">


                        <img className="md:w-4/5" src={hero} alt="man working" />


                    </div>
                </div>
                
            </div>

        </div>






    );
}
export default Home


