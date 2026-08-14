import React, { useState, useEffect, useCallback } from 'react';
import { Container, Row, Col, Button, Form, InputGroup } from 'react-bootstrap';
import axios from 'axios';
import TaskCard from '../components/TaskCard';
import TaskModal from '../components/TaskModal';
import AiModal from '../components/AiModal';
import Pagination from '../components/Pagination';

const TasksPage = () => {
  const [tasks, setTasks] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [showAiModal, setShowAiModal] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState(null);

  // const API_URL = 'https://opulent-space-rotary-phone-4qg9jr6r6r5p37rwx-5000.app.github.dev';

  const API_URL = 'https://aps-assesment-final.onrender.com'

  const fetchTasks = useCallback(async () => {
    try {
      const { data } = await axios.get(`${API_URL}/api/tasks`, {
        params: { page, limit: 6, search, status: statusFilter, priority: priorityFilter }
      });
      setTasks(data.tasks);
      setTotalPages(data.pages);
    } catch (err) {
      console.error(err);
    }
  }, [page, search, statusFilter, priorityFilter]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const handleSaveTask = async (formData) => {
    try {
      if (taskToEdit) {
        await axios.put(`${API_URL}/api/tasks/${taskToEdit._id}`, formData);
      } else {
        await axios.post(`${API_URL}/api/tasks`, formData);
      }
      setShowTaskModal(false);
      setTaskToEdit(null);
      fetchTasks();
    } catch (err) {
      alert('Error saving task');
    }
  };

  const handleDeleteTask = async (id) => {
    if (window.confirm('Delete this task?')) {
      await axios.delete(`${API_URL}/api/tasks/${id}`);
      fetchTasks();
    }
  };

  const handleToggleStatus = async (task) => {
    const updatedStatus = task.status === 'Completed' ? 'Pending' : 'Completed';
    await axios.put(`${API_URL}/api/tasks/${task._id}`, { status: updatedStatus });
    fetchTasks();
  };

  const handleAddAiTasks = async (suggestions) => {
    for (const t of suggestions) {
      await axios.post(`${API_URL}/api/tasks/`, t);
    }
    fetchTasks();
  };

  return (
    <Container className="py-2">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold mb-0">Task Workspace</h2>
        <div className="d-flex gap-2">
          <Button variant="outline-primary" onClick={() => setShowAiModal(true)}>
            <i className="bi bi-robot me-1"></i> AI Breakdown
          </Button>
          <Button variant="dark" onClick={() => { setTaskToEdit(null); setShowTaskModal(true); }}>
            <i className="bi bi-plus-lg me-1"></i> Add Task
          </Button>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <Row className="g-2 mb-4">
        <Col md={5}>
          <InputGroup>
            <InputGroup.Text><i className="bi bi-search"></i></InputGroup.Text>
            <Form.Control
              placeholder="Search tasks..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </InputGroup>
        </Col>
        <Col md={3}>
          <Form.Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="Completed">Completed</option>
          </Form.Select>
        </Col>
        <Col md={4}>
          <Form.Select value={priorityFilter} onChange={(e) => setPriorityFilter(e.target.value)}>
            <option value="">All Priorities</option>
            <option value="High">High Priority</option>
            <option value="Medium">Medium Priority</option>
            <option value="Low">Low Priority</option>
          </Form.Select>
        </Col>
      </Row>

      {/* Task List Grid */}
      <Row className="g-3">
        {tasks.map((task) => (
          <Col md={4} key={task._id}>
            <TaskCard
              task={task}
              onEdit={(t) => { setTaskToEdit(t); setShowTaskModal(true); }}
              onDelete={handleDeleteTask}
              onToggleStatus={handleToggleStatus}
            />
          </Col>
        ))}
        {tasks.length === 0 && (
          <Col className="text-center py-5 text-custom-muted">
            <i className="bi bi-inbox fs-1 d-block mb-2"></i>
            No tasks found. Create a task or use AI to generate a plan.
          </Col>
        )}
      </Row>

      <Pagination current={page} totalPages={totalPages} onPageChange={(p) => setPage(p)} />

      <TaskModal
        show={showTaskModal}
        onHide={() => setShowTaskModal(false)}
        onSave={handleSaveTask}
        taskToEdit={taskToEdit}
      />

      <AiModal
        show={showAiModal}
        onHide={() => setShowAiModal(false)}
        onAddTasks={handleAddAiTasks}
      />
    </Container>
  );
};

export default TasksPage;