
import React, { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Building2, FileText, Users, TrendingUp, AlertCircle, CheckCircle2, Clock, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';

const MindMapView = ({ projects, onProjectSelect }) => {
  const [selectedEntity, setSelectedEntity] = useState(null);
  const [zoom, setZoom] = useState(1);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const containerRef = useRef(null);

  const entities = {
    "Chen Family Trust": {
      type: "Trust",
      projects: projects.filter(p => p.entity === "Chen Family Trust"),
      description: "Primary family trust for estate planning and tax optimization",
      position: { x: 150, y: 200 }
    },
    "RC Holdings LLC": {
      type: "Business Entity", 
      projects: projects.filter(p => p.entity === "RC Holdings LLC"),
      description: "Real estate holding company for commercial properties",
      position: { x: 450, y: 200 }
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

  const handleMouseDown = (e) => {
    if (e.target === containerRef.current) {
      setIsDragging(true);
      setDragStart({ 
        x: e.clientX - dragOffset.x, 
        y: e.clientY - dragOffset.y 
      });
    }
  };

  const handleMouseMove = (e) => {
    if (isDragging) {
      setDragOffset({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleZoom = (direction) => {
    const newZoom = direction === 'in' ? 
      Math.min(zoom * 1.2, 2) : 
      Math.max(zoom / 1.2, 0.5);
    setZoom(newZoom);
  };

  const resetView = () => {
    setZoom(1);
    setDragOffset({ x: 0, y: 0 });
  };

  React.useEffect(() => {
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragStart]);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="w-6 h-6" />
                Visual Relationship View
              </CardTitle>
              <p className="text-slate-600">Interactive visualization of your financial structure</p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => handleZoom('out')}>
                <ZoomOut className="w-4 h-4" />
              </Button>
              <span className="text-sm text-slate-600 min-w-[50px] text-center">
                {Math.round(zoom * 100)}%
              </span>
              <Button variant="outline" size="sm" onClick={() => handleZoom('in')}>
                <ZoomIn className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={resetView}>
                <RotateCcw className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Interactive Map */}
        <div className="lg:col-span-2 space-y-6">
          <div 
            ref={containerRef}
            className="relative p-8 bg-white rounded-lg border border-slate-200 min-h-[600px] overflow-hidden cursor-grab active:cursor-grabbing"
            style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
            onMouseDown={handleMouseDown}
          >
            <div 
              className="relative w-full h-full"
              style={{
                transform: `translate(${dragOffset.x}px, ${dragOffset.y}px) scale(${zoom})`,
                transformOrigin: 'center',
                transition: isDragging ? 'none' : 'transform 0.2s ease-out'
              }}
            >
              {/* Client Node */}
              <div 
                className="absolute"
                style={{ left: '300px', top: '50px' }}
              >
                <div className="text-center">
                  <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-lg">
                    <Users className="w-12 h-12 text-white" />
                  </div>
                  <h3 className="mt-2 font-semibold text-slate-900">Robert Chen</h3>
                  <p className="text-sm text-slate-600">Primary Client</p>
                </div>
              </div>

              {/* Connection Lines to Entities */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none">
                {Object.entries(entities).map(([entityName, entityData]) => (
                  <line
                    key={entityName}
                    x1={350} y1={125}
                    x2={entityData.position.x + 50} y2={entityData.position.y + 50}
                    stroke="#cbd5e1"
                    strokeWidth="2"
                    strokeDasharray="5,5"
                  />
                ))}
              </svg>

              {/* Entity Nodes */}
              {Object.entries(entities).map(([entityName, entityData]) => (
                <div 
                  key={entityName}
                  className="absolute"
                  style={{ 
                    left: `${entityData.position.x}px`, 
                    top: `${entityData.position.y}px` 
                  }}
                >
                  <div className="text-center">
                    <div 
                      className={`w-20 h-20 rounded-lg flex items-center justify-center shadow-lg cursor-pointer transition-all duration-200 hover:scale-105 ${
                        selectedEntity === entityName ? 'bg-blue-500 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedEntity(selectedEntity === entityName ? null : entityName);
                      }}
                    >
                      {entityData.type === 'Trust' ? (
                        <FileText className="w-8 h-8" />
                      ) : (
                        <Building2 className="w-8 h-8" />
                      )}
                    </div>
                    <h4 className="mt-2 font-medium text-sm text-slate-900 max-w-[120px]">{entityName}</h4>
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

                    {/* Project Lines */}
                    <svg className="absolute top-20 left-1/2 transform -translate-x-1/2 w-32 h-20 pointer-events-none">
                      {entityData.projects.map((project, index) => (
                        <g key={project.id}>
                          <line
                            x1={16} y1={0}
                            x2={16 + (index - entityData.projects.length/2 + 0.5) * 30} y2={15}
                            stroke="#cbd5e1"
                            strokeWidth="1"
                          />
                          <circle
                            cx={16 + (index - entityData.projects.length/2 + 0.5) * 30}
                            cy={15}
                            r="3"
                            className={getStatusColor(project.status)}
                          />
                        </g>
                      ))}
                    </svg>
                  </div>
                </div>
              ))}
            </div>

            {/* Legend */}
            <div className="absolute bottom-4 right-4 bg-white p-3 rounded-lg shadow-sm border border-slate-200">
              <h4 className="text-sm font-medium text-slate-900 mb-2">Project Status</h4>
              <div className="space-y-1 text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  <span>Completed</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                  <span>On Track</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <span>Needs Attention</span>
                </div>
              </div>
            </div>

            {/* Navigation Hint */}
            <div className="absolute top-4 left-4 bg-blue-50 p-2 rounded-lg text-xs text-blue-700">
              💡 Drag to pan • Scroll to zoom • Click nodes to explore
            </div>
          </div>
        </div>

        {/* Entity Details Panel */}
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
