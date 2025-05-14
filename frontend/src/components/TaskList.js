import React, { useState } from 'react';

const TaskList = ({ tasks, toggleTask, updateTask, deleteTask }) => {
  const [editId, setEditId] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');

  const handleEdit = (task) => {
    setEditId(task.id);
    setEditTitle(task.title);
    setEditDescription(task.description);
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    
    if (!editTitle.trim()) {
      alert('Task title is required!');
      return;
    }
    
    updateTask(editId, {
      title: editTitle,
      description: editDescription
    });
    
    setEditId(null);
  };

  const cancelEdit = () => {
    setEditId(null);
  };

  if (tasks.length === 0) {
    return (
      <div className="text-center p-4 border rounded bg-light">
        <p className="mb-0">No tasks found. Add a new task to get started!</p>
      </div>
    );
  }

  return (
    <div className="task-list">
      {tasks.map((task) => (
        <div 
          key={task.id} 
          className={`task-item card mb-3 ${task.completed ? 'border-success' : 'border-primary'}`}
        >
          {editId === task.id ? (
            <div className="card-body edit-form">
              <form onSubmit={handleUpdate} className="d-flex flex-column">
                <div className="mb-2">
                  <input
                    type="text"
                    className="form-control"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    required
                  />
                </div>
                <div className="mb-2">
                  <textarea
                    className="form-control"
                    value={editDescription}
                    onChange={(e) => setEditDescription(e.target.value)}
                    rows="2"
                  />
                </div>
                <div className="d-flex justify-content-end">
                  <button 
                    type="button" 
                    className="btn btn-outline-secondary me-2" 
                    onClick={cancelEdit}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Save
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <div className="card-body d-flex align-items-start">
              <div className="me-3 pt-1">
                <input
                  type="checkbox"
                  className="form-check-input task-complete-checkbox"
                  checked={task.completed}
                  onChange={() => toggleTask(task.id)}
                />
              </div>
              <div className="flex-grow-1">
                <h5 className={`card-title ${task.completed ? 'completed-task' : ''}`}>
                  {task.title}
                </h5>
                {task.description && (
                  <p className={`card-text ${task.completed ? 'completed-task' : ''}`}>
                    {task.description}
                  </p>
                )}
                <div className="text-muted small mt-2">
                  {task.completed ? 'Completed' : 'Created'}: {new Date(task.createdAt).toLocaleString()}
                </div>
              </div>
              <div className="task-buttons ms-3">
                <button
                  className="btn btn-sm btn-outline-primary me-1"
                  onClick={() => handleEdit(task)}
                >
                  Edit
                </button>
                <button
                  className="btn btn-sm btn-outline-danger"
                  onClick={() => deleteTask(task.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default TaskList;
