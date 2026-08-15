const Task = require('../models/Task');

// @route GET /api/tasks
const getTasks = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 6;
    const search = req.query.search || '';
    const status = req.query.status || '';
    const priority = req.query.priority || '';

    const query = { user: req.user.id };

    if (search) {
      query.title = { $regex: search, $options: 'i' };
    }
    if (status) {
      query.status = status;
    }
    if (priority) {
      query.priority = priority;
    }

    const total = await Task.countDocuments(query);
    const tasks = await Task.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    res.json({
      tasks,
      page,
      pages: Math.ceil(total / limit),
      totalTasks: total
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route POST /api/tasks
const createTask = async (req, res) => {
  try {
    const { title, description, priority, category, dueDate, emailSent } = req.body;

    console.log('in createTask API, formData : ', emailSent);

    if (!title) {
      return res.status(400).json({ message: 'Task title is required' });
    }

    const task = await Task.create({
      user: req.user.id,
      title,
      description,
      priority,
      category,
      dueDate,
      emailSent: emailSent ?? false
    });

    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route PUT /api/tasks/:id
const updateTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task || task.user.toString() !== req.user.id) {
      return res.status(404).json({ message: 'Task not found' });
    }

    const updatedTask = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedTask);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route DELETE /api/tasks/:id
const deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task || task.user.toString() !== req.user.id) {
      return res.status(404).json({ message: 'Task not found' });
    }

    await task.deleteOne();
    res.json({ message: 'Task removed successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route GET /api/tasks/stats
const getTaskStats = async (req, res) => {
  try {
    const total = await Task.countDocuments({ user: req.user.id });
    const completed = await Task.countDocuments({ user: req.user.id, status: 'Completed' });
    const pending = await Task.countDocuments({ user: req.user.id, status: 'Pending' });
    const highPriority = await Task.countDocuments({ user: req.user.id, priority: 'High', status: 'Pending' });

    res.json({ total, completed, pending, highPriority });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getTasks, createTask, updateTask, deleteTask, getTaskStats };