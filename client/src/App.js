
import './App.css';
import ResetPwd from './components/ResetPwd';
import Home from './components/Home';
import Dashboard from './components/Dashboard';
import Success from "./components/Success";
import Cancel from "./components/Cancel";
import TeamsDashboard from './components/TeamsDashboard';
import TeamsScheduleTask from './components/TeamsScheduleTask';
import { Route, Routes, BrowserRouter } from "react-router-dom";
import PrivatesRoutes from './utils/PrivateRoutes';
import { useState } from 'react';
import ScheduleTask from './components/ScheduleTasks';
import TwoFactAuth from './components/TwoFactAuth';
import UserProvider from './Context/UserProvider';


function App() {
  const [alert, setAlert] = useState(null);
  const [loading, setLoading] = useState(false);
  const showAlert = (alert) => {
    setAlert(alert);
    setTimeout(() => {
      setAlert(null);
    }, 5000);
  }
  const showLoading = (status) => {
    setLoading(status);
  }
  return (
    <BrowserRouter>
      <UserProvider>
      <Routes>
        <Route path='/ResetPwd' element={<ResetPwd alert={alert} showAlert={showAlert} loading={loading} showLoading={showLoading} />} />
        <Route path='/' element={<Home alert={alert} showAlert={showAlert} loading={loading} showLoading={showLoading} />} />
        <Route element={<PrivatesRoutes />}>
          <Route path='/success' element={<Success alert={alert} showAlert={showAlert}/>} />
          <Route path='/cancel' element={<Cancel />} />
          <Route path="/2_factorAuth" element={<TwoFactAuth alert={alert} showAlert={showAlert} />} />
          <Route path="/dashboard" element={<Dashboard loading={loading} showLoading={showLoading} alert={alert} showAlert={showAlert} />} />
          <Route path="/dashboard/add" element={<ScheduleTask loading={loading} showLoading={showLoading} alert={alert} showAlert={showAlert} />} />
          <Route path="/TeamsDashboard" element={<TeamsDashboard loading={loading} showLoading={showLoading} alert={alert} showAlert={showAlert} />} />
          <Route path="/TeamsDashboard/add" element={<TeamsScheduleTask loading={loading} showLoading={showLoading} alert={alert} showAlert={showAlert} />} />
        </Route>
      </Routes>
      </UserProvider>
    </BrowserRouter>
  );
}

export default App;
