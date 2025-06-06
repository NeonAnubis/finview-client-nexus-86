import React, { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileText, Upload, Search, Filter, Download, Eye, Tag } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface DocumentFile {
  id: number;
  name: string;
  category: string;
  project: string;
  uploadDate: string;
  size: string;
  tags: string[];
  type: string;
  content?: string;
}

const DocumentManager = ({ projects }: { projects: any[] }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isUploading, setIsUploading] = useState(false);
  const [documents, setDocuments] = useState<DocumentFile[]>([
    {
      id: 1,
      name: "2023 Tax Return - Final.pdf",
      category: "Tax",
      project: "QSBS Stock Sale",
      uploadDate: "2024-05-15",
      size: "2.1 MB",
      tags: ["tax", "returns", "2023"],
      type: "PDF",
      content: createSamplePDF("2023 Tax Return - Final", "This is a sample tax return document for the year 2023.")
    },
    {
      id: 2,
      name: "Trust Agreement Amendment.pdf",
      category: "Legal",
      project: "Trust Restructuring",
      uploadDate: "2024-06-01",
      size: "1.8 MB",
      tags: ["trust", "legal", "amendment"],
      type: "PDF",
      content: createSamplePDF("Trust Agreement Amendment", "This document contains amendments to the trust agreement.")
    },
    {
      id: 3,
      name: "Building Construction Video.mp4",
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
      type: "PDF",
      content: createSamplePDF("Insurance Policy - Commercial", "Commercial insurance policy documentation.")
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
  ]);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  // Function to create a sample PDF content
  function createSamplePDF(title: string, content: string): string {
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
/Length 150
>>
stream
BT
/F1 12 Tf
50 750 Td
(${title}) Tj
0 -20 Td
(${content}) Tj
0 -20 Td
(Generated on: ${new Date().toLocaleDateString()}) Tj
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
  }

  const categories = [
    "all",
    "Tax",
    "Legal",
    "Insurance",
    "Valuation",
    "Project Updates",
    "Contracts"
  ];

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || doc.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;
    
    const fileArray = Array.from(files);
    setIsUploading(true);
    
    for (const file of fileArray) {
      try {
        const reader = new FileReader();
        const fileContent = await new Promise<string>((resolve) => {
          reader.onload = (e) => {
            const result = e.target?.result;
            resolve(typeof result === 'string' ? result : '');
          };
          reader.readAsDataURL(file);
        });

        const newDocument: DocumentFile = {
          id: documents.length + Math.random(),
          name: file.name,
          category: getAutoCategory(file.name),
          project: projects[0]?.name || "General",
          uploadDate: new Date().toISOString().split('T')[0],
          size: formatFileSize(file.size),
          tags: getAutoTags(file.name),
          type: getFileType(file.name),
          content: fileContent
        };
        
        setDocuments(prev => [...prev, newDocument]);
        
        toast({
          title: "File uploaded successfully!",
          description: `${file.name} has been added to your documents.`,
        });
      } catch (error) {
        toast({
          title: "Upload failed",
          description: `Failed to upload ${file.name}. Please try again.`,
          variant: "destructive"
        });
      }
    }
    
    setIsUploading(false);
    
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const getAutoCategory = (filename: string): string => {
    const name = filename.toLowerCase();
    if (name.includes('tax') || name.includes('return')) return 'Tax';
    if (name.includes('legal') || name.includes('contract') || name.includes('agreement')) return 'Legal';
    if (name.includes('insurance') || name.includes('policy')) return 'Insurance';
    if (name.includes('valuation') || name.includes('appraisal')) return 'Valuation';
    return 'Project Updates';
  };

  const getAutoTags = (filename: string): string[] => {
    const name = filename.toLowerCase();
    const tags: string[] = [];
    if (name.includes('tax')) tags.push('tax');
    if (name.includes('legal')) tags.push('legal');
    if (name.includes('contract')) tags.push('contract');
    if (name.includes('2024')) tags.push('2024');
    if (name.includes('2023')) tags.push('2023');
    return tags.length > 0 ? tags : ['document'];
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileType = (filename: string): string => {
    const extension = filename.split('.').pop()?.toLowerCase();
    switch (extension) {
      case 'pdf': return 'PDF';
      case 'xlsx': case 'xls': return 'Excel';
      case 'mp4': case 'mov': case 'avi': return 'Video';
      case 'zip': case 'rar': return 'Archive';
      default: return 'Document';
    }
  };

  const getFileIcon = (type: string) => {
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

  const getProjectBadgeColor = (projectName: string) => {
    const project = projects.find(p => p.name === projectName);
    if (!project) return 'bg-gray-100 text-gray-800';
    
    switch (project.status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'on-track': return 'bg-blue-100 text-blue-800';
      case 'attention': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleDownload = (documentFile: DocumentFile) => {
    try {
      if (documentFile.content) {
        const link = document.createElement('a');
        link.href = documentFile.content;
        link.download = documentFile.name;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        toast({
          title: "Download started",
          description: `${documentFile.name} is being downloaded.`,
        });
      } else {
        // Create a sample file for documents without content
        const blob = new Blob([`Sample content for ${documentFile.name}`], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = documentFile.name;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        
        toast({
          title: "Download started",
          description: `${documentFile.name} is being downloaded.`,
        });
      }
    } catch (error) {
      toast({
        title: "Download failed",
        description: "Unable to download the file. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleView = (documentFile: DocumentFile) => {
    if (documentFile.content && documentFile.type === 'PDF') {
      try {
        window.open(documentFile.content, '_blank');
        toast({
          title: "Opening preview",
          description: `Opening ${documentFile.name} in a new tab.`,
        });
      } catch (error) {
        toast({
          title: "Preview failed",
          description: "Unable to open the preview. Please try downloading instead.",
        });
      }
    } else {
      toast({
        title: "Preview not available",
        description: "Preview is only available for PDF files.",
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
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
          {/* Quick Upload */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Quick Upload</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button 
                className="w-full" 
                size="lg"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
              >
                <Upload className="w-4 h-4 mr-2" />
                {isUploading ? 'Uploading...' : 'Upload Documents'}
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept=".pdf,.doc,.docx,.xlsx,.xls,.zip,.mp4,.mov"
                onChange={handleFileUpload}
                className="hidden"
              />
              <p className="text-sm text-slate-600 text-center">
                Drag & drop files or click to browse
              </p>
            </CardContent>
          </Card>

          {/* Filters */}
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

          {/* Document Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Document Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-slate-600">Total Documents:</span>
                <span className="font-medium">{documents.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-slate-600">Recent Uploads:</span>
                <span className="font-medium">
                  {documents.filter(doc => {
                    const uploadDate = new Date(doc.uploadDate);
                    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
                    return uploadDate > weekAgo;
                  }).length} this week
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-slate-600">Storage Used:</span>
                <span className="font-medium">
                  {documents.reduce((total, doc) => {
                    const size = parseFloat(doc.size.split(' ')[0]);
                    const unit = doc.size.split(' ')[1];
                    return total + (unit === 'MB' ? size : size / 1024);
                  }, 0).toFixed(1)} MB
                </span>
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
              {filteredDocuments.map((documentFile) => (
                <div 
                  key={documentFile.id} 
                  className="p-4 border border-slate-200 rounded-lg hover:border-blue-300 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 flex-1">
                      {getFileIcon(documentFile.type)}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-slate-900 truncate">{documentFile.name}</h3>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge className={getProjectBadgeColor(documentFile.project)}>
                            {documentFile.project}
                          </Badge>
                          <span className="text-sm text-slate-600">{documentFile.category}</span>
                          <span className="text-sm text-slate-500">•</span>
                          <span className="text-sm text-slate-500">{documentFile.size}</span>
                          <span className="text-sm text-slate-500">•</span>
                          <span className="text-sm text-slate-500">
                            {new Date(documentFile.uploadDate).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="flex items-center gap-1 mt-2">
                          {documentFile.tags.map((tag, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              <Tag className="w-3 h-3 mr-1" />
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 ml-4">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleView(documentFile)}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleDownload(documentFile)}
                      >
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
