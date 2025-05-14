const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const path = require('path');

// Create database.json file if it doesn't exist
const adapter = new FileSync(path.join(__dirname, 'db.json'));
const db = low(adapter);

// Set default data
db.defaults({ users: [], tasks: [] }).write();

const app = express();
const PORT = process.env.PORT || 8080;
const JWT_SECRET = process.env.JWT_SECRET || 'taskmanager-secret-key';
const NODE_ENV = process.env.NODE_ENV || 'development';

// CORS configuration
const corsOptions = {
  origin: NODE_ENV === 'production' 
    ? ['https://sravani-945.github.io', 'https://task-manager-frontend.vercel.app'] 
    : 'http://localhost:3000',
  optionsSuccessStatus: 200
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());

// Authentication middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  try {
    const verified = jwt.verify(token, JWT_SECRET);
    req.user = verified;
    next();
  } catch (err) {
    res.status(403).json({ message: 'Invalid token' });
  }
};

// Signup route
app.post('/api/auth/signup', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    // Check if user already exists
    const existingUser = db.get('users').find({ username }).value();
    if (existingUser) {
      return res.status(400).json({ message: 'Username already exists' });
    }
    
    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    // Create new user
    const newUser = {
      id: uuidv4(),
      username,
      password: hashedPassword,
      createdAt: new Date().toISOString()
    };
    
    // Save to db
    db.get('users').push(newUser).write();
    
    // Create token
    const token = jwt.sign({ id: newUser.id, username: newUser.username }, JWT_SECRET, { expiresIn: '1h' });
    
    res.status(201).json({ 
      token,
      user: {
        id: newUser.id,
        username: newUser.username
      }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Login route
app.post('/api/auth/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    // Find user
    const user = db.get('users').find({ username }).value();
    if (!user) {
      return res.status(400).json({ message: 'Invalid username or password' });
    }
    
    // Check password
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(400).json({ message: 'Invalid username or password' });
    }
    
    // Create token
    const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, { expiresIn: '1h' });
    
    res.json({ 
      token,
      user: {
        id: user.id,
        username: user.username
      }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get tasks
app.get('/api/tasks', authenticateToken, (req, res) => {
  try {
    const userId = req.user.id;
    const tasks = db.get('tasks')
      .filter({ userId })
      .value();
    
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get tasks by status
app.get('/api/tasks/status', authenticateToken, (req, res) => {
  try {
    const userId = req.user.id;
    const completed = req.query.completed === 'true';
    
    const tasks = db.get('tasks')
      .filter({ userId, completed })
      .value();
    
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get task by id
app.get('/api/tasks/:id', authenticateToken, (req, res) => {
  try {
    const userId = req.user.id;
    const taskId = req.params.id;
    
    const task = db.get('tasks')
      .find({ id: taskId, userId })
      .value();
    
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    
    res.json(task);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create task
app.post('/api/tasks', authenticateToken, (req, res) => {
  try {
    const userId = req.user.id;
    const { title, description } = req.body;
    
    const newTask = {
      id: uuidv4(),
      userId,
      title,
      description: description || '',
      completed: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    db.get('tasks').push(newTask).write();
    
    res.status(201).json(newTask);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update task
app.put('/api/tasks/:id', authenticateToken, (req, res) => {
  try {
    const userId = req.user.id;
    const taskId = req.params.id;
    const { title, description, completed } = req.body;
    
    const task = db.get('tasks')
      .find({ id: taskId, userId })
      .value();
    
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    
    const updatedTask = {
      ...task,
      title: title !== undefined ? title : task.title,
      description: description !== undefined ? description : task.description,
      completed: completed !== undefined ? completed : task.completed,
      updatedAt: new Date().toISOString()
    };
    
    db.get('tasks')
      .find({ id: taskId, userId })
      .assign(updatedTask)
      .write();
    
    res.json(updatedTask);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Toggle task completion
app.patch('/api/tasks/:id/toggle', authenticateToken, (req, res) => {
  try {
    const userId = req.user.id;
    const taskId = req.params.id;
    
    const task = db.get('tasks')
      .find({ id: taskId, userId })
      .value();
    
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    
    const updatedTask = {
      ...task,
      completed: !task.completed,
      updatedAt: new Date().toISOString()
    };
    
    db.get('tasks')
      .find({ id: taskId, userId })
      .assign(updatedTask)
      .write();
    
    res.json(updatedTask);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete task
app.delete('/api/tasks/:id', authenticateToken, (req, res) => {
  try {
    const userId = req.user.id;
    const taskId = req.params.id;
    
    const task = db.get('tasks')
      .find({ id: taskId, userId })
      .value();
    
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    
    db.get('tasks')
      .remove({ id: taskId, userId })
      .write();
    
    res.status(204).end();
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
