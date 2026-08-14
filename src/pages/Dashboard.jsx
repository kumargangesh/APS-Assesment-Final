import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Spinner } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Dashboard = () => {
  const [stats, setStats] = useState({ total: 0, completed: 0, pending: 0, highPriority: 0 });
  const [aiBriefing, setAiBriefing] = useState('');
  const [loadingBriefing, setLoadingBriefing] = useState(false);

  const API_URL = 'https://opulent-space-rotary-phone-4qg9jr6r6r5p37rwx-5000.app.github.dev';

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/api/tasks/stats`);
      // `${API_URL}/api/tasks/stats`
      setStats(data);
    } catch (err) {
      console.error(err);
    }
  };

  const generateBriefing = async () => {
    setLoadingBriefing(true);
    try {
      const { data } = await axios.get(`${API_URL}/api/ai/summary`);
      // `${API_URL}/api/ai/summary`
      setAiBriefing(data.summary);
    } catch (err) {
      setAiBriefing('Unable to generate AI Briefing at this time.');
    } finally {
      setLoadingBriefing(false);
    }
  };

  return (
    <Container className="py-2">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold mb-1">Executive Dashboard</h2>
          <p className="text-custom-muted mb-0">Overview of your task management metrics.</p>
        </div>
        <Button as={Link} to="/tasks" variant="dark">
          <i className="bi bi-list-task me-2"></i>Manage Tasks
        </Button>
      </div>

      <Row className="g-3 mb-4">
        <Col md={3}>
          <Card className="border-0 shadow-sm border-start border-4 border-primary">
            <Card.Body>
              <div className="text-custom-muted small fw-semibold">TOTAL TASKS</div>
              <div className="fs-2 fw-bold">{stats.total}</div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="border-0 shadow-sm border-start border-4 border-warning">
            <Card.Body>
              <div className="text-custom-muted small fw-semibold">PENDING</div>
              <div className="fs-2 fw-bold">{stats.pending}</div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="border-0 shadow-sm border-start border-4 border-success">
            <Card.Body>
              <div className="text-custom-muted small fw-semibold">COMPLETED</div>
              <div className="fs-2 fw-bold">{stats.completed}</div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="border-0 shadow-sm border-start border-4 border-danger">
            <Card.Body>
              <div className="text-custom-muted small fw-semibold">HIGH PRIORITY (PENDING)</div>
              <div className="fs-2 fw-bold">{stats.highPriority}</div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Card className="shadow-sm">
        <Card.Header className="bg-transparent border-0 d-flex justify-content-between align-items-center pt-3">
          <h5 className="fw-bold mb-0"><i className="bi bi-stars text-warning me-2"></i>AI Executive Briefing</h5>
          <Button variant="outline-dark" size="sm" onClick={generateBriefing} disabled={loadingBriefing}>
            {loadingBriefing ? <Spinner size="sm" animation="border" /> : 'Generate Summary'}
          </Button>
        </Card.Header>
        <Card.Body>
          {aiBriefing ? (
            <p className="mb-0 fs-6 leading-relaxed">{aiBriefing}</p>
          ) : (
            <span className="text-custom-muted small">
              Click the button above to generate a real-time AI summary of your current workload using Groq LLM.
            </span>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
};

export default Dashboard;