
// This would typically be an API route, but for demonstration
// I'll create a mock response that simulates calling OpenAI

const OPENAI_API_KEY = "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";

export const getAIResponse = async (message: string, clientData: any, projects: any[], conversationHistory: any[]) => {
  try {
    const systemPrompt = `You are an AI financial assistant for ${clientData.name}. You have access to their financial portfolio, including:

CURRENT PROJECTS:
${projects.map(p => `- ${p.name} (${p.status}, ${p.completion}% complete, deadline: ${p.deadline})`).join('\n')}

CLIENT DATA:
- Total Assets: ${clientData.totalAssets}
- Active Projects: ${clientData.activeProjects}
- Recent Activity: ${clientData.recentActivity}

Provide helpful, specific answers about their financial situation, projects, deadlines, and planning. Be professional but conversational. Use relevant emojis and formatting to make responses clear and engaging.`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [
          { role: 'system', content: systemPrompt },
          ...conversationHistory.slice(-10).map(msg => ({
            role: msg.type === 'user' ? 'user' : 'assistant',
            content: msg.content
          })),
          { role: 'user', content: message }
        ],
        max_tokens: 500,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      throw new Error('OpenAI API call failed');
    }

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error('Error calling OpenAI:', error);
    throw error;
  }
};
