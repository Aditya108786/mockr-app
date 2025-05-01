
// pages/api/generateQuestions.js

import fetch from 'node-fetch';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { position } = req.body;

  const prompt = `Generate 5 unique and relevant interview questions for a ${position} job candidate.`;

  try {
    const hfResponse = await fetch('https://api-inference.huggingface.co/models/mistralai/Mixtral-8x7B-Instruct-v0.1', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        inputs: prompt,
        parameters: { max_new_tokens: 150, return_full_text: false }
      }),
    });

    const result = await hfResponse.json();

    if (result.error) {
      console.error('HuggingFace API error:', result.error);
      return res.status(500).json({ error: result.error });
    }

    const text = result[0]?.generated_text || '';

    const questions = text
      .split('\n')
      .filter(line => line.trim())
      .map(q => q.replace(/^\d+[\).\s]*/, '').trim());

    return res.status(200).json({ questions });

  } catch (err) {
    console.error('API Error:', err);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
