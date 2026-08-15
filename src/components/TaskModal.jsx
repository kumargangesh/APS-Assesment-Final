import React, { useState, useEffect, useContext } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { toast } from "react-toastify";
import emailjs from '@emailjs/browser';
import "react-toastify/dist/ReactToastify.css";
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';

// Replace these placeholders with your actual EmailJS credentials
const EMAILJS_SERVICE_ID = "service_gotf6bl";
const EMAILJS_TEMPLATE_ID = "template_xhuogf7";
const EMAILJS_PUBLIC_KEY = "g_7g5ed4oE0eTZOpg";

// const API_URL = "http://localhost:5000";

const API_URL = 'https://aps-assesment-final.onrender.com'

const TaskModal = ({ show, onHide, onSave, taskToEdit }) => {

  const { email } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'Medium',
    category: 'Work',
    dueDate: '',
    emailSent: false
  });

  useEffect(() => {
    if (taskToEdit) {
      setFormData({
        title: taskToEdit.title || '',
        description: taskToEdit.description || '',
        priority: taskToEdit.priority || 'Medium',
        category: taskToEdit.category || 'Work',
        dueDate: taskToEdit.dueDate ? taskToEdit.dueDate.substring(0, 10) : '',
        emailSent: taskToEdit.emailSent || false
      });
    } else {
      setFormData({
        title: '',
        description: '',
        priority: 'Medium',
        category: 'Work',
        dueDate: '',
        emailSent: false
      });
    }
  }, [taskToEdit, show]);

  const sendReminderEmail = async (taskDetails) => {
    const templateParams = {
      // to_name: userName || "User",
      to_email: email,
      task_title: taskDetails.title,
      task_description: taskDetails.description || "No description provided.",
      due_date: taskDetails.dueDate,
      priority: taskDetails.priority,
      category: taskDetails.category
    };

    try {
      await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        templateParams,
        EMAILJS_PUBLIC_KEY
      );
      toast.info("Deadline reminder email sent!", { autoClose: 2000 });
      return true;
    } catch (error) {
      console.error("Failed to send reminder email:", error);
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let newTitle = formData.title;

    // 1. If title is empty, fetch suggestion
    if (!newTitle) {
      try {
        const response = await axios.post(
          `${API_URL}/api/ai/titleSuggest`,
          { description: formData.description }
        );

        const data = response.data;
        console.log("title from API:", data.title.title);

        newTitle = data.title.title;

        setFormData(prev => ({
          ...prev,
          title: newTitle
        }));
      } catch (err) {
        console.log("error in title:", err.message);
        alert("Failed to generate suggestions");
      }
    }

    // 2. Normalize date string to YYYY-MM-DD
    const todayStr = new Date().toLocaleDateString('en-CA');

    let isEmailSent = Boolean(formData.emailSent);

    // 3. Build temp object with latest title
    const tempFormData = {
      ...formData,
      title: newTitle,
      emailSent: isEmailSent
    };

    // 4. Send reminder email if due today, not sent yet, and email exists

    console.log(tempFormData.dueDate === todayStr, isEmailSent, email)

    if (tempFormData.dueDate === todayStr && !isEmailSent && email) {
      try {
        const emailSuccess = await sendReminderEmail(tempFormData);
        if (emailSuccess) {
          isEmailSent = true;
        }
      } catch (err) {
        console.error("Error sending reminder email:", err);
      }
    }

    // 5. Final object
    const updatedFormData = {
      ...tempFormData,
      emailSent: isEmailSent
    };

    console.log("in handleSubmit, added task:", updatedFormData);

    onSave(updatedFormData);
  };
  //   e.preventDefault();

  //   if (formData.title === '') {
  //     try {
  //       const response = await axios.post(
  //         `${API_URL}/api/ai/titleSuggest`,
  //         {
  //           description: formData.description
  //         }
  //       );

  //       const data = await response.data;
  //       console.log('title : ', data.title.title);

  //       // `${API_URL}/api/ai/suggest`
  //       // setFormData(prev => ({
  //       //   ...prev,
  //       //   title: data.title
  //       // }));

  //       setFormData(prev => ({
  //         ...prev,
  //         title: data.title.title   // works with your backend response
  //       }));

  //     } catch (err) {
  //       console.log('error in title : ', err.message);
  //       alert('Failed to generate suggestions');
  //     }
  //   }

  //   // 1. Get local date string 'YYYY-MM-DD' (avoid UTC mismatch from toISOString)
  //   const todayStr = new Date().toLocaleDateString('en-CA');

  //   let isEmailSent = Boolean(formData.emailSent);

  //   // console.log('in handleSubmit, email status : ', isEmailSent);

  //   // 2. Send reminder email only if due date is today, not sent yet, and email exists
  //   if (formData.dueDate === todayStr && !isEmailSent && email) {
  //     const emailSuccess = await sendReminderEmail(formData);
  //     if (emailSuccess) {
  //       isEmailSent = true;
  //     }
  //   }

  //   // 3. Construct the final object with the resolved emailSent state
  //   const updatedFormData = {
  //     ...formData,
  //     emailSent: isEmailSent
  //   };

  //   console.log('in handleSubmit, added task : ', updatedFormData);

  //   onSave(updatedFormData);

  // };

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
              // required
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
