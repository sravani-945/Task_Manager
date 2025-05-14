import React, { useState, useEffect } from 'react';
import TaskForm from './components/TaskForm';
import TaskList from './components/TaskList';
import Auth from './components/Auth';
import './App.css';
import axios from 'axios';
import config from './config';

function App() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all'); // 'all', 'pending', 'completed'
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check if user is already logged in
    const token = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    
    if (token && savedUser) {
      // Set auth header for future requests
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setUser(JSON.parse(savedUser));
      setIsAuthenticated(true);
      fetchTasks();
    } else {
      setLoading(false);
    }
  }, []);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${config.apiUrl}/api/tasks`);
      setTasks(response.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching tasks:', err);
      if (err.response && err.response.status === 401) {
        // Token expired or invalid
        handleLogout();
      } else {
        setError('Error fetching tasks: ' + err.message);
      }
    } finally {
      setLoading(false);
    }
  };
  
  const handleLogout = () => {
    // Remove token and user from local storage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    // Clear auth header
    delete axios.defaults.headers.common['Authorization'];
    
    // Reset state
    setIsAuthenticated(false);
    setUser(null);
    setTasks([]);
  };

  const addTask = async (task) => {
    try {
      const response = await axios.post(`${config.apiUrl}/api/tasks`, task);
      setTasks([...tasks, response.data]);
    } catch (err) {
      setError('Error adding task: ' + err.message);
      console.error('Error adding task:', err);
    }
  };

  const updateTask = async (id, updatedTask) => {
    try {
      const response = await axios.put(`${config.apiUrl}/api/tasks/${id}`, updatedTask);
      setTasks(tasks.map(task => task.id === id ? response.data : task));
    } catch (err) {
      setError('Error updating task: ' + err.message);
      console.error('Error updating task:', err);
    }
  };

  const toggleTask = async (id) => {
    try {
      const response = await axios.patch(`${config.apiUrl}/api/tasks/${id}/toggle`);
      setTasks(tasks.map(task => task.id === id ? response.data : task));
    } catch (err) {
      setError('Error toggling task: ' + err.message);
      console.error('Error toggling task:', err);
    }
  };

  const deleteTask = async (id) => {
    try {
      await axios.delete(`${config.apiUrl}/api/tasks/${id}`);
      setTasks(tasks.filter(task => task.id !== id));
    } catch (err) {
      setError('Error deleting task: ' + err.message);
      console.error('Error deleting task:', err);
    }
  };

  const filteredTasks = () => {
    switch(filter) {
      case 'pending':
        return tasks.filter(task => !task.completed);
      case 'completed':
        return tasks.filter(task => task.completed);
      default:
        return tasks;
    }
  };

  if (!isAuthenticated) {
    return <Auth setIsAuthenticated={setIsAuthenticated} setUser={setUser} />;
  }

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card shadow-sm">
            <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center">
              <h1 className="mb-0">Task Manager</h1>
              <div>
                <span className="me-3 text-light">Welcome, {user?.username}</span>
                <button 
                  className="btn btn-sm btn-outline-light" 
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </div>
            </div>
            <div className="card-body">
              <TaskForm addTask={addTask} />
              
              {error && <div className="alert alert-danger mt-3">{error}</div>}
              
              <div className="mt-4 mb-3">
                <div className="btn-group w-100">
                  <button 
                    className={`btn ${filter === 'all' ? 'btn-primary' : 'btn-outline-primary'}`}
                    onClick={() => setFilter('all')}
                  >
                    All Tasks
                  </button>
                  <button 
                    className={`btn ${filter === 'pending' ? 'btn-primary' : 'btn-outline-primary'}`}
                    onClick={() => setFilter('pending')}
                  >
                    Pending
                  </button>
                  <button 
                    className={`btn ${filter === 'completed' ? 'btn-primary' : 'btn-outline-primary'}`}
                    onClick={() => setFilter('completed')}
                  >
                    Completed
                  </button>
                </div>
              </div>
              
              {loading ? (
                <div className="text-center my-5">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                </div>
              ) : (
                <TaskList 
                  tasks={filteredTasks()} 
                  toggleTask={toggleTask} 
                  updateTask={updateTask}
                  deleteTask={deleteTask} 
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
