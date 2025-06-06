
// This is a mock API endpoint for the AI assistant
// In a real application, this would be a proper backend endpoint

import { getAIResponse } from '../../src/api/chat.ts';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { message, clientData, projects, conversationHistory } = req.body;
    
    const response = await getAIResponse(message, clientData, projects, conversationHistory);
    
    res.status(200).json({ response });
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ error: 'Failed to get AI response' });
  }
}
