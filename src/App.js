import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import StartPage from './components/startpage';  // <-- Import StartPage
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import Medication from './components/medication';
import Aboutus from './components/aboutus';
import Contacts from './components/contacts';
import Analyze from './components/analyze';
import Map from './components/map';
import Learnmore from './components/learnmore';
import Generator from './components/generator';
import Dashboard from './components/dashboard';
import History from './components/history';
import Account from './components/account';
import Users from './components/users';
import Feedbacks from './components/feedbacks';
import Archive from './components/archive';
import Skincare from './components/skincare';
import Forgot from './components/forgot';
import Reset from './components/ResetPassword';
import Skincares from './components/skincares';
import Comments from './components/comments';

const App = () => {
  return (
    <Router>
      <div className="app-container">
        <Routes>
          <Route path="/" element={<StartPage />} />     {/* <-- Landing Page */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/medication" element={<Medication />} />
          <Route path="/aboutus" element={<Aboutus />} />
          <Route path="/contacts" element={<Contacts />} />
          <Route path="/analyze" element={<Analyze />} />
          <Route path="/map" element={<Map />} />
          <Route path="/learn" element={<Learnmore />} />
          <Route path="/generate" element={<Generator />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/history" element={<History />} />
          <Route path="/account" element={<Account />} />
          <Route path="/users" element={<Users/>} />
          <Route path="/feedbacks" element={<Feedbacks/>} />
          <Route path="/archive" element={<Archive/>} />
          <Route path="/skincare" element={<Skincare/>} />
          <Route path="/forgotpassword" element={<Forgot/>} />
          <Route path="/resetpassword" element={<Reset/>} />
          <Route path="/generateskincare" element={<Skincares/>} />
          <Route path="/comments" element={<Comments/>} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
