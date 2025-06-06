
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileText, Upload, Search, Filter, Download, Eye, Tag } from 'lucide-react';

const DocumentManager = ({ projects }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const mockDocuments = [
    {
      id: 1,
      name: "2023 Tax Return - Final.pdf",
      category: "Tax",
      project: "QSBS Stock Sale",
      uploadDate: "2024-05-15",
      size: "2.1 MB",
      tags: ["tax", "returns", "2023"],
      type: "PDF"
    },
    {
      id: 2,
      name: "Trust Agreement Amendment.pdf",
      category: "Legal",
      project: "Trust Restructuring",
      uploadDate: "2024-06-01",
      size: "1.8 MB",
      tags: ["trust", "legal", "amendment"],
      type: "PDF"
    },
    {
      id: 3,
      name: "Building Construction Loom.mp4",
      category: "Project Updates",
      project: "Downtown Office Building",
      uploadDate: "2024-06-08",
      size: "45.2 MB",
      tags: ["construction", "update", "video"],
      type: "Video"
    },
    {
      id: 4,
      name: "Insurance Policy - Commercial.pdf",
      category: "Insurance",
      project: "Downtown Office Building",
      uploadDate: "2024-05-20",
      size: "890 KB",
      tags: ["insurance", "commercial", "policy"],
      type: "PDF"
    },
    {
      id: 5,
      name: "QSBS Valuation Report.xlsx",
      category: "Valuation",
      project: "QSBS Stock Sale",
      uploadDate: "2024-06-12",
      size: "3.4 MB",
      tags: ["qsbs", "valuation", "spreadsheet"],
      type: "Excel"
    },
    {
      id: 6,
      name: "Entity Formation Documents.zip",
      category: "Legal",
      project: "RC Holdings LLC",
      uploadDate: "2024-04-10",
      size: "5.2 MB",
      tags: ["formation", "legal", "entity"],
      type: "Archive"
    }
  ];

  const categories = [
    "all",
    "Tax",
    "Legal",
    "Insurance",
    "Valuation",
    "Project Updates",
    "Contracts"
  ];

  const filteredDocuments = mockDocuments.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || doc.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getFileIcon = (type) => {
    switch (type) {
      case 'PDF':
        return <FileText className="w-5 h-5 text-red-500" />;
      case 'Excel':
        return <FileText className="w-5 h-5 text-green-500" />;
      case 'Video':
        return <FileText className="w-5 h-5 text-blue-500" />;
      case 'Archive':
        return <FileText className="w-5 h-5 text-purple-500" />;
      default:
        return <FileText className="w-5 h-5 text-slate-500" />;
    }
  };

  const getProjectBadgeColor = (projectName) => {
    const project = projects.find(p => p.name === projectName);
    if (!project) return 'bg-gray-100 text-gray-800';
    
    switch (project.status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'on-track': return 'bg-blue-100 text-blue-800';
      case 'attention': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-6 h-6" />
            Document Manager
          </CardTitle>
          <p className="text-slate-600">Secure storage and organization of all your financial documents</p>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Filters and Upload */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Quick Upload</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button className="w-full" size="lg">
                <Upload className="w-4 h-4 mr-2" />
                Upload Documents
              </Button>
              <p className="text-sm text-slate-600 text-center">
                Drag & drop files or click to browse
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Filters</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-slate-700 mb-2 block">Category</label>
                <div className="space-y-2">
                  {categories.map((category) => (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                        selectedCategory === category
                          ? 'bg-blue-100 text-blue-800 font-medium'
                          : 'text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      {category === 'all' ? 'All Documents' : category}
                    </button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Document Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-slate-600">Total Documents:</span>
                <span className="font-medium">{mockDocuments.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-slate-600">Recent Uploads:</span>
                <span className="font-medium">3 this week</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-slate-600">Storage Used:</span>
                <span className="font-medium">58.7 MB</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Document List */}
        <div className="lg:col-span-3 space-y-4">
          {/* Search */}
          <Card>
            <CardContent className="p-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                <Input
                  placeholder="Search documents, tags, or projects..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </CardContent>
          </Card>

          {/* Documents */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>
                  Documents 
                  <span className="ml-2 text-sm text-slate-600">({filteredDocuments.length})</span>
                </CardTitle>
                <Button variant="outline" size="sm">
                  <Filter className="w-4 h-4 mr-2" />
                  Advanced Filter
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {filteredDocuments.map((document) => (
                <div 
                  key={document.id} 
                  className="p-4 border border-slate-200 rounded-lg hover:border-blue-300 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 flex-1">
                      {getFileIcon(document.type)}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-slate-900 truncate">{document.name}</h3>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge className={getProjectBadgeColor(document.project)}>
                            {document.project}
                          </Badge>
                          <span className="text-sm text-slate-600">{document.category}</span>
                          <span className="text-sm text-slate-500">•</span>
                          <span className="text-sm text-slate-500">{document.size}</span>
                          <span className="text-sm text-slate-500">•</span>
                          <span className="text-sm text-slate-500">
                            {new Date(document.uploadDate).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="flex items-center gap-1 mt-2">
                          {document.tags.map((tag, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              <Tag className="w-3 h-3 mr-1" />
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 ml-4">
                      <Button variant="ghost" size="sm">
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Download className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}

              {filteredDocuments.length === 0 && (
                <div className="text-center py-8">
                  <FileText className="w-12 h-12 text-slate-400 mx-auto mb-3" />
                  <h3 className="font-medium text-slate-900 mb-2">No documents found</h3>
                  <p className="text-sm text-slate-600">
                    {searchTerm ? 'Try adjusting your search terms' : 'Upload your first document to get started'}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DocumentManager;
