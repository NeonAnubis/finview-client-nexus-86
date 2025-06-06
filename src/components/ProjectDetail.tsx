
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, Calendar, Users, FileText, CheckCircle2, Clock, AlertTriangle, Download, Eye } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const ProjectDetail = ({ project, onBack }) => {
  const { toast } = useToast();

  if (!project) return null;

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800 border-green-200';
      case 'on-track': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'attention': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'overdue': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  // Function to create a sample PDF content
  const createSamplePDF = (title, content) => {
    const pdfContent = `%PDF-1.4
1 0 obj
<<
/Type /Catalog
/Pages 2 0 R
>>
endobj

2 0 obj
<<
/Type /Pages
/Kids [3 0 R]
/Count 1
>>
endobj

3 0 obj
<<
/Type /Page
/Parent 2 0 R
/MediaBox [0 0 612 792]
/Contents 4 0 R
>>
endobj

4 0 obj
<<
/Length 200
>>
stream
BT
/F1 14 Tf
50 750 Td
(${title}) Tj
0 -30 Td
(${content}) Tj
0 -30 Td
(Project: ${project.name}) Tj
0 -20 Td
(Generated on: ${new Date().toLocaleDateString()}) Tj
0 -20 Td
(Status: ${project.status}) Tj
ET
endstream
endobj

xref
0 5
0000000000 65535 f 
0000000009 00000 n 
0000000058 00000 n 
0000000115 00000 n 
0000000214 00000 n 
trailer
<<
/Size 5
/Root 1 0 R
>>
startxref
415
%%EOF`;
    
    return `data:application/pdf;base64,${btoa(pdfContent)}`;
  };

  const mockTodos = [
    {
      id: 1,
      task: "Submit building permit amendments",
      assignee: "Smith & Associates Law",
      due: "2024-06-20",
      status: "pending",
      priority: "high"
    },
    {
      id: 2,
      task: "Review construction timeline",
      assignee: "Metro Construction",
      due: "2024-06-25",
      status: "in-progress",
      priority: "medium"
    },
    {
      id: 3,
      task: "Finalize insurance documentation",
      assignee: "Jackson CPA",
      due: "2024-07-01",
      status: "pending",
      priority: "low"
    }
  ];

  const mockUpdates = [
    {
      id: 1,
      date: "2024-06-10",
      author: "Smith & Associates Law",
      title: "Building Permits Approved",
      content: "All necessary permits have been approved by the city planning department. Construction can proceed as scheduled."
    },
    {
      id: 2,
      date: "2024-06-05",
      author: "Metro Construction",
      title: "Site Preparation Complete",
      content: "Site preparation and foundation work has been completed ahead of schedule. Ready to begin framing next week."
    },
    {
      id: 3,
      date: "2024-05-28",
      author: "Jackson CPA",
      title: "Tax Depreciation Analysis",
      content: "Completed analysis of optimal depreciation schedule for the new building. Projecting significant tax benefits."
    }
  ];

  const mockDocuments = [
    { 
      name: "Building Plans - Final.pdf", 
      type: "Plans", 
      date: "2024-06-01", 
      size: "2.3 MB",
      content: createSamplePDF("Building Plans - Final", "Detailed architectural plans for the downtown office building project including floor plans, elevations, and technical specifications.")
    },
    { 
      name: "Permit Approval Letter.pdf", 
      type: "Legal", 
      date: "2024-06-10", 
      size: "145 KB",
      content: createSamplePDF("Permit Approval Letter", "Official approval letter from the city planning department for construction permits.")
    },
    { 
      name: "Construction Contract.pdf", 
      type: "Contract", 
      date: "2024-05-15", 
      size: "890 KB",
      content: createSamplePDF("Construction Contract", "Comprehensive construction contract outlining terms, conditions, timeline, and deliverables.")
    },
    { 
      name: "Insurance Policy.pdf", 
      type: "Insurance", 
      date: "2024-05-20", 
      size: "456 KB",
      content: createSamplePDF("Insurance Policy", "Commercial insurance policy covering construction activities and property protection.")
    }
  ];

  const handleDownload = (document) => {
    try {
      const link = document.createElement('a');
      link.href = document.content;
      link.download = document.name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast({
        title: "Download started",
        description: `${document.name} is being downloaded.`,
      });
    } catch (error) {
      toast({
        title: "Download failed",
        description: "Unable to download the file. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleView = (document) => {
    try {
      window.open(document.content, '_blank');
      toast({
        title: "Opening preview",
        description: `Opening ${document.name} in a new tab.`,
      });
    } catch (error) {
      toast({
        title: "Preview failed",
        description: "Unable to open the preview. Please try downloading instead.",
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" onClick={onBack}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">{project.name}</h1>
            <p className="text-slate-600">{project.entity} • {project.type}</p>
          </div>
        </div>
        <Badge className={`${getStatusColor(project.status)} text-sm px-3 py-1`}>
          {project.status.replace('-', ' ').toUpperCase()}
        </Badge>
      </div>

      {/* Progress Overview */}
      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <p className="text-sm font-medium text-slate-600 mb-2">Progress</p>
              <div className="flex items-center gap-3">
                <Progress value={project.completion} className="flex-1" />
                <span className="text-lg font-semibold text-slate-900">{project.completion}%</span>
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-slate-600 mb-2">Deadline</p>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-slate-400" />
                <span className="text-slate-900">{new Date(project.deadline).toLocaleDateString()}</span>
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-slate-600 mb-2">Team Members</p>
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-slate-400" />
                <span className="text-slate-900">{project.parties.length} parties involved</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="todos">Tasks</TabsTrigger>
          <TabsTrigger value="updates">Updates</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Project Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Project Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="font-medium text-slate-900 mb-2">Latest Update</p>
                  <p className="text-slate-600">{project.lastUpdate}</p>
                </div>
                <div>
                  <p className="font-medium text-slate-900 mb-2">Key Objectives</p>
                  <ul className="text-slate-600 space-y-1">
                    <li>• Complete construction on schedule</li>
                    <li>• Ensure all permits and compliance requirements</li>
                    <li>• Optimize tax benefits and depreciation</li>
                    <li>• Maintain budget targets</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Team & Parties */}
            <Card>
              <CardHeader>
                <CardTitle>Involved Parties</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {project.parties.map((party, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <Users className="w-4 h-4 text-blue-600" />
                      </div>
                      <span className="font-medium text-slate-900">{party}</span>
                    </div>
                    <Button variant="ghost" size="sm">Contact</Button>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="todos" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Action Items</CardTitle>
              <p className="text-slate-600">Tasks and deadlines for this project</p>
            </CardHeader>
            <CardContent className="space-y-4">
              {mockTodos.map((todo) => (
                <div key={todo.id} className="p-4 border border-slate-200 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium text-slate-900">{todo.task}</h3>
                    <div className="flex items-center gap-2">
                      <Badge variant={todo.priority === 'high' ? 'destructive' : todo.priority === 'medium' ? 'default' : 'secondary'}>
                        {todo.priority}
                      </Badge>
                      <Badge variant={todo.status === 'completed' ? 'default' : 'outline'}>
                        {todo.status === 'completed' ? <CheckCircle2 className="w-3 h-3 mr-1" /> : <Clock className="w-3 h-3 mr-1" />}
                        {todo.status.replace('-', ' ')}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-sm text-slate-600">
                    <span>Assigned to: {todo.assignee}</span>
                    <span>Due: {new Date(todo.due).toLocaleDateString()}</span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="updates" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Updates</CardTitle>
              <p className="text-slate-600">Latest communications and progress reports</p>
            </CardHeader>
            <CardContent className="space-y-4">
              {mockUpdates.map((update) => (
                <div key={update.id} className="p-4 border border-slate-200 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium text-slate-900">{update.title}</h3>
                    <span className="text-sm text-slate-600">{new Date(update.date).toLocaleDateString()}</span>
                  </div>
                  <p className="text-sm text-slate-600 mb-2">By: {update.author}</p>
                  <p className="text-slate-700">{update.content}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="documents" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Project Documents</CardTitle>
              <p className="text-slate-600">Files and documentation for this project</p>
            </CardHeader>
            <CardContent className="space-y-3">
              {mockDocuments.map((doc, index) => (
                <div key={index} className="flex items-center justify-between p-3 border border-slate-200 rounded-lg hover:border-blue-300 transition-colors">
                  <div className="flex items-center gap-3">
                    <FileText className="w-5 h-5 text-slate-400" />
                    <div>
                      <p className="font-medium text-slate-900">{doc.name}</p>
                      <p className="text-sm text-slate-600">{doc.type} • {doc.size} • {new Date(doc.date).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleView(doc)}
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleDownload(doc)}
                    >
                      <Download className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProjectDetail;
