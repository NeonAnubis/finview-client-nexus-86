
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Building2, FileText, Users, TrendingUp, AlertCircle, CheckCircle2, Clock } from 'lucide-react';

const MindMapView = ({ projects, onProjectSelect }) => {
  const [selectedEntity, setSelectedEntity] = useState(null);

  const entities = {
    "Chen Family Trust": {
      type: "Trust",
      projects: projects.filter(p => p.entity === "Chen Family Trust"),
      description: "Primary family trust for estate planning and tax optimization"
    },
    "RC Holdings LLC": {
      type: "Business Entity",
      projects: projects.filter(p => p.entity === "RC Holdings LLC"),
      description: "Real estate holding company for commercial properties"
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-green-500';
      case 'on-track': return 'bg-blue-500';
      case 'attention': return 'bg-yellow-500';
      case 'overdue': return 'bg-red-500';
      default: return 'bg-gray-500';
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

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="w-6 h-6" />
            Portfolio Structure
          </CardTitle>
          <p className="text-slate-600">Interactive view of your financial entities and projects</p>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Entity Map */}
        <div className="lg:col-span-2 space-y-6">
          <div className="relative p-8 bg-white rounded-lg border border-slate-200 min-h-[500px]">
            <div className="flex flex-col items-center space-y-8">
              {/* Client Node */}
              <div className="text-center">
                <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-lg">
                  <Users className="w-12 h-12 text-white" />
                </div>
                <h3 className="mt-2 font-semibold text-slate-900">Robert Chen</h3>
                <p className="text-sm text-slate-600">Primary Client</p>
              </div>

              {/* Connection Lines */}
              <div className="w-0.5 h-8 bg-slate-300"></div>

              {/* Entity Nodes */}
              <div className="flex flex-wrap justify-center gap-12">
                {Object.entries(entities).map(([entityName, entityData]) => (
                  <div key={entityName} className="text-center">
                    <div 
                      className={`w-20 h-20 rounded-lg flex items-center justify-center shadow-lg cursor-pointer transition-all duration-200 hover:scale-105 ${
                        selectedEntity === entityName ? 'bg-blue-500 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                      onClick={() => setSelectedEntity(selectedEntity === entityName ? null : entityName)}
                    >
                      {entityData.type === 'Trust' ? (
                        <FileText className="w-8 h-8" />
                      ) : (
                        <Building2 className="w-8 h-8" />
                      )}
                    </div>
                    <h4 className="mt-2 font-medium text-sm text-slate-900">{entityName}</h4>
                    <p className="text-xs text-slate-600">{entityData.type}</p>
                    
                    {/* Project Indicators */}
                    <div className="flex justify-center gap-1 mt-2">
                      {entityData.projects.map((project) => (
                        <div 
                          key={project.id}
                          className={`w-3 h-3 rounded-full ${getStatusColor(project.status)} cursor-pointer hover:scale-110 transition-transform`}
                          title={project.name}
                          onClick={(e) => {
                            e.stopPropagation();
                            onProjectSelect(project);
                          }}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Legend */}
            <div className="absolute bottom-4 right-4 flex gap-4 text-xs">
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span>Completed</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                <span>On Track</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <span>Needs Attention</span>
              </div>
            </div>
          </div>
        </div>

        {/* Entity Details */}
        <div className="space-y-4">
          {selectedEntity ? (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">{selectedEntity}</CardTitle>
                <p className="text-sm text-slate-600">{entities[selectedEntity].description}</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium text-slate-900 mb-2">Active Projects</h4>
                  <div className="space-y-2">
                    {entities[selectedEntity].projects.map((project) => (
                      <div 
                        key={project.id}
                        className="p-3 border border-slate-200 rounded-lg hover:border-blue-300 transition-colors cursor-pointer"
                        onClick={() => onProjectSelect(project)}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-medium text-sm">{project.name}</span>
                          <Badge className={`text-xs ${
                            project.status === 'completed' ? 'bg-green-100 text-green-800' :
                            project.status === 'on-track' ? 'bg-blue-100 text-blue-800' :
                            'bg-yellow-100 text-yellow-800'
                          }`}>
                            {getStatusIcon(project.status)}
                            {project.status.replace('-', ' ')}
                          </Badge>
                        </div>
                        <p className="text-xs text-slate-600">{project.type}</p>
                        <div className="w-full bg-slate-200 rounded-full h-1.5 mt-2">
                          <div 
                            className={`h-1.5 rounded-full ${getStatusColor(project.status)}`}
                            style={{ width: `${project.completion}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <Button 
                  className="w-full" 
                  variant="outline"
                  onClick={() => setSelectedEntity(null)}
                >
                  Close Details
                </Button>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="p-6 text-center">
                <Building2 className="w-12 h-12 text-slate-400 mx-auto mb-3" />
                <h3 className="font-medium text-slate-900 mb-2">Select an Entity</h3>
                <p className="text-sm text-slate-600">Click on any entity above to view its projects and details</p>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Quick Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-slate-600">Total Entities:</span>
                <span className="font-medium">{Object.keys(entities).length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-slate-600">Active Projects:</span>
                <span className="font-medium">{projects.filter(p => p.status !== 'completed').length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-slate-600">Completed:</span>
                <span className="font-medium text-green-600">{projects.filter(p => p.status === 'completed').length}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default MindMapView;
