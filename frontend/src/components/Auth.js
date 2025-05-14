import React, { useState } from 'react';
import Login from './Login';
import Signup from './Signup';

const Auth = ({ setIsAuthenticated, setUser }) => {
  const [activeTab, setActiveTab] = useState('login');

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card shadow-sm">
            <div className="card-header bg-primary text-white">
              <h2 className="text-center mb-0">Task Manager</h2>
            </div>
            <div className="card-body">
              <ul className="nav nav-tabs mb-4">
                <li className="nav-item">
                  <button
                    className={`nav-link ${activeTab === 'login' ? 'active' : ''}`}
                    onClick={() => setActiveTab('login')}
                  >
                    Login
                  </button>
                </li>
                <li className="nav-item">
                  <button
                    className={`nav-link ${activeTab === 'signup' ? 'active' : ''}`}
                    onClick={() => setActiveTab('signup')}
                  >
                    Sign Up
                  </button>
                </li>
              </ul>
              
              {activeTab === 'login' ? (
                <Login setIsAuthenticated={setIsAuthenticated} setUser={setUser} />
              ) : (
                <Signup setIsAuthenticated={setIsAuthenticated} setUser={setUser} />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
