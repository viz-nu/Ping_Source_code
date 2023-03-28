
import React from 'react'
import { useState } from 'react';
import Login from "./Login"
import Google from "./Google";
import Register from './Register';
const Sign = ({ alert, showAlert, loading, showLoading }) => {
    const [activeTab, setActiveTab] = useState('pills-login');

    const handleTabClick = (tabId) => {
        setActiveTab(tabId);
    };
    return (

        <>
        <div className='sign' >
            <ul className="flex justify-center mb-3" id="ex1">
                    <li className={`mr-2 ${activeTab === 'pills-login' ? 'active' : ''}`}>
                        <button
                            className="inline-block rounded py-2 px-4 bg-pink-500 text-white font-semibold hover:bg-pink-600 focus:bg-pink-700 active:bg-pink-300"
                            onClick={() => handleTabClick('pills-login')} role="tab" aria-controls="pills-login" aria-selected={activeTab === 'pills-login'}>
                            Login
                        </button>
                    </li>
                    <li className={`mr-2 ${activeTab === 'pills-register' ? 'active' : ''}`}>
                        <button className="inline-block rounded py-2 px-4 text-pink-500 font-semibold hover:bg-pink-100 focus:bg-pink-200 active:bg-pink-300"
                            onClick={() => handleTabClick('pills-register')} role="tab" aria-controls="pills-register" aria-selected={activeTab === 'pills-register'} >
                            Register
                        </button>
                    </li>
                </ul>
                    <div className="text-center mb-2">
                        <Google />
                    </div>
  

                {activeTab === 'pills-login' ? (
                    <div id="pills-login" role="tabpanel" aria-labelledby="tab-login">
                        {<Login handleTabClick={handleTabClick} alert={alert} showAlert={showAlert} loading={loading} showLoading={showLoading} />}
                    </div>
                ) : (
                    <div id="pills-register" role="tabpanel" aria-labelledby="tab-register">
                        {<Register handleTabClick={handleTabClick} alert={alert} showAlert={showAlert} loading={loading} showLoading={showLoading} />}
                    </div>
                )}
        </div>
                
    
        </>
    )
}

export default Sign








