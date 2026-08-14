const express = require('express');
const { getTasks, createTask, updateTask, deleteTask, getTaskStats } = require('../controllers/taskController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

router.use(protect);
router.route('/').get(getTasks).post(createTask);
router.get('/stats', getTaskStats);
router.route('/:id').put(updateTask).delete(deleteTask);

module.exports = router;