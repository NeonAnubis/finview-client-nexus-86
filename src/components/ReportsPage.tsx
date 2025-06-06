
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileText, Download, Calendar, TrendingUp, DollarSign, PieChart } from 'lucide-react';

const ReportsPage = ({ onBack }) => {
  const [selectedPeriod, setSelectedPeriod] = useState('2024');

  const reports = [
    {
      id: 1,
      name: "Portfolio Summary 2024",
      type: "Financial Overview",
      date: "2024-06-15",
      status: "Ready",
      size: "2.4 MB"
    },
    {
      id: 2,
      name: "Tax Planning Report Q2",
      type: "Tax Analysis",
      date: "2024-06-10",
      status: "Ready",
      size: "1.8 MB"
    },
    {
      id: 3,
      name: "Entity Performance Review",
      type: "Business Analysis",
      date: "2024-06-01",
      status: "Processing",
      size: "3.2 MB"
    }
  ];

  const financialSummary = {
    totalAssets: "$4.2M",
    monthlyChange: "+8.5%",
    taxSavings: "$125,000",
    activeInvestments: 12
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Financial Reports</h1>
          <p className="text-slate-600">Comprehensive insights into your financial portfolio</p>
        </div>
        <Button onClick={onBack} variant="outline">
          Back to Dashboard
        </Button>
      </div>

      {/* Financial Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium">Total Assets</p>
                <p className="text-2xl font-bold text-slate-900">{financialSummary.totalAssets}</p>
              </div>
              <DollarSign className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium">Monthly Change</p>
                <p className="text-2xl font-bold text-green-600">{financialSummary.monthlyChange}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium">Tax Savings YTD</p>
                <p className="text-2xl font-bold text-slate-900">{financialSummary.taxSavings}</p>
              </div>
              <PieChart className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium">Active Investments</p>
                <p className="text-2xl font-bold text-slate-900">{financialSummary.activeInvestments}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="reports" className="space-y-6">
        <TabsList>
          <TabsTrigger value="reports">Available Reports</TabsTrigger>
          <TabsTrigger value="custom">Custom Reports</TabsTrigger>
          <TabsTrigger value="scheduled">Scheduled Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="reports" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Generated Reports</CardTitle>
                <div className="flex items-center gap-2">
                  <select 
                    value={selectedPeriod} 
                    onChange={(e) => setSelectedPeriod(e.target.value)}
                    className="px-3 py-2 border border-slate-300 rounded-md text-sm"
                  >
                    <option value="2024">2024</option>
                    <option value="2023">2023</option>
                    <option value="q2-2024">Q2 2024</option>
                  </select>
                  <Button size="sm">
                    Generate New Report
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {reports.map((report) => (
                <div key={report.id} className="flex items-center justify-between p-4 border border-slate-200 rounded-lg">
                  <div className="flex items-center gap-4">
                    <FileText className="w-8 h-8 text-blue-500" />
                    <div>
                      <h3 className="font-medium text-slate-900">{report.name}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-sm text-slate-600">{report.type}</span>
                        <span className="text-sm text-slate-500">•</span>
                        <span className="text-sm text-slate-500">{report.size}</span>
                        <span className="text-sm text-slate-500">•</span>
                        <span className="text-sm text-slate-500">{new Date(report.date).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant={report.status === 'Ready' ? 'default' : 'secondary'}>
                      {report.status}
                    </Badge>
                    {report.status === 'Ready' && (
                      <Button variant="outline" size="sm">
                        <Download className="w-4 h-4 mr-2" />
                        Download
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="custom" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Create Custom Report</CardTitle>
              <p className="text-slate-600">Generate personalized reports based on your specific needs</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-slate-700 mb-2 block">Report Type</label>
                  <select className="w-full px-3 py-2 border border-slate-300 rounded-md">
                    <option>Financial Summary</option>
                    <option>Tax Analysis</option>
                    <option>Entity Performance</option>
                    <option>Project Status</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700 mb-2 block">Time Period</label>
                  <select className="w-full px-3 py-2 border border-slate-300 rounded-md">
                    <option>Last 30 days</option>
                    <option>Last 90 days</option>
                    <option>Year to date</option>
                    <option>Custom range</option>
                  </select>
                </div>
              </div>
              <Button className="w-full">
                Generate Custom Report
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="scheduled" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Scheduled Reports</CardTitle>
              <p className="text-slate-600">Automatically generated reports delivered to your inbox</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center py-8">
                <Calendar className="w-12 h-12 text-slate-400 mx-auto mb-3" />
                <h3 className="font-medium text-slate-900 mb-2">No Scheduled Reports</h3>
                <p className="text-sm text-slate-600 mb-4">Set up automatic report generation</p>
                <Button>
                  Create Schedule
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ReportsPage;
