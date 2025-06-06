
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { MessageSquare, Send, Sparkles, TrendingUp, Calendar, FileText, Bot, User } from 'lucide-react';

const AIAssistant = ({ clientData, projects }) => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'assistant',
      content: `Hello ${clientData.name}! I'm your AI financial assistant. I have access to all your project data, documents, and deadlines. How can I help you today?`,
      timestamp: new Date().toISOString()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const suggestedQuestions = [
    "What's the latest on my downtown office building project?",
    "Is my QSBS rollover on track?",
    "What are my next tax deadlines?",
    "Show me a summary of all active projects",
    "What documents do I need to review this week?"
  ];

  const OPENAI_API_KEY = "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";

  const callOpenAI = async (message) => {
    const systemPrompt = `You are an AI financial assistant for ${clientData.name}. You have access to their financial portfolio, including:

CURRENT PROJECTS:
${projects.map(p => `- ${p.name} (${p.status}, ${p.completion}% complete, deadline: ${p.deadline}, entity: ${p.entity})`).join('\n')}

CLIENT DATA:
- Total Assets: ${clientData.totalAssets}
- Active Projects: ${clientData.activeProjects}
- Recent Activity: ${clientData.recentActivity}

CONTEXT ABOUT PROJECTS:
- Downtown Office Building: Construction project under RC Holdings LLC, building permits approved, construction on schedule
- QSBS Stock Sale: Tax planning project under Chen Family Trust, awaiting valuation report for final documentation
- Trust Restructuring: Completed estate planning project under Chen Family Trust

Provide helpful, specific answers about their financial situation, projects, deadlines, and planning. Be professional but conversational. Use relevant emojis and formatting to make responses clear and engaging. Reference specific project details when relevant.`;

    try {
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

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const aiResponse = await callOpenAI(inputMessage);
      
      const assistantMessage = {
        id: Date.now() + 1,
        type: 'assistant',
        content: aiResponse,
        timestamp: new Date().toISOString()
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error calling AI assistant:', error);
      const errorMessage = {
        id: Date.now() + 1,
        type: 'assistant',
        content: 'I apologize, but I encountered an error with the AI service. Let me provide some information based on your current projects:\n\n' +
                getContextualResponse(inputMessage),
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const getContextualResponse = (question) => {
    const lowerQuestion = question.toLowerCase();
    
    if (lowerQuestion.includes('downtown') || lowerQuestion.includes('building') || lowerQuestion.includes('office')) {
      const project = projects.find(p => p.name.includes('Downtown Office Building'));
      return `**Downtown Office Building Update:**\n\n✅ Current Status: ${project?.status || 'On track'}\n📊 Progress: ${project?.completion || 75}% complete\n📅 Deadline: ${project?.deadline || 'August 15, 2024'}\n🏢 Entity: ${project?.entity || 'RC Holdings LLC'}\n\n**Latest:** ${project?.lastUpdate || 'Building permits approved, construction proceeding on schedule'}\n\n**Next Steps:** Review construction timeline with Metro Construction and finalize insurance documentation.`;
    }
    
    if (lowerQuestion.includes('qsbs') || lowerQuestion.includes('stock') || lowerQuestion.includes('sale')) {
      const project = projects.find(p => p.name.includes('QSBS'));
      return `**QSBS Stock Sale Status:**\n\n⚠️ Status: Needs attention\n📊 Progress: ${project?.completion || 45}% complete\n📅 Deadline: ${project?.deadline || 'July 30, 2024'}\n🏛️ Entity: ${project?.entity || 'Chen Family Trust'}\n\n**Action Required:** ${project?.lastUpdate || 'Awaiting valuation report for final documentation'}\n\n**Recommendation:** Follow up with Miller Tax Group this week to ensure the valuation report is completed on time.`;
    }
    
    if (lowerQuestion.includes('deadline') || lowerQuestion.includes('tax') || lowerQuestion.includes('due')) {
      return `**Upcoming Tax Deadlines:**\n\n🔴 **High Priority:**\n• Q2 Tax Estimate Payment - June 15, 2024 (5 days away)\n\n🟡 **Medium Priority:**\n• Trust Distribution Review - June 20, 2024\n• QSBS Documentation Deadline - July 30, 2024\n\n💡 **Tip:** I recommend setting calendar reminders for these deadlines and preparing estimated payment amounts now.`;
    }
    
    if (lowerQuestion.includes('summary') || lowerQuestion.includes('active') || lowerQuestion.includes('projects')) {
      const activeProjects = projects.filter(p => p.status !== 'completed');
      return `**Active Projects Summary:**\n\n${activeProjects.map(p => 
        `**${p.name}** (${p.entity})\n• Status: ${p.status.replace('-', ' ')}\n• Progress: ${p.completion}%\n• Deadline: ${new Date(p.deadline).toLocaleDateString()}\n• Latest: ${p.lastUpdate}\n`
      ).join('\n')}\n**Overall:** You have ${activeProjects.length} active projects with ${activeProjects.filter(p => p.status === 'attention').length} requiring immediate attention.`;
    }
    
    return "I can help you with information about your projects, deadlines, documents, and financial planning. Try asking about specific projects like your downtown office building or QSBS stock sale!";
  };

  const handleSuggestedQuestion = (question) => {
    setInputMessage(question);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-blue-500" />
            AI Financial Assistant
          </CardTitle>
          <p className="text-slate-600">
            Ask questions about your projects, deadlines, documents, or financial planning
          </p>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chat Interface */}
        <div className="lg:col-span-2">
          <Card className="h-[600px] flex flex-col">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Chat</CardTitle>
                <Badge variant="secondary" className="flex items-center gap-1">
                  <Bot className="w-3 h-3" />
                  AI Assistant
                </Badge>
              </div>
            </CardHeader>
            
            {/* Messages */}
            <CardContent className="flex-1 overflow-y-auto space-y-4 px-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg px-4 py-3 ${
                      message.type === 'user'
                        ? 'bg-blue-500 text-white'
                        : 'bg-slate-100 text-slate-900'
                    }`}
                  >
                    <div className="flex items-start gap-2">
                      {message.type === 'assistant' && <Bot className="w-4 h-4 mt-0.5 flex-shrink-0" />}
                      {message.type === 'user' && <User className="w-4 h-4 mt-0.5 flex-shrink-0" />}
                      <div className="whitespace-pre-wrap text-sm">{message.content}</div>
                    </div>
                    <div className={`text-xs mt-2 ${
                      message.type === 'user' ? 'text-blue-100' : 'text-slate-500'
                    }`}>
                      {new Date(message.timestamp).toLocaleTimeString()}
                    </div>
                  </div>
                </div>
              ))}
              
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-slate-100 rounded-lg px-4 py-3 flex items-center gap-2">
                    <Bot className="w-4 h-4" />
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                      <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>

            {/* Input */}
            <CardContent className="pt-0">
              <div className="flex gap-2">
                <Input
                  placeholder="Ask about your projects, deadlines, or financial planning..."
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  className="flex-1"
                />
                <Button onClick={handleSendMessage} disabled={isLoading || !inputMessage.trim()}>
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Suggested Questions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Suggested Questions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {suggestedQuestions.map((question, index) => (
                <button
                  key={index}
                  onClick={() => handleSuggestedQuestion(question)}
                  className="w-full text-left p-3 text-sm bg-slate-50 hover:bg-blue-50 rounded-lg transition-colors border border-transparent hover:border-blue-200"
                >
                  {question}
                </button>
              ))}
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Quick Insights</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <TrendingUp className="w-5 h-5 text-green-500" />
                <div>
                  <p className="font-medium text-sm">Portfolio Performance</p>
                  <p className="text-xs text-slate-600">Up 8.2% this quarter</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-orange-500" />
                <div>
                  <p className="font-medium text-sm">Next Deadline</p>
                  <p className="text-xs text-slate-600">Q2 Tax Payment - 3 days</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <FileText className="w-5 h-5 text-blue-500" />
                <div>
                  <p className="font-medium text-sm">Recent Documents</p>
                  <p className="text-xs text-slate-600">3 new files this week</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* AI Capabilities */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">AI Capabilities</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-slate-600">
              <p>• Project status updates</p>
              <p>• Deadline tracking</p>
              <p>• Document search</p>
              <p>• Tax planning insights</p>
              <p>• Financial analysis</p>
              <p>• Party coordination</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AIAssistant;
