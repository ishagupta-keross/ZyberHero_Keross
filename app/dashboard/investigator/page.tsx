'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  Shield, AlertTriangle, Users, TrendingUp, FileText, Search, Filter,
  Eye, Flag, Send, CheckCircle, XCircle, Clock, MapPin, User, Network,
  BarChart3, PieChart, Activity, AlertOctagon, Phone, Download, Hash
} from 'lucide-react';
import { getUser } from '@/lib/auth';
import { Header } from '@/components/shared/Header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import alertsData from '@/lib/mock/alerts.json';
import casesData from '@/lib/mock/cases.json';
import { toast } from 'sonner';

export default function InvestigatorDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [selectedIncident, setSelectedIncident] = useState<any>(null);
  const [selectedCase, setSelectedCase] = useState<any>(null);
  const [filterSeverity, setFilterSeverity] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const currentUser = getUser();
    if (!currentUser || currentUser.role !== 'investigator') {
      router.push('/login');
      return;
    }
    setUser(currentUser);
  }, [router]);

  if (!user) return null;

  const incidents = alertsData.map(alert => ({
    ...alert,
    riskScore: Math.floor(Math.random() * 100),
    tags: ['cyberbullying', 'harassment', 'explicit-content'].slice(0, Math.floor(Math.random() * 3) + 1),
  }));

  const filteredIncidents = incidents.filter(incident => {
    if (filterSeverity !== 'all' && incident.severity !== filterSeverity) return false;
    if (searchQuery && !incident.sender.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const predators = [
    {
      id: 1,
      handle: 'unknown_user',
      aliases: ['stranger_2023', 'anonymous_user'],
      platforms: ['Instagram', 'TikTok'],
      incidentCount: 12,
      riskLevel: 'critical',
      lastActive: '2 hours ago',
    },
    {
      id: 2,
      handle: 'stranger_2847',
      aliases: ['fake_friend'],
      platforms: ['Discord', 'Snapchat'],
      incidentCount: 8,
      riskLevel: 'high',
      lastActive: '1 day ago',
    },
  ];

  const stats = {
    totalIncidents: incidents.length,
    critical: incidents.filter(i => i.severity === 'critical').length,
    openCases: casesData.filter(c => c.status === 'open').length,
    resolved: casesData.filter(c => c.status === 'resolved').length,
  };

  const handleAssignIncident = (id: string) => {
    toast.success('Incident assigned to you');
  };

  const handleEscalate = (id: string) => {
    toast.success('Incident escalated to law enforcement');
  };

  const handleMarkFalsePositive = (id: string) => {
    toast.success('Marked as false positive');
  };

  return (
    <div className="min-h-screen bg-background">
      <Header title="Investigator Dashboard" userName={user.name} />

      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Incidents</CardTitle>
              <AlertTriangle className="w-4 h-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.totalIncidents}</div>
              <p className="text-xs text-muted-foreground">Active reports</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Critical Alerts</CardTitle>
              <AlertOctagon className="w-4 h-4 text-destructive" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-destructive">{stats.critical}</div>
              <p className="text-xs text-muted-foreground">Requires immediate action</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Open Cases</CardTitle>
              <FileText className="w-4 h-4 text-warning" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.openCases}</div>
              <p className="text-xs text-muted-foreground">Under investigation</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Resolved</CardTitle>
              <CheckCircle className="w-4 h-4 text-success" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-success">{stats.resolved}</div>
              <p className="text-xs text-muted-foreground">This month</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="incidents" className="w-full">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="incidents">Incidents</TabsTrigger>
            <TabsTrigger value="predators">Predators</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="cases">Cases</TabsTrigger>
            <TabsTrigger value="forensics">Forensics</TabsTrigger>
            <TabsTrigger value="emergency">
              Emergency
              <Badge variant="destructive" className="ml-2">2</Badge>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="incidents" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Incident Queue</CardTitle>
                  <div className="flex items-center gap-2">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        placeholder="Search by sender..."
                        className="pl-9 w-64"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>
                    <Select value={filterSeverity} onValueChange={setFilterSeverity}>
                      <SelectTrigger className="w-40">
                        <SelectValue placeholder="All Severity" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Severity</SelectItem>
                        <SelectItem value="critical">Critical</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="low">Low</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {filteredIncidents.map((incident: any, index: number) => (
                    <motion.div
                      key={incident.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="p-4 border rounded-lg hover:shadow-md transition-shadow cursor-pointer"
                      onClick={() => setSelectedIncident(incident)}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-start gap-3">
                          <AlertTriangle
                            className={`w-5 h-5 ${
                              incident.severity === 'critical' ? 'text-red-500' :
                              incident.severity === 'high' ? 'text-orange-500' :
                              incident.severity === 'medium' ? 'text-yellow-500' : 'text-blue-500'
                            }`}
                          />
                          <div>
                            <h4 className="font-semibold">INC-{incident.id}</h4>
                            <p className="text-sm text-muted-foreground">
                              {incident.platform} • {incident.sender}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant={incident.severity === 'critical' || incident.severity === 'high' ? 'destructive' : 'secondary'}>
                            {incident.severity}
                          </Badge>
                          <div className="text-right">
                            <div className="text-sm font-bold">Risk: {incident.riskScore}</div>
                            <Progress value={incident.riskScore} className="w-16 h-1" />
                          </div>
                        </div>
                      </div>
                      <p className="text-sm mb-2">{incident.reason}</p>
                      <div className="flex items-center gap-2">
                        {incident.tags.map((tag: string, i: number) => (
                          <Badge key={i} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                        <span className="text-xs text-muted-foreground ml-auto">
                          <Clock className="w-3 h-3 inline mr-1" />
                          {new Date(incident.timestamp).toLocaleString()}
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="predators" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Predator Watchlist
                </CardTitle>
                <CardDescription>Tracked offenders and suspicious accounts</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {predators.map((predator, index) => (
                    <motion.div
                      key={predator.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="p-4 border-2 border-red-200 dark:border-red-900 rounded-lg bg-red-50/50 dark:bg-red-950/20"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-start gap-3">
                          <div className="p-2 bg-red-100 dark:bg-red-900 rounded-full">
                            <User className="w-5 h-5 text-red-600" />
                          </div>
                          <div>
                            <h4 className="font-bold text-lg">{predator.handle}</h4>
                            <p className="text-sm text-muted-foreground">
                              Aliases: {predator.aliases.join(', ')}
                            </p>
                            <div className="flex items-center gap-2 mt-1">
                              {predator.platforms.map((platform, i) => (
                                <Badge key={i} variant="outline" className="text-xs">
                                  {platform}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                        <Badge variant="destructive" className="text-lg px-3 py-1">
                          {predator.riskLevel}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-3 gap-4 mb-3 p-3 bg-white dark:bg-gray-900 rounded-lg">
                        <div>
                          <p className="text-xs text-muted-foreground">Incidents</p>
                          <p className="text-lg font-bold">{predator.incidentCount}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Risk Level</p>
                          <p className="text-lg font-bold text-red-600">{predator.riskLevel}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Last Active</p>
                          <p className="text-sm font-semibold">{predator.lastActive}</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          <Network className="w-3 h-3 mr-2" />
                          View Network
                        </Button>
                        <Button size="sm" variant="outline">
                          <Eye className="w-3 h-3 mr-2" />
                          View Profile
                        </Button>
                        <Button size="sm" variant="destructive">
                          <Send className="w-3 h-3 mr-2" />
                          Report to Authorities
                        </Button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-4">
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="w-5 h-5" />
                    Incident Trends
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-center justify-center bg-muted rounded-lg">
                    <div className="text-center">
                      <TrendingUp className="w-12 h-12 mx-auto mb-2 text-primary" />
                      <p className="text-sm text-muted-foreground">Chart: Incidents by Day/Week</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <PieChart className="w-5 h-5" />
                    Platform Distribution
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-center justify-center bg-muted rounded-lg">
                    <div className="text-center">
                      <PieChart className="w-12 h-12 mx-auto mb-2 text-primary" />
                      <p className="text-sm text-muted-foreground">Chart: Top Platforms</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Severity Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {['critical', 'high', 'medium', 'low'].map((severity, i) => {
                      const count = incidents.filter(inc => inc.severity === severity).length;
                      const percentage = (count / incidents.length) * 100;
                      return (
                        <div key={severity}>
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm font-medium capitalize">{severity}</span>
                            <span className="text-sm text-muted-foreground">{count} ({percentage.toFixed(0)}%)</span>
                          </div>
                          <Progress value={percentage} className="h-2" />
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Geographic Heatmap</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-center justify-center bg-gradient-to-br from-cyan-100 to-pink-100 dark:from-blue-950 dark:to-purple-950 rounded-lg">
                    <div className="text-center">
                      <MapPin className="w-12 h-12 mx-auto mb-2 text-primary" />
                      <p className="text-sm text-muted-foreground">Regional Incident Clustering</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="cases" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Case Management</CardTitle>
                  <Button className="gradient-cyan-blue text-white">
                    <FileText className="w-4 h-4 mr-2" />
                    Create New Case
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {casesData.map((caseItem, index) => (
                    <motion.div
                      key={caseItem.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="p-4 border rounded-lg hover:shadow-md transition-shadow cursor-pointer"
                      onClick={() => setSelectedCase(caseItem)}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h4 className="font-semibold">CASE-{caseItem.id}</h4>
                          <p className="text-sm text-muted-foreground">Child: {caseItem.childName}</p>
                        </div>
                        <Badge variant={caseItem.status === 'open' ? 'destructive' : 'secondary'}>
                          {caseItem.status}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span>Priority: {caseItem.priority}</span>
                        <span>Platform: {caseItem.predatorProfile.platform}</span>
                        <span>Suspect: {caseItem.predatorProfile.username}</span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="forensics" className="space-y-4">
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Hash className="w-5 h-5" />
                    Digital Fingerprints
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 text-sm font-mono">
                    <div className="p-3 bg-muted rounded">
                      <p className="text-xs text-muted-foreground mb-1">Device ID</p>
                      <p>d4e5f6a7-b8c9-0d1e-2f3a-4b5c6d7e8f9a</p>
                    </div>
                    <div className="p-3 bg-muted rounded">
                      <p className="text-xs text-muted-foreground mb-1">IP Address</p>
                      <p>192.168.1.105</p>
                    </div>
                    <div className="p-3 bg-muted rounded">
                      <p className="text-xs text-muted-foreground mb-1">MAC Address</p>
                      <p>00:1B:44:11:3A:B7</p>
                    </div>
                    <div className="p-3 bg-muted rounded">
                      <p className="text-xs text-muted-foreground mb-1">SHA-256 Hash</p>
                      <p className="break-all">a3b2c1d0e9f8...</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="w-5 h-5" />
                    Audit Trail
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {['Viewed incident INC-001', 'Exported evidence', 'Assigned case to team', 'Updated risk score'].map((action, i) => (
                      <div key={i} className="flex items-center gap-2 text-sm p-2 border-l-2 border-primary pl-3">
                        <Clock className="w-3 h-3 text-muted-foreground" />
                        <span>{action}</span>
                        <span className="text-xs text-muted-foreground ml-auto">{i + 1}h ago</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="emergency" className="space-y-4">
            <Card className="border-red-500 border-2">
              <CardHeader className="bg-red-50 dark:bg-red-950/30">
                <CardTitle className="flex items-center gap-2 text-red-700 dark:text-red-400">
                  <Phone className="w-5 h-5 animate-pulse" />
                  Emergency SOS Incidents
                </CardTitle>
                <CardDescription>Child-triggered emergency alerts requiring immediate response</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <motion.div
                    animate={{ scale: [1, 1.02, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="p-6 border-2 border-red-500 rounded-lg bg-red-50 dark:bg-red-950/20"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h4 className="text-xl font-bold text-red-700 dark:text-red-400">SOS-2024-001</h4>
                        <p className="text-sm text-muted-foreground">Child: Emma Wilson (Age 10)</p>
                      </div>
                      <Badge variant="destructive" className="text-lg px-4 py-2 animate-pulse">
                        ACTIVE
                      </Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="p-3 bg-white dark:bg-gray-900 rounded">
                        <p className="text-xs text-muted-foreground mb-1">Triggered</p>
                        <p className="font-semibold">5 minutes ago</p>
                      </div>
                      <div className="p-3 bg-white dark:bg-gray-900 rounded">
                        <p className="text-xs text-muted-foreground mb-1">Location</p>
                        <p className="font-semibold">Main St & 5th Ave</p>
                      </div>
                      <div className="p-3 bg-white dark:bg-gray-900 rounded">
                        <p className="text-xs text-muted-foreground mb-1">Device</p>
                        <p className="font-semibold">iPhone 12</p>
                      </div>
                      <div className="p-3 bg-white dark:bg-gray-900 rounded">
                        <p className="text-xs text-muted-foreground mb-1">Platform</p>
                        <p className="font-semibold">Instagram DM</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button size="lg" variant="destructive" className="flex-1">
                        <Phone className="w-4 h-4 mr-2" />
                        Contact Parent
                      </Button>
                      <Button size="lg" variant="destructive" className="flex-1">
                        <Send className="w-4 h-4 mr-2" />
                        Alert Law Enforcement
                      </Button>
                      <Button size="lg" variant="outline">
                        <MapPin className="w-4 h-4 mr-2" />
                        Track Location
                      </Button>
                    </div>
                  </motion.div>

                  <motion.div
                    animate={{ scale: [1, 1.02, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="p-6 border-2 border-red-500 rounded-lg bg-red-50 dark:bg-red-950/20"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h4 className="text-xl font-bold text-red-700 dark:text-red-400">SOS-2024-002</h4>
                        <p className="text-sm text-muted-foreground">Child: Lucas Wilson (Age 12)</p>
                      </div>
                      <Badge variant="destructive" className="text-lg px-4 py-2 animate-pulse">
                        ACTIVE
                      </Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="p-3 bg-white dark:bg-gray-900 rounded">
                        <p className="text-xs text-muted-foreground mb-1">Triggered</p>
                        <p className="font-semibold">12 minutes ago</p>
                      </div>
                      <div className="p-3 bg-white dark:bg-gray-900 rounded">
                        <p className="text-xs text-muted-foreground mb-1">Location</p>
                        <p className="font-semibold">Park Ave & 3rd St</p>
                      </div>
                      <div className="p-3 bg-white dark:bg-gray-900 rounded">
                        <p className="text-xs text-muted-foreground mb-1">Device</p>
                        <p className="font-semibold">Samsung Galaxy S21</p>
                      </div>
                      <div className="p-3 bg-white dark:bg-gray-900 rounded">
                        <p className="text-xs text-muted-foreground mb-1">Platform</p>
                        <p className="font-semibold">Discord Chat</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button size="lg" variant="destructive" className="flex-1">
                        <Phone className="w-4 h-4 mr-2" />
                        Contact Parent
                      </Button>
                      <Button size="lg" variant="destructive" className="flex-1">
                        <Send className="w-4 h-4 mr-2" />
                        Alert Law Enforcement
                      </Button>
                      <Button size="lg" variant="outline">
                        <MapPin className="w-4 h-4 mr-2" />
                        Track Location
                      </Button>
                    </div>
                  </motion.div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <Dialog open={!!selectedIncident} onOpenChange={() => setSelectedIncident(null)}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" />
              Incident Details: INC-{selectedIncident?.id}
            </DialogTitle>
          </DialogHeader>
          {selectedIncident && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Risk Score</label>
                  <div className="flex items-center gap-2 mt-1">
                    <Progress value={selectedIncident.riskScore} className="flex-1" />
                    <span className="font-bold">{selectedIncident.riskScore}/100</span>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Severity</label>
                  <Badge className="mt-1" variant={selectedIncident.severity === 'critical' || selectedIncident.severity === 'high' ? 'destructive' : 'secondary'}>
                    {selectedIncident.severity}
                  </Badge>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground">Content Preview</label>
                <div className="mt-1 p-4 bg-muted rounded-lg blur-content text-center">
                  {selectedIncident.preview}
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground">AI Analysis</label>
                <div className="mt-1 p-3 bg-blue-50 dark:bg-blue-950 rounded-lg text-sm">
                  <p><strong>Why flagged:</strong> Pattern matching detected keywords associated with {selectedIncident.tags.join(', ')}. Sentiment analysis indicates potential threat.</p>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground">Metadata</label>
                <div className="mt-1 p-3 bg-muted rounded-lg space-y-1 text-sm font-mono">
                  <p>IP: {selectedIncident.metadata?.ipAddress || '192.168.1.1'}</p>
                  <p>Device: {selectedIncident.metadata?.deviceFingerprint || 'iPhone 12'}</p>
                  <p>Timestamp: {new Date(selectedIncident.timestamp).toLocaleString()}</p>
                </div>
              </div>

              <div className="flex gap-2">
                <Button onClick={() => handleAssignIncident(selectedIncident.id)}>
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Assign to Me
                </Button>
                <Button variant="outline" onClick={() => handleMarkFalsePositive(selectedIncident.id)}>
                  <XCircle className="w-4 h-4 mr-2" />
                  False Positive
                </Button>
                <Button variant="destructive" onClick={() => handleEscalate(selectedIncident.id)}>
                  <Send className="w-4 h-4 mr-2" />
                  Escalate
                </Button>
                <Button variant="outline">
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
