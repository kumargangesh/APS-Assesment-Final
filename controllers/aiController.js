require('dotenv').config();
const Groq = require('groq-sdk');
const Task = require('../models/Task');

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const OpenAI = require("openai");
 
const groq = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1"
});

const generateTitleSuggestion = async (req, res) => {
  try {
    const { description } = req.body;

    console.log('in generateTitleSuggestion, desc: ', description);

    if (!description) {
      return res.status(400).json({ message: 'Description is required for suggestion' });
    }

    const response = await groq.chat.completions.create({
      messages: [
        {
          role: 'system',

          content: 'You are an executive productivity assistant. You are given an description, now write a 3-4 words single title related to it. Respond ONLY in valid JSON format'
        },
        {
          role: 'user',
          content: `Description: ${description}`
        }
      ],
      model: "openai/gpt-oss-20b"
    });


    const content = response.choices[0]?.message?.content || '{}';

    // Ensure we only grab the JSON part
    const cleanJson = content.substring(content.indexOf('{'), content.lastIndexOf('}') + 1);

    // Parse into an object
    const title = JSON.parse(cleanJson);

    console.log('title from GROQ : ', title);

    res.status(200).json({ "title": title });
  } catch (error) {
    res.status(500).json({ message: 'Failed to generate AI suggestions', error: error.message });
  }
};

// @route POST /api/ai/suggest
const generateAiTaskSuggestions = async (req, res) => {
  try {
    const { goal } = req.body;

    if (!goal) {
      return res.status(400).json({ message: 'Goal prompt is required' });
    }

    const response = await groq.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: 'You are an executive productivity assistant. Breakdown the given goal into 3 concrete actionable task items. Respond ONLY in valid JSON format as an array of objects: [{"title": "...", "description": "...", "priority": "High/Medium/Low", "category": "..."}]'
        },
        {
          role: 'user',
          content: `Goal: ${goal}`
        }
      ],
      model: "openai/gpt-oss-20b"
    });

    const content = response.choices[0]?.message?.content || '[]';
    const cleanJson = content.substring(content.indexOf('['), content.lastIndexOf(']') + 1);
    const suggestions = JSON.parse(cleanJson);

    res.json({ suggestions });
  } catch (error) {
    res.status(500).json({ message: 'Failed to generate AI suggestions', error: error.message });
  }
};

// @route GET /api/ai/summary
const getAiTaskSummary = async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user.id, status: 'Pending' }).limit(10);
    const taskTitles = tasks.map(t => `- [${t.priority}] ${t.title}`).join('\n');

    const response = await groq.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: 'You are a professional project management assistant. Provide a brief 2-3 sentence executive briefing of the user pending tasks and recommend what they should tackle first.'
        },
        {
          role: 'user',
          content: taskTitles.length > 0 ? `Here are my current pending tasks:\n${taskTitles}` : 'I have no pending tasks currently.'
        }
      ],
      model: "openai/gpt-oss-20b"
    });

    res.json({ summary: response.choices[0]?.message?.content });
  } catch (error) {
    res.status(500).json({ message: 'Failed to generate executive summary', error: error.message });
  }
};

module.exports = { generateAiTaskSuggestions, getAiTaskSummary, generateTitleSuggestion };
