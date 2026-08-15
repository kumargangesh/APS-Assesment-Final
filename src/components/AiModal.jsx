import React, { useState } from 'react';
import { Modal, Button, Form, Spinner, Card } from 'react-bootstrap';
import axios from 'axios';
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AiModal = ({ show, onHide, onAddTasks }) => {
  const [goal, setGoal] = useState('');
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState([]);

  // const API_URL = 'https://opulent-space-rotary-phone-4qg9jr6r6r5p37rwx-5000.app.github.dev';

  const API_URL = 'https://aps-assesment-final.onrender.com'

  const handleGenerate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await axios.post(`${API_URL}/api/ai/suggest`, { goal });
      // `${API_URL}/api/ai/suggest`
      setSuggestions(data.suggestions);
    } catch (err) {
      alert('Failed to generate suggestions');
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptAll = () => {
    onAddTasks(suggestions);
    toast.success("Generated tasks added successfully", { autoClose: 2000 });
    setSuggestions([]);
    setGoal('');
    onHide();
  };

  return (
    <Modal show={show} onHide={onHide} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title><i className="bi bi-robot text-primary me-2"></i>AI Task Generator (Groq LLM)</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleGenerate}>
          <Form.Group className="mb-3">
            <Form.Label>Describe your high-level objective or project goal:</Form.Label>
            <Form.Control
              as="textarea"
              rows={2}
              placeholder="e.g., Launch marketing campaign for new product release next week"
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              required
            />
          </Form.Group>
          <Button variant="dark" type="submit" disabled={loading}>
            {loading ? <Spinner size="sm" animation="border" /> : 'Generate Task Plan'}
          </Button>
        </Form>

        {suggestions.length > 0 && (
          <div className="mt-4">
            <h6 className="fw-bold mb-3">AI Breakdown:</h6>
            {suggestions.map((item, idx) => (
              <Card key={idx} className="mb-2 p-2">
                <div className="fw-bold">{item.title}</div>
                <div className="small text-muted">{item.description}</div>
                <div className="mt-1">
                  <span className="badge bg-secondary me-1">{item.priority}</span>
                  <span className="badge bg-light text-dark">{item.category}</span>
                </div>
              </Card>
            ))}
          </div>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>Close</Button>
        {suggestions.length > 0 && (
          <Button variant="success" onClick={handleAcceptAll}>Add All Tasks to Board</Button>
        )}
      </Modal.Footer>
    </Modal>
  );
};

export default AiModal;