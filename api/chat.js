// api/chat.js

const axios = require('axios');

module.exports = async (req, res) => {
  // 允许跨域请求（可选，根据需求调整）
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    // 预检请求的响应
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { messages } = req.body;

  try {
    const response = await axios.post('https://cloud.perfxlab.cn/v1/chat/completions', {
      model: "chatglm3-6b",
      messages,
      temperature: 1,
      max_tokens: 2000,
      n: 1,
      presence_penalty: 0,
      frequency_penalty: 0,
      stream: false
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.API_KEY}` // 从环境变量中读取 API 密钥
      }
    });

    res.status(200).json(response.data);
  } catch (error) {
    console.error('Error:', error.response ? error.response.data : error.message);
    res.status(500).json({ message: 'Error forwarding request to API' });
  }
};
