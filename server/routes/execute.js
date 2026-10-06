const express = require('express');
const router = express.Router();
const axios = require('axios');

// Language IDs for Judge0
const LANGUAGE_IDS = {
  python: 71,
  java: 62,
  cpp: 54,
  c: 50,
  javascript: 63,
};

// @route   POST /api/execute
// @desc    Execute code using Judge0
router.post('/', async (req, res) => {
  const { code, language, stdin = '' } = req.body;

  if (!code || !language) {
    return res.status(400).json({ error: 'Code and language are required' });
  }

  const language_id = LANGUAGE_IDS[language.toLowerCase()];
  if (!language_id) {
    return res.status(400).json({ error: 'Unsupported language' });
  }

  try {
    const response = await axios.post(
      `${process.env.JUDGE0_URL}/submissions?base64_encoded=false&wait=true`,
      {
        source_code: code,
        language_id,
        stdin,
        cpu_time_limit: 5,
        memory_limit: 128000,
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
        timeout: 15000,
      }
    );

    const data = response.data;

    res.json({
      stdout: data.stdout || '',
      stderr: data.stderr || data.compile_output || '',
      status: data.status?.description || 'Unknown',
      time: data.time,
      memory: data.memory,
    });
  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(500).json({
      error: 'Code execution failed',
      details: err.message,
    });
  }
});

module.exports = router;