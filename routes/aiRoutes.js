const express = require('express');
const { generateAiTaskSuggestions, getAiTaskSummary, generateTitleSuggestion, generateDescSuggestion } = require('../controllers/aiController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

router.use(protect);
router.post('/suggest', generateAiTaskSuggestions);
router.get('/summary', getAiTaskSummary);
router.post('/titleSuggest', generateTitleSuggestion);

module.exports = router;

