import React, { useState } from 'react';

const TaskForm = ({ addTask }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!title.trim()) {
      alert('Task title is required!');
      return;
    }
    
    addTask({ title, description });
    
    // Reset form
    setTitle('');
    setDescription('');
  };

  return (
    <div className="card border-light mb-4">
      <div className="card-body">
        <h5 className="card-title mb-3">Add New Task</h5>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="taskTitle" className="form-label">Title</label>
            <input
              type="text"
              className="form-control"
              id="taskTitle"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter task title"
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="taskDescription" className="form-label">Description</label>
            <textarea
              className="form-control"
              id="taskDescription"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter task description (optional)"
              rows="3"
            />
          </div>
          <button type="submit" className="btn btn-primary w-100">
            Add Task
          </button>
        </form>
      </div>
    </div>
  );
};

export default TaskForm;
