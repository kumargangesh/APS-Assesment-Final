import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const TaskModal = ({ show, onHide, onSave, taskToEdit }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'Medium',
    category: 'Work',
    dueDate: ''
  });

  useEffect(() => {
    if (taskToEdit) {
      setFormData({
        title: taskToEdit.title || '',
        description: taskToEdit.description || '',
        priority: taskToEdit.priority || 'Medium',
        category: taskToEdit.category || 'Work',
        dueDate: taskToEdit.dueDate ? taskToEdit.dueDate.substring(0, 10) : ''
      });
    } else {
      setFormData({
        title: '',
        description: '',
        priority: 'Medium',
        category: 'Work',
        dueDate: ''
      });
    }
  }, [taskToEdit, show]);

  const handleSubmit = (e) => {
    e.preventDefault();
    toast.success("Task added successfully", { autoClose: 2000 });
    onSave(formData);
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>{taskToEdit ? 'Edit Task' : 'Add New Task'}</Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label>Title *</Form.Label>
            <Form.Control
              type="text"
              required
              placeholder="e.g., Prepare Q3 Financial Report"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Description</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              placeholder="Detailed description..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </Form.Group>
          <div className="row">
            <div className="col-md-6 mb-3">
              <Form.Label>Priority</Form.Label>
              <Form.Select
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </Form.Select>
            </div>
            <div className="col-md-6 mb-3">
              <Form.Label>Category</Form.Label>
              <Form.Control
                type="text"
                placeholder="e.g., Marketing, HR"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              />
            </div>
          </div>
          <Form.Group className="mb-3">
            <Form.Label>Due Date</Form.Label>
            <Form.Control
              type="date"
              value={formData.dueDate}
              onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onHide}>Cancel</Button>
          <Button variant="dark" type="submit">Save Task</Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default TaskModal;