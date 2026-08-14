import React from 'react';
import { Card, Badge, Button, Form } from 'react-bootstrap';

const TaskCard = ({ task, onEdit, onDelete, onToggleStatus }) => {
  const isCompleted = task.status === 'Completed';

  const priorityClass = {
    Low: 'badge-low',
    Medium: 'badge-medium',
    High: 'badge-high'
  }[task.priority] || 'bg-secondary';

  return (
    <Card className="h-100">
      <Card.Body className="d-flex flex-column">
        <div className="d-flex justify-content-between align-items-start mb-2">
          <Form.Check
            type="checkbox"
            checked={isCompleted}
            onChange={() => onToggleStatus(task)}
            label={<span className={isCompleted ? 'text-decoration-line-through text-muted fw-bold' : 'fw-bold'}>{task.title}</span>}
          />
          <Badge className={`px-2 py-1 ${priorityClass}`}>{task.priority}</Badge>
        </div>

        <Card.Text className="text-custom-muted small flex-grow-1 mb-3">
          {task.description || 'No description provided.'}
        </Card.Text>

        <div className="d-flex justify-content-between align-items-center mt-auto pt-2 border-top">
          <div className="small text-custom-muted">
            <span className="badge bg-outline-secondary me-1">{task.category}</span>
            {task.dueDate && (
              <span><i className="bi bi-calendar3 me-1"></i>{new Date(task.dueDate).toLocaleDateString()}</span>
            )}
          </div>
          <div>
            <Button variant="link" className="p-0 text-primary me-2" onClick={() => onEdit(task)}>
              <i className="bi bi-pencil"></i>
            </Button>
            <Button variant="link" className="p-0 text-danger" onClick={() => onDelete(task._id)}>
              <i className="bi bi-trash"></i>
            </Button>
          </div>
        </div>
      </Card.Body>
    </Card>
  );
};

export default TaskCard;