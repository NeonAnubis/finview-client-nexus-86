import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Building2, FileText, MessageSquare, TrendingUp, AlertCircle, Clock, CheckCircle2 } from 'lucide-react';
import MindMapView from '@/components/MindMapView';
import ProjectDetail from '@/components/ProjectDetail';
import DocumentManager from '@/components/DocumentManager';
import AIAssistant from '@/components/AIAssistant';
import SignInPage from '@/components/SignInPage';
import SignUpPage from '@/components/SignUpPage';
import ReportsPage from '@/components/ReportsPage';
import ContactAdvisorPage from '@/components/ContactAdvisorPage';

const Index = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authMode, setAuthMode] = useState('signin'); // 'signin' or 'signup'
  const [selectedProject, setSelectedProject] = useState(null);
  const [activeTab, setActiveTab] = useState('dashboard');

  // Sample client data
  const clientData = {
    name: "Robert Chen",
    totalAssets: "$4.2M",
    activeProjects: 3,
    upcomingDeadlines: 2,
    recentActivity: "Tax planning review completed"
  };

  const projects = [
    {
      id: 1,
      name: "Downtown Office Building",
      status: "on-track",
      type: "Real Estate",
      completion: 75,
      deadline: "2024-08-15",
      parties: ["Smith & Associates Law", "Jackson CPA", "Metro Construction"],
      lastUpdate: "Building permits approved, construction on schedule",
      entity: "RC Holdings LLC"
    },
    {
      id: 2,
      name: "QSBS Stock Sale",
      status: "attention",
      type: "Tax Planning",
      completion: 45,
      deadline: "2024-07-30",
      parties: ["Miller Tax Group", "Corporate Securities LLC"],
      lastUpdate: "Awaiting valuation report for final documentation",
      entity: "Chen Family Trust"
    },
    {
      id: 3,
      name: "Trust Restructuring",
      status: "completed",
      type: "Estate Planning",
      completion: 100,
      deadline: "2024-06-01",
      parties: ["Estate Planning Partners", "First National Trust"],
      lastUpdate: "All documents executed and filed",
      entity: "Chen Family Trust"
    }
  ];

  const upcomingDeadlines = [
    { task: "Q2 Tax Estimate Payment", date: "2024-06-15", priority: "high" },
    { task: "Trust Distribution Review", date: "2024-06-20", priority: "medium" }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800 border-green-200';
      case 'on-track': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'attention': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'overdue': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed': return <CheckCircle2 className="w-4 h-4" />;
      case 'on-track': return <TrendingUp className="w-4 h-4" />;
      case 'attention': return <AlertCircle className="w-4 h-4" />;
      case 'overdue': return <Clock className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  // Authentication handlers
  const handleSignIn = () => {
    setIsAuthenticated(true);
  };

  const handleSignUp = () => {
    setIsAuthenticated(true);
  };

  // Show authentication pages if not authenticated
  if (!isAuthenticated) {
    if (authMode === 'signin') {
      return (
        <SignInPage 
          onSignIn={handleSignIn}
          onSwitchToSignUp={() => setAuthMode('signup')}
        />
      );
    } else {
      return (
        <SignUpPage 
          onSignUp={handleSignUp}
          onSwitchToSignIn={() => setAuthMode('signin')}
        />
      );
    }
  }

  // Show specific pages based on activeTab
  if (activeTab === 'reports') {
    return <ReportsPage onBack={() => setActiveTab('dashboard')} />;
  }

  if (activeTab === 'contact') {
    return <ContactAdvisorPage onBack={() => setActiveTab('dashboard')} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <Building2 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-slate-900">Financial Portal</h1>
                <p className="text-sm text-slate-600">Welcome back, {clientData.name}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setActiveTab('reports')}
              >
                <FileText className="w-4 h-4 mr-2" />
                Reports
              </Button>
              <Button 
                size="sm"
                onClick={() => setActiveTab('contact')}
              >
                <MessageSquare className="w-4 h-4 mr-2" />
                Contact Advisor
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-6 lg:w-auto lg:grid-cols-none lg:inline-flex">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="visual">Visual Relationship View</TabsTrigger>
            <TabsTrigger value="projects">Project Pages</TabsTrigger>
            <TabsTrigger value="documents">Secure Documents</TabsTrigger>
            <TabsTrigger value="assistant">AI Assistant</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-blue-100 text-sm font-medium">Total Assets</p>
                      <p className="text-2xl font-bold">{clientData.totalAssets}</p>
                    </div>
                    <TrendingUp className="w-8 h-8 text-blue-200" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-slate-600 text-sm font-medium">Active Projects</p>
                      <p className="text-2xl font-bold text-slate-900">{clientData.activeProjects}</p>
                    </div>
                    <Building2 className="w-8 h-8 text-slate-400" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-slate-600 text-sm font-medium">Upcoming Deadlines</p>
                      <p className="text-2xl font-bold text-slate-900">{clientData.upcomingDeadlines}</p>
                    </div>
                    <Clock className="w-8 h-8 text-orange-400" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-slate-600 text-sm font-medium">Recent Activity</p>
                      <p className="text-sm font-semibold text-slate-900 mt-1">{clientData.recentActivity}</p>
                    </div>
                    <CheckCircle2 className="w-8 h-8 text-green-400" />
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building2 className="w-5 h-5" />
                    Active Projects
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {projects.filter(p => p.status !== 'completed').map((project) => (
                    <div 
                      key={project.id}
                      className="p-4 border border-slate-200 rounded-lg hover:border-blue-300 transition-colors cursor-pointer"
                      onClick={() => {
                        setSelectedProject(project);
                        setActiveTab('project-detail');
                      }}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold text-slate-900">{project.name}</h3>
                        <Badge className={`${getStatusColor(project.status)} flex items-center gap-1`}>
                          {getStatusIcon(project.status)}
                          {project.status.replace('-', ' ')}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between text-sm text-slate-600">
                        <span>{project.type}</span>
                        <span>{project.completion}% complete</span>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-2 mt-2">
                        <div 
                          className={`h-2 rounded-full transition-all duration-300 ${
                            project.status === 'on-track' ? 'bg-blue-500' : 
                            project.status === 'attention' ? 'bg-yellow-500' : 'bg-green-500'
                          }`}
                          style={{ width: `${project.completion}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="w-5 h-5" />
                    Upcoming Deadlines
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {upcomingDeadlines.map((deadline, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                      <div>
                        <p className="font-medium text-slate-900">{deadline.task}</p>
                        <p className="text-sm text-slate-600">{deadline.date}</p>
                      </div>
                      <Badge variant={deadline.priority === 'high' ? 'destructive' : 'secondary'}>
                        {deadline.priority}
                      </Badge>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="visual">
            <MindMapView projects={projects} onProjectSelect={(project) => {
              setSelectedProject(project);
              setActiveTab('project-detail');
            }} />
          </TabsContent>

          <TabsContent value="projects">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building2 className="w-6 h-6" />
                    All Projects
                  </CardTitle>
                  <p className="text-slate-600">Manage and track all your active and completed projects</p>
                </CardHeader>
              </Card>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {projects.map((project) => (
                  <Card 
                    key={project.id}
                    className="cursor-pointer hover:shadow-lg transition-shadow"
                    onClick={() => {
                      setSelectedProject(project);
                      setActiveTab('project-detail');
                    }}
                  >
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">{project.name}</CardTitle>
                        <Badge className={getStatusColor(project.status)}>
                          {getStatusIcon(project.status)}
                          {project.status.replace('-', ' ')}
                        </Badge>
                      </div>
                      <p className="text-slate-600">{project.entity} • {project.type}</p>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>Progress</span>
                            <span>{project.completion}%</span>
                          </div>
                          <div className="w-full bg-slate-200 rounded-full h-2">
                            <div 
                              className={`h-2 rounded-full ${
                                project.status === 'completed' ? 'bg-green-500' :
                                project.status === 'on-track' ? 'bg-blue-500' : 'bg-yellow-500'
                              }`}
                              style={{ width: `${project.completion}%` }}
                            />
                          </div>
                        </div>
                        <div className="text-sm text-slate-600">
                          <p><strong>Deadline:</strong> {new Date(project.deadline).toLocaleDateString()}</p>
                          <p><strong>Parties:</strong> {project.parties.length} involved</p>
                        </div>
                        <p className="text-sm text-slate-700">{project.lastUpdate}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="documents">
            <DocumentManager projects={projects} />
          </TabsContent>

          <TabsContent value="assistant">
            <AIAssistant clientData={clientData} projects={projects} />
          </TabsContent>

          <TabsContent value="project-detail">
            {selectedProject && (
              <ProjectDetail 
                project={selectedProject} 
                onBack={() => setActiveTab('dashboard')} 
              />
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
