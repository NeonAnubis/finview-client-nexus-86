
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Phone, Mail, MessageCircle, Calendar, Clock, User } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const ContactAdvisorPage = ({ onBack }) => {
  const [selectedTopic, setSelectedTopic] = useState('');
  const [urgency, setUrgency] = useState('medium');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const advisorInfo = {
    name: "Sarah Johnson, CPA",
    title: "Senior Financial Advisor",
    phone: "(555) 123-4567",
    email: "sarah.johnson@advisors.com",
    availability: "Available Monday-Friday, 9AM-6PM EST"
  };

  const quickTopics = [
    "Tax Planning",
    "Investment Strategy", 
    "Estate Planning",
    "Business Structure",
    "Compliance Question",
    "Document Review",
    "Other"
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate message sending
    setTimeout(() => {
      toast({
        title: "Message sent successfully!",
        description: "Your advisor will respond within 24 hours.",
      });
      setMessage('');
      setSelectedTopic('');
      setIsSubmitting(false);
    }, 1500);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Contact Your Advisor</h1>
          <p className="text-slate-600">Get expert guidance on your financial matters</p>
        </div>
        <Button onClick={onBack} variant="outline">
          Back to Dashboard
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Advisor Information */}
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Your Advisor</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <User className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-medium text-slate-900">{advisorInfo.name}</h3>
                  <p className="text-sm text-slate-600">{advisorInfo.title}</p>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-slate-400" />
                  <span className="text-sm text-slate-600">{advisorInfo.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-slate-400" />
                  <span className="text-sm text-slate-600">{advisorInfo.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-slate-400" />
                  <span className="text-sm text-slate-600">{advisorInfo.availability}</span>
                </div>
              </div>

              <div className="pt-4 space-y-2">
                <Button className="w-full" size="sm">
                  <Phone className="w-4 h-4 mr-2" />
                  Schedule Call
                </Button>
                <Button variant="outline" className="w-full" size="sm">
                  <Calendar className="w-4 h-4 mr-2" />
                  Book Meeting
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Response Times</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-slate-600">Urgent matters:</span>
                <Badge variant="destructive">2-4 hours</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-slate-600">Standard inquiries:</span>
                <Badge variant="default">24 hours</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-slate-600">Complex analysis:</span>
                <Badge variant="secondary">2-3 days</Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Contact Form */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageCircle className="w-5 h-5" />
                Send Message
              </CardTitle>
              <p className="text-slate-600">Describe your question or concern in detail</p>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="text-sm font-medium text-slate-700 mb-3 block">Topic</label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {quickTopics.map((topic) => (
                      <button
                        key={topic}
                        type="button"
                        onClick={() => setSelectedTopic(topic)}
                        className={`p-2 text-sm rounded-md border transition-colors ${
                          selectedTopic === topic
                            ? 'bg-blue-100 border-blue-300 text-blue-800'
                            : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        {topic}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-slate-700 mb-2 block">Subject</label>
                  <Input placeholder="Brief description of your inquiry" />
                </div>

                <div>
                  <label className="text-sm font-medium text-slate-700 mb-2 block">Urgency Level</label>
                  <select 
                    value={urgency} 
                    onChange={(e) => setUrgency(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md"
                  >
                    <option value="low">Low - General inquiry</option>
                    <option value="medium">Medium - Need response within 24 hours</option>
                    <option value="high">High - Urgent matter, need same-day response</option>
                  </select>
                </div>

                <div>
                  <label className="text-sm font-medium text-slate-700 mb-2 block">Message</label>
                  <Textarea
                    placeholder="Please provide details about your question or request..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows={6}
                    required
                  />
                </div>

                <div className="flex gap-3">
                  <Button 
                    type="submit" 
                    disabled={isSubmitting || !message.trim()}
                    className="flex-1"
                  >
                    {isSubmitting ? "Sending..." : "Send Message"}
                  </Button>
                  <Button type="button" variant="outline">
                    Attach Files
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ContactAdvisorPage;
