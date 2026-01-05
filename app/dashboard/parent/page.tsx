'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Shield, AlertTriangle, TrendingUp, Trophy, Clock, Ban, Send, User, AlertOctagon, Gamepad2, Video, BookOpen, Activity, MapPin, Calendar, Loader2, CheckCircle, UserPlus, Eye, EyeOff, RotateCcw, XCircle, Play, MonitorDown } from 'lucide-react'; 
import { getUser } from '@/lib/auth';
import { Header } from '@/components/shared/Header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { GeofencingMap } from '@/components/parent/GeofencingMap';
import { MediaMonitoring } from '@/components/parent/MediaMonitoring';
import { ActivityTable } from '@/components/parent/ActivityTable';
import dynamic from 'next/dynamic';

// Load LocationMap only on the client to avoid bundling Leaflet during server-side
// rendering/build. This prevents Next from failing when `leaflet` isn't installed.
const LocationMap = dynamic(
  () => import('@/components/parent/LocationMap').then((mod) => mod.LocationMap),
  { ssr: false }
);
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
// NOTE: client-side page uses browser fetch. Do not import server-only helpers here.

// Backend API base (used for direct backend calls). For the children resource
// we proxy through our Next server route at `/api/children` so the server-side
// `baseApiRequest` can attach tokens from cookies. Keep other backend calls
// pointed at the backend directly if there are no proxy routes.
const API_BASE = 'http://localhost:8060/api';

const addChildSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  age: z.preprocess((val) => Number(val), z.number().int().min(1, 'Age must be at least 1').max(18, 'Max age for child is 18')),
  gender: z.string().min(1, 'Gender is required'),
  dob: z.string().refine((s) => !isNaN(Date.parse(s)), { message: 'DOB is required' }),
  phone: z.string().optional().refine((s) => !s || /^[0-9+\-()\s]{7,20}$/.test(s), { message: 'Invalid phone number' }),
});

type AddChildForm = z.infer<typeof addChildSchema>;
// Use the Next.js server route which proxies to the backend and attaches auth
// tokens from cookies: app/api/children/route.ts
const API_ENDPOINT = '/api/children';



interface Child {
  id: string | number;
  name: string;
  age: number;
  gender: string;
  dob: string;
  phone?: string;
  deviceId?: number;
  avatar: string;
  level: number;
  points: number;
  badges: string[];
  devices?: { id: number; deviceUuid: string; machineName?: string }[];
}

interface ActivityApp {
  app: string;
  windowTitle: string;
  focusedTimeSeconds: number;
  screenTimeSeconds: number;
  focusedTimeFormatted: string;
  screenTimeFormatted: string;
  totalTimeSeconds: number;
  isLive?: boolean;
}

interface Alert {
  id: number;
  deviceId: number;
  appName: string;
  type: string;
  timestamp: string;
  details: string;
}

interface LiveApp {
  appName: string;
  windowTitle: string;
  lastSeen: string;
}

export default function ParentDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [selectedChild, setSelectedChild] = useState<Child | null>(null);
  const [selectedAlert, setSelectedAlert] = useState<any>(null);
  const [showAlertDetail, setShowAlertDetail] = useState(false);
  const [showGeofencing, setShowGeofencing] = useState(false);
  const [showAddChild, setShowAddChild] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [childrenList, setChildrenList] = useState<Child[]>([]);
  const [isLoadingChildren, setIsLoadingChildren] = useState(true);
  const [activityApps, setActivityApps] = useState<ActivityApp[]>([]);
  const [isLoadingActivity, setIsLoadingActivity] = useState(false);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [isLoadingAlerts, setIsLoadingAlerts] = useState(false);
  const [liveApps, setLiveApps] = useState<LiveApp[]>([]);
  const [screenTimeSummary, setScreenTimeSummary] = useState({ totalScreenTime: '0m' });
  const [showChildIds, setShowChildIds] = useState<Record<string | number, boolean>>({});
  const [blockedContentCount, setBlockedContentCount] = useState(0);
  const genderOptions = ['Male', 'Female', 'Transgender', 'other'];

  const { register, handleSubmit, formState, reset } = useForm<AddChildForm>({
    resolver: zodResolver(addChildSchema),
    defaultValues: { name: '', age: undefined as any, gender: '', dob: '', phone: '' },
  });

  const { errors } = formState;
  const dobInputRef = useRef<HTMLInputElement | null>(null);
  const today = new Date().toISOString().slice(0, 10);

  const fetchChildren = useCallback(async () => {
    setIsLoadingChildren(true);
    try {
      // Use client-side fetch here (this is a client component). If your API requires
      // Authorization via Bearer token, include it here (e.g. from localStorage) or
      // ensure your backend accepts cookies and CORS is configured.
      const res = await fetch(API_ENDPOINT, { method: 'GET', headers: { 'Content-Type': 'application/json' } });
      const text = await res.text();
      if (!res.ok) {
        let message = `Failed to fetch children: ${res.status} ${res.statusText}`;
        try {
          const parsed = JSON.parse(text);
          message = parsed.message || message;
        } catch {}
        throw new Error(message);
      }
      let data: any = {};
      try {
        data = text ? JSON.parse(text) : {};
      } catch (err) {
        console.error('Failed to parse children response:', err, 'text:', text);
        data = {};
      }

      // Normalize response to an array of children. The backend may return:
      // - { children: [...] }
      // - [...]
      // - a single child object { id, name, ... }
      // - empty / unexpected shapes
      let childrenArray: any[] = [];
      if (Array.isArray(data.children)) {
        childrenArray = data.children;
      } else if (Array.isArray(data)) {
        childrenArray = data;
      } else if (data && Array.isArray((data as any).child)) {
        childrenArray = (data as any).child;
      } else if (data && typeof data === 'object' && (data.id || data.name)) {
        // single child object
        childrenArray = [data];
      } else {
        childrenArray = [];
      }

      const mappedChildren: Child[] = childrenArray.map((child: any) => ({
        id: child.id || child.deviceId || `child-${Date.now()}`,
        name: child.name,
        age: child.age,
        gender: child.gender,
        dob: child.dob ? new Date(child.dob).toISOString().split('T')[0] : '',
        phone: child.phone,
        deviceId: child.deviceId,
        avatar: '👤',
        level: child.level || 1,
        points: child.points || 0,
        badges: child.badges || [],
        devices: child.devices || [],
      }));
  setChildrenList(mappedChildren);
      if (mappedChildren.length > 0 && !selectedChild) {
        setSelectedChild(mappedChildren[0]);
      }
    } catch (error) {
      console.error('Error fetching children:', error);
      toast.error('Failed to load children data');
    } finally {
      setIsLoadingChildren(false);
    }
  }, [selectedChild]);

  const fetchActivityData = useCallback(async (childId: number | string, isInitialLoad = true) => {
    if (isInitialLoad) setIsLoadingActivity(true);
    try {
      const response = await fetch(`${API_BASE}/summary/daily-comparison?childId=${childId}`);
      if (!response.ok) throw new Error('Failed to fetch activity');
      const data = await response.json();
      
      const child = childrenList.find(c => c.id === childId);
      const deviceIds = child?.devices?.map(d => d.id) || [];
      
      let liveAppsList: LiveApp[] = [];
      for (const deviceId of deviceIds) {
        try {
          const liveRes = await fetch(`${API_BASE}/live-status?deviceId=${deviceId}`);
          if (liveRes.ok) {
            const liveData = await liveRes.json();
            liveAppsList = [...liveAppsList, ...liveData];
          }
        } catch {}
      }
      setLiveApps(liveAppsList);
      
      const appsWithLiveStatus = (data.apps || []).map((app: ActivityApp) => ({
        ...app,
        isLive: liveAppsList.some(la => la.appName.toLowerCase() === app.app.toLowerCase()),
        windowTitle: liveAppsList.find(la => la.appName.toLowerCase() === app.app.toLowerCase())?.windowTitle || app.windowTitle,
      }));
      
      setActivityApps(appsWithLiveStatus);
      setScreenTimeSummary({
        totalScreenTime: formatDuration((data.summary?.totalFocusedSeconds || 0) + (data.summary?.totalScreenSeconds || 0)),
      });
    } catch (error) {
      console.error('Error fetching activity:', error);
    } finally {
      if (isInitialLoad) setIsLoadingActivity(false);
    }
  }, [childrenList]);

  const fetchLiveStatus = useCallback(async (childId: number | string) => {
    try {
      const child = childrenList.find(c => c.id === childId);
      const deviceIds = child?.devices?.map(d => d.id) || [];
      
      let liveAppsList: LiveApp[] = [];
      for (const deviceId of deviceIds) {
        try {
          const liveRes = await fetch(`${API_BASE}/live-status?deviceId=${deviceId}`);
          if (liveRes.ok) {
            const liveData = await liveRes.json();
            liveAppsList = [...liveAppsList, ...liveData];
          }
        } catch {}
      }
      setLiveApps(liveAppsList);
      
      setActivityApps(prevApps => prevApps.map(app => {
        const liveApp = liveAppsList.find(la => la.appName.toLowerCase() === app.app.toLowerCase());
        return {
          ...app,
          isLive: !!liveApp,
          windowTitle: liveApp?.windowTitle || app.windowTitle,
        };
      }));
    } catch (error) {
      console.error('Error fetching live status:', error);
    }
  }, [childrenList]);

  const fetchAlerts = useCallback(async (childId: number | string) => {
    setIsLoadingAlerts(true);
    try {
      const child = childrenList.find(c => c.id === childId);
      const deviceIds = child?.devices?.map(d => d.id) || [];
      
      let allAlerts: Alert[] = [];
      for (const deviceId of deviceIds) {
        try {
          const response = await fetch(`${API_BASE}/alerts/list?deviceId=${deviceId}`);
          if (response.ok) {
            const data = await response.json();
            allAlerts = [...allAlerts, ...(data.alerts || [])];
          }
        } catch {}
      }
      
      allAlerts.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
      setAlerts(allAlerts);
    } catch (error) {
      console.error('Error fetching alerts:', error);
    } finally {
      setIsLoadingAlerts(false);
    }
  }, [childrenList]);

  const fetchBlockedContentCount = useCallback(async (childId: number | string) => {
    try {
      const child = childrenList.find(c => c.id === childId);
      const deviceIds = child?.devices?.map(d => d.id) || [];
      
      let totalCount = 0;
      for (const deviceId of deviceIds) {
        try {
          const response = await fetch(`${API_BASE}/alerts/count-last-24h?deviceId=${deviceId}`);
          if (response.ok) {
            const data = await response.json();
            totalCount += data.count || 0;
          }
        } catch {}
      }
      
      setBlockedContentCount(totalCount);
    } catch (error) {
      console.error('Error fetching blocked content count:', error);
    }
  }, [childrenList]);

  const handleKillApp = async (appName: string) => {
    if (!selectedChild) return;
    const child = childrenList.find(c => c.id === selectedChild.id);
    const deviceId = child?.devices?.[0]?.id;
    if (!deviceId) {
      toast.error('No device linked to this child');
      return;
    }
    try {
      const res = await fetch(`${API_BASE}/commands/kill`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ deviceId, appName }),
      });
      if (res.ok) {
        toast.success(`Kill command sent for ${appName}`);
      } else {
        toast.error('Failed to send kill command');
      }
    } catch {
      toast.error('Failed to send kill command');
    }
  };

  const handleRelaunchApp = async (appName: string) => {
    if (!selectedChild) return;
    const child = childrenList.find(c => c.id === selectedChild.id);
    const deviceId = child?.devices?.[0]?.id;
    if (!deviceId) {
      toast.error('No device linked to this child');
      return;
    }
    try {
      const res = await fetch(`${API_BASE}/commands/relaunch`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ deviceId, appName }),
      });
      if (res.ok) {
        toast.success(`Relaunch command sent for ${appName}`);
      } else {
        toast.error('Failed to send relaunch command');
      }
    } catch {
      toast.error('Failed to send relaunch command');
    }
  };

  const formatDuration = (seconds: number): string => {
    if (!seconds || seconds < 60) return `${seconds ?? 0}s`;
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    if (h > 0) return `${h}h ${m}m`;
    return `${m}m`;
  };

  const getAppIcon = (appName: string) => {
    const name = appName.toLowerCase();
    if (name.includes('chrome')) return '🌐';
    if (name.includes('edge') || name.includes('msedge')) return '🔷';
    if (name.includes('firefox')) return '🦊';
    if (name.includes('code') || name.includes('vscode')) return '💻';
    if (name.includes('explorer')) return '📁';
    if (name.includes('terminal') || name.includes('cmd') || name.includes('powershell')) return '⬛';
    if (name.includes('chat') || name.includes('teams') || name.includes('slack')) return '💬';
    if (name.includes('youtube')) return '▶️';
    if (name.includes('spotify') || name.includes('music')) return '🎵';
    if (name.includes('game')) return '🎮';
    return '📱';
  };

  const parseAlertDetails = (details: string) => {
    try {
      return JSON.parse(details);
    } catch {
      return { raw: details };
    }
  };

  const getAlertSeverity = (type: string): 'low' | 'medium' | 'high' | 'critical' => {
    const t = type.toLowerCase();
    if (t.includes('critical') || t.includes('danger')) return 'critical';
    if (t.includes('high') || t.includes('warning')) return 'high';
    if (t.includes('medium') || t.includes('suspicious')) return 'medium';
    return 'low';
  };

  useEffect(() => {
    const currentUser = getUser();
    // if (!currentUser || currentUser.role !== 'parent') {
    //   router.push('/login');
    //   return;
    // }
    setUser(currentUser);
    console.log (currentUser);
    fetchChildren();
  }, [router, fetchChildren]);

  useEffect(() => {
    if (selectedChild?.id) {
      fetchActivityData(selectedChild.id);
      fetchAlerts(selectedChild.id);
      fetchBlockedContentCount(selectedChild.id);
    }
  }, [selectedChild?.id, fetchActivityData, fetchAlerts, fetchBlockedContentCount]);

  // Poll live status every 2.5 seconds for real-time updates
  useEffect(() => {
    if (!selectedChild?.id) return;
    
    const intervalId = setInterval(() => {
      fetchLiveStatus(selectedChild.id);
    }, 2500);

    return () => clearInterval(intervalId);
  }, [selectedChild?.id, fetchLiveStatus]);

  // Refresh activity data every 30 seconds for time updates
  useEffect(() => {
    if (!selectedChild?.id) return;
    
    const intervalId = setInterval(() => {
      fetchActivityData(selectedChild.id, false);
    }, 30000);

    return () => clearInterval(intervalId);
  }, [selectedChild?.id, fetchActivityData]);

  // Poll blocked content count every 10 seconds
  useEffect(() => {
    if (!selectedChild?.id) return;
    
    const intervalId = setInterval(() => {
      fetchBlockedContentCount(selectedChild.id);
    }, 10000);

    return () => clearInterval(intervalId);
  }, [selectedChild?.id, fetchBlockedContentCount]);

  if (!user) return null;

  const myChildren = childrenList;

  // TODO: Uncomment when data is available
  // const learningProgress = [
  //   { game: 'Stranger Danger Detective', progress: 80, status: 'in-progress' },
  //   { game: 'Password Power-Up', progress: 100, status: 'completed' },
  //   { game: 'Share Smart Challenge', progress: 45, status: 'in-progress' },
  //   { game: 'Cyber Bully Blocker', progress: 30, status: 'in-progress' },
  // ];

  // const blockedContent = [
  //   { type: 'Inappropriate Image', reason: 'Contains adult content', sender: 'unknown_user', time: '25 min ago', severity: 'critical' },
  //   { type: 'Suspicious Message', reason: 'Requesting personal information', sender: 'stranger_2847', time: '3 hours ago', severity: 'high' },
  //   { type: 'Unsafe Link', reason: 'Phishing attempt detected', sender: 'promo_deals', time: '5 hours ago', severity: 'high' },
  //   { type: 'Inappropriate Text', reason: 'Contains profanity and bullying language', sender: 'school_anonymous', time: '1 day ago', severity: 'medium' },
  // ];

  // const gamesPlayed = [
  //   { name: 'Stranger Danger Detective', sessions: 5, timeSpent: '45 min', lastPlayed: 'Today' },
  //   { name: 'Password Power-Up', sessions: 8, timeSpent: '1h 20min', lastPlayed: 'Today' },
  //   { name: 'Share Smart Challenge', sessions: 3, timeSpent: '30 min', lastPlayed: 'Yesterday' },
  // ];

  const severityColors = {
    low: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    medium: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    high: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
    critical: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
  };

  const handleBlockSender = (sender: string) => {
    toast.success(`Sender "${sender}" has been permanently blocked`);
    setShowAlertDetail(false);
  };

  const handleEscalate = (alert: any) => {
    toast.success('Alert escalated to investigator team');
    setShowAlertDetail(false);
  };
  
  const handleViewAlertDetail = (alert: any) => {
    setSelectedAlert(alert);
    setShowAlertDetail(true);
  };

  const handleAddChild = async (data: AddChildForm) => {
    setIsSubmitting(true);
    const { name, age, gender, dob, phone } = data;

    const payload = {
      name,
      age: age,
      gender: gender,
      dob: new Date(dob).toISOString().split('T')[0],
      phone: phone || null,
      // parentId: user.id,
    };

    try {
      // Client-side POST: read text then parse JSON to avoid double .json() calls
      const res = await fetch(API_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const text = await res.text();
      if (!res.ok) {
        let message = `Failed to add child: ${res.status} ${res.statusText}`;
        try {
          const parsed = JSON.parse(text);
          message = parsed.message || message;
        } catch {}
        throw new Error(message);
      }
      const newChildData = text ? JSON.parse(text) : {};

      const child: Child = {
        id: newChildData.id || newChildData.deviceId || `child-${Date.now()}`,
        name,
        age: age,
        gender,
        avatar: '👤',
        level: newChildData.level || 1,
        points: newChildData.points || 0,
        badges: newChildData.badges || [],
        dob: payload.dob,
        phone: phone || undefined,
        deviceId: newChildData.deviceId,
      };

      setChildrenList(prev => [child, ...prev]);
      setSelectedChild(child);
      setShowAddChild(false);
      reset();
      toast.success(`Child "${name}" successfully added!`);
      
      fetchChildren();

    } catch (error: any) {
      console.error('API Error:', error);
      toast.error(error.message || 'An error occurred while adding the child.');
    } finally {
      setIsSubmitting(false);
    }
  };
  

  const selectedChildDeviceId = selectedChild?.devices?.[0]?.id;
  const selectedChildDeviceIds = selectedChild?.devices?.map(d => d.id) || [];

  return (
    <div className="min-h-screen bg-background">
      <Header title="Parent Dashboard" userName={user.name} />

      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="mb-8">
         <div className="flex items-center justify-between mb-4">
  <h2 className="text-2xl font-bold">Your Children</h2>

  {/* Right-side container for both buttons */}
  <div className="flex items-center gap-3">
    <Button
      size="lg"
      onClick={() => {
        const link = document.createElement("a");
        link.href = "/ZyberHero_setup_v1.0.0.exe";
        link.download = "ZyberHero_setup_v1.0.0.exe";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }}
      className="font-child bg-green-600 hover:bg-green-700 text-white"
    >
      <MonitorDown className="w-5 h-5 mr-2" />
      Download ZyberHero Now!
    </Button>

    <Button onClick={() => setShowAddChild(true)}>
      <UserPlus className="w-4 h-4 mr-2" />
      Add Child
    </Button>
  </div>
</div>

          
          {isLoadingChildren ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
              <span className="ml-2 text-muted-foreground">Loading children...</span>
            </div>
          ) : myChildren.length === 0 ? (
            <Card className="border-dashed">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <UserPlus className="w-12 h-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No children added yet</h3>
                <p className="text-muted-foreground text-center mb-4">
                  Add your child to start monitoring their online safety.
                </p>
                <Button onClick={() => setShowAddChild(true)}>
                  <UserPlus className="w-4 h-4 mr-2" />
                  Add Your Child
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid md:grid-cols-3 gap-4">
              {myChildren.map((child) => (
                <motion.div
                  key={child.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Card
                    className={`cursor-pointer transition-all ${
                      selectedChild?.id === child.id ? 'ring-2 ring-primary shadow-lg' : 'hover:shadow-md'
                    }`}
                    onClick={() => setSelectedChild(child)}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-center gap-4">
                        <div className="text-5xl">{child.avatar}</div>
                        <div className="flex-1">
                          <h3 className="text-xl font-bold">{child.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            Age {child.age}{child.dob ? ` • DOB ${child.dob}` : ''} • Level {child.level}
                          </p>
                          <div className="flex items-center gap-2 mt-2">
                            <Badge variant="secondary">{child.points} points</Badge>
                            <Badge variant={alerts.length > 0 ? 'destructive' : 'secondary'}>
                              {child.id === selectedChild?.id ? alerts.length : 0} alerts
                            </Badge>
                          </div>
                          <div className="flex items-center gap-2 mt-2">
                            <span className="text-xs text-muted-foreground">
                              ID: {showChildIds[child.id] ? child.id : '••••••'}
                            </span>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 w-6 p-0"
                              onClick={(e) => {
                                e.stopPropagation();
                                setShowChildIds(prev => ({ ...prev, [child.id]: !prev[child.id] }));
                              }}
                            >
                              {showChildIds[child.id] ? (
                                <EyeOff className="w-3 h-3" />
                              ) : (
                                <Eye className="w-3 h-3" />
                              )}
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="alerts">
              <AlertTriangle className="w-4 h-4 mr-2" />
              Alerts ({alerts.length})
            </TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
            {/* <TabsTrigger value="learning">Learning</TabsTrigger> */}
            <TabsTrigger value="location">
              <MapPin className="w-4 h-4 mr-2" />
              Location
            </TabsTrigger>
            {/* <TabsTrigger value="media">
              <Video className="w-4 h-4 mr-2" />
              Media
            </TabsTrigger>
            <TabsTrigger value="blocked">Blocked</TabsTrigger>
            <TabsTrigger value="threats">Threats</TabsTrigger> */}
          </TabsList>

          {!selectedChild ? (
            <div className="mt-6">
              <Card className="border-dashed">
                <CardContent className="flex flex-col items-center justify-center py-16">
                  <UserPlus className="w-16 h-16 text-muted-foreground mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No child selected</h3>
                  <p className="text-muted-foreground text-center max-w-md">
                    Add a child to view their dashboard data including activity, alerts, learning progress, and more.
                  </p>
                </CardContent>
              </Card>
            </div>
          ) : (
            <>
          <TabsContent value="overview" className="space-y-6">
            <div className="grid md:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">New Alerts</CardTitle>
                  <AlertTriangle className="w-4 h-4 text-destructive" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{alerts.length}</div>
                  <p className="text-xs text-muted-foreground">Requires attention</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Screen Time</CardTitle>
                  <Clock className="w-4 h-4 text-primary" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{screenTimeSummary.totalScreenTime}</div>
                  <p className="text-xs text-muted-foreground">Today&apos;s total</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Active Apps</CardTitle>
                  <Activity className="w-4 h-4 text-green-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{activityApps.filter(a => a.isLive).length}</div>
                  <p className="text-xs text-muted-foreground">Running now</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Content Blocked</CardTitle>
                  <Shield className="w-4 h-4 text-green-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{blockedContentCount}</div>
                  <p className="text-xs text-muted-foreground">In the last 24 hours</p>
                </CardContent>
              </Card>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Screen Time Summary</CardTitle>
                  <CardDescription>Today&apos;s usage breakdown</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
                    <span className="text-sm font-medium">Total Screen Time</span>
                    <span className="text-lg font-bold text-orange-500">{screenTimeSummary.totalScreenTime}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
                    <span className="text-sm font-medium">Apps Used Today</span>
                    <span className="text-lg font-bold">{activityApps.length}</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Safety Achievements</CardTitle>
                  <CardDescription>Badges earned by {selectedChild.name}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-4">
                    {['⭐', '🎯', '🦸', '🛡️', '🎮', '📺'].map((emoji, index) => (
                      <div
                        key={index}
                        className={`p-4 rounded-lg text-center ${
                          index < selectedChild.badges.length
                            ? 'bg-gradient-to-br from-yellow-100 to-orange-100 dark:from-yellow-900 dark:to-orange-900'
                            : 'bg-gray-100 dark:bg-gray-800 opacity-40'
                        }`}
                      >
                        <div className="text-4xl">{emoji}</div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="alerts" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <AlertTriangle className="w-6 h-6 text-red-500" />
                  <div>
                    <CardTitle>All Alerts for {selectedChild.name}</CardTitle>
                    <CardDescription>Review new and previously managed security alerts.</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {isLoadingAlerts ? (
                    <div className="flex items-center justify-center py-8">
                      <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
                    </div>
                  ) : alerts.length === 0 ? (
                    <div className="text-center py-8">
                      <CheckCircle className="w-12 h-12 mx-auto mb-2 text-green-500" />
                      <p className="text-muted-foreground">No alerts detected at this time.</p>
                    </div>
                  ) : (
                    alerts.map((alert, index) => {
                      const details = parseAlertDetails(alert.details);
                      const severity = getAlertSeverity(alert.type);
                      return (
                        <motion.div
                          key={alert.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className="border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                          onClick={() => handleViewAlertDetail({ ...alert, details, severity })}
                        >
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h4 className="font-semibold flex items-center gap-2">
                                <span className="h-3 w-3 rounded-full bg-red-500 animate-pulse" />
                                {alert.type}
                              </h4>
                              <p className="text-sm text-muted-foreground mt-1">
                                App: {alert.appName} | Device ID: {alert.deviceId}
                              </p>
                            </div>
                            <div className="flex flex-col items-end gap-1">
                              <Badge className={severityColors[severity]}>
                                {severity}
                              </Badge>
                              <span className="text-xs text-muted-foreground">
                                {new Date(alert.timestamp).toLocaleTimeString()}
                              </span>
                            </div>
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                            {details.windowTitle || details.url || details.raw || 'View details'}
                          </p>
                        </motion.div>
                      );
                    })
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="activity" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Activity className="w-6 h-6" />
                    <div>
                      <CardTitle>Activity Logs</CardTitle>
                      <CardDescription>Today&apos;s app usage for {selectedChild.name}</CardDescription>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground">Screen Time:</span>
                      <span className="font-bold text-orange-500">{screenTimeSummary.totalScreenTime}</span>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <ActivityTable
                  apps={activityApps}
                  isLoading={isLoadingActivity}
                  deviceId={selectedChildDeviceId}
                  onRefresh={() => fetchActivityData(selectedChild.id)}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="learning" className="space-y-4">
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-16">
                <Gamepad2 className="w-16 h-16 text-muted-foreground mb-4" />
                <h3 className="text-xl font-semibold mb-2">Coming Soon</h3>
                <p className="text-muted-foreground text-center max-w-md">
                  Learning progress and educational games data will be available here.
                </p>
              </CardContent>
            </Card>
            {/* TODO: Uncomment when data is available
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <Gamepad2 className="w-6 h-6" />
                    <div>
                      <CardTitle>Learning Progress</CardTitle>
                      <CardDescription>Educational games completion status</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {learningProgress.map((item, index) => (
                    <div key={index} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <span className="font-medium">{item.game}</span>
                        <Badge variant={item.status === 'completed' ? 'default' : 'secondary'}>
                          {item.status === 'completed' ? 'Completed' : 'In Progress'}
                        </Badge>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Progress</span>
                          <span className="font-semibold">{item.progress}%</span>
                        </div>
                        <Progress value={item.progress} className="h-2" />
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <Video className="w-6 h-6" />
                    <div>
                      <CardTitle>Games Played</CardTitle>
                      <CardDescription>Session history and time spent</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {gamesPlayed.map((game, index) => (
                    <div key={index} className="p-4 border rounded-lg">
                      <h4 className="font-medium mb-3">{game.name}</h4>
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground">Sessions</p>
                          <p className="font-semibold">{game.sessions}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Time</p>
                          <p className="font-semibold">{game.timeSpent}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Last Played</p>
                          <p className="font-semibold">{game.lastPlayed}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
            */}
          </TabsContent>

          <TabsContent value="location">
            <LocationMap
              childId={selectedChild.id}
              childName={selectedChild.name}
              deviceIds={selectedChildDeviceIds}
            />
          </TabsContent>

          <TabsContent value="media">
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-16">
                <Video className="w-16 h-16 text-muted-foreground mb-4" />
                <h3 className="text-xl font-semibold mb-2">Coming Soon</h3>
                <p className="text-muted-foreground text-center max-w-md">
                  Media monitoring features will be available here.
                </p>
              </CardContent>
            </Card>
            {/* TODO: Uncomment when data is available
            <MediaMonitoring />
            */}
          </TabsContent>

          <TabsContent value="blocked" className="space-y-4">
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-16">
                <Shield className="w-16 h-16 text-muted-foreground mb-4" />
                <h3 className="text-xl font-semibold mb-2">Coming Soon</h3>
                <p className="text-muted-foreground text-center max-w-md">
                  Blocked content data will be available here.
                </p>
              </CardContent>
            </Card>
            {/* TODO: Uncomment when data is available
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Shield className="w-6 h-6 text-red-500" />
                  <div>
                    <CardTitle>Blocked Content</CardTitle>
                    <CardDescription>Content that was automatically blocked by ZyberHero</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {blockedContent.map((content, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h4 className="font-semibold flex items-center gap-2">
                            <Shield className="w-4 h-4 text-red-500" />
                            {content.type}
                          </h4>
                          <p className="text-sm text-muted-foreground mt-1">From: {content.sender}</p>
                        </div>
                        <Badge className={severityColors[content.severity as keyof typeof severityColors]}>
                          {content.severity}
                        </Badge>
                      </div>
                      <div className="bg-muted p-3 rounded-lg mb-3">
                        <p className="text-sm"><strong>Reason:</strong> {content.reason}</p>
                      </div>
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {content.time}
                        </span>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleBlockSender(content.sender)}
                        >
                          <Ban className="w-3 h-3 mr-1" />
                          Block Sender
                        </Button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
            */}
          </TabsContent>

          <TabsContent value="threats" className="space-y-4">
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-16">
                <AlertOctagon className="w-16 h-16 text-muted-foreground mb-4" />
                <h3 className="text-xl font-semibold mb-2">Coming Soon</h3>
                <p className="text-muted-foreground text-center max-w-md">
                  Threat detection data will be available here.
                </p>
              </CardContent>
            </Card>
            {/* TODO: Uncomment when data is available
            <Card className="border-red-200 dark:border-red-900">
              <CardHeader className="bg-red-50 dark:bg-red-950/30">
                <div className="flex items-center gap-3">
                  <AlertOctagon className="w-6 h-6 text-red-500" />
                  <div>
                    <CardTitle className="text-red-700 dark:text-red-400">High-Risk Threat Senders</CardTitle>
                    <CardDescription>Accounts sending dangerous or inappropriate content to {selectedChild.name}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="text-center py-8">
                  <Shield className="w-12 h-12 mx-auto mb-2 text-green-500" />
                  <p className="text-muted-foreground">No threat senders detected. Great job staying safe!</p>
                </div>
              </CardContent>
            </Card>
            */}
          </TabsContent>
            </>
          )}
        </Tabs>
      </div>

      {/* Geofencing Dialog */}
      <Dialog open={showGeofencing && !!selectedChild} onOpenChange={setShowGeofencing}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              Setup Geofencing for {selectedChild?.name}
            </DialogTitle>
            <DialogDescription>
              Set up safe zones and receive alerts when your child enters or leaves designated areas.
            </DialogDescription>
          </DialogHeader>
          {selectedChild && <GeofencingMap childName={selectedChild.name} />}
          <div className="flex justify-end">
            <Button onClick={() => {
              setShowGeofencing(false);
              toast.success('Geofencing setup complete!');
            }}>
              Done
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Add Child Dialog */}
      <Dialog open={showAddChild} onOpenChange={setShowAddChild}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Add Child</DialogTitle>
            <DialogDescription>Enter basic details for the child</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit(handleAddChild)} className="space-y-4 mt-2">
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1">Name</label>
              <Input {...register('name')} placeholder="Child name" />
              {errors?.name && <p className="text-xs text-red-600 mt-1">{errors.name.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1">Age</label>
              <Input {...register('age')} type="number" placeholder="Age" />
              {errors?.age && <p className="text-xs text-red-600 mt-1">{String(errors.age.message)}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1">Gender</label>
              <select {...register('gender')} className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                <option value="">Select Gender</option>
                {genderOptions.map((g) => (
                  <option key={g} value={g}>{g}</option>
                ))}
              </select>
              {errors?.gender && <p className="text-xs text-red-600 mt-1">{errors.gender.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1">Date of Birth</label>
              <div className="relative">
                {
                  (() => {
                    const dobRegister = register('dob');
                    return (
                      <>
                        <Input
                          className="pr-10"
                          type="date"
                          max={today}
                          {...dobRegister}
                          ref={(el: any) => {
                            try {
                              if (typeof dobRegister.ref === 'function') dobRegister.ref(el);
                              else if (dobRegister.ref) (dobRegister.ref as any).current = el;
                            } catch {}
                            (dobInputRef as any).current = el;
                          }}
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const el = (dobInputRef as any).current as HTMLInputElement | null;
                            if (!el) return;
                            if (typeof (el as any).showPicker === 'function') {
                              try { (el as any).showPicker(); } catch { el.focus(); }
                            } else {
                              el.focus();
                            }
                          }}
                          className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-muted-foreground"
                          aria-label="Open calendar"
                        >
                          <Calendar className="w-5 h-5" />
                        </button>
                      </>
                    );
                  })()
                }
              </div>
              {errors?.dob && <p className="text-xs text-red-600 mt-1">{errors.dob.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1">Phone (optional)</label>
              <Input {...register('phone')} placeholder="Phone number" />
              {errors?.phone && <p className="text-xs text-red-600 mt-1">{errors.phone.message}</p>}
            </div>

            <div className="flex justify-end gap-2 mt-4">
              <Button variant="outline" type="button" onClick={() => { setShowAddChild(false); reset(); }} disabled={isSubmitting}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Adding...
                  </>
                ) : (
                  'Add Child'
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Alert Detail Dialog */}
      <Dialog open={showAlertDetail} onOpenChange={setShowAlertDetail}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" />
              Alert Details
            </DialogTitle>
          </DialogHeader>
          {selectedAlert && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Type</label>
                  <p className="font-medium">{selectedAlert.type}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Severity</label>
                  <Badge className={`mt-1 ${severityColors[selectedAlert.severity as keyof typeof severityColors]}`}>
                    {selectedAlert.severity}
                  </Badge>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground">App</label>
                <p className="font-medium">{selectedAlert.appName}</p>
              </div>

              {selectedAlert.details && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Details</label>
                  <div className="mt-1 p-3 bg-muted rounded-lg text-sm">
                    {selectedAlert.details.windowTitle && (
                      <p><strong>Window:</strong> {selectedAlert.details.windowTitle}</p>
                    )}
                    {selectedAlert.details.url && (
                      <p><strong>URL:</strong> {selectedAlert.details.url}</p>
                    )}
                    {selectedAlert.details.badWords && (
                      <p><strong>Detected:</strong> {selectedAlert.details.badWords}</p>
                    )}
                    {selectedAlert.details.raw && (
                      <p>{selectedAlert.details.raw}</p>
                    )}
                  </div>
                </div>
              )}
              
              <div>
                <label className="text-sm font-medium text-muted-foreground">Time Detected</label>
                <p className="font-medium">{new Date(selectedAlert.timestamp).toLocaleString()}</p>
              </div>

              <div className="flex gap-2">
                <Button
                  variant="destructive"
                  className="flex-1"
                  onClick={() => {
                    toast.success('App blocked');
                    setShowAlertDetail(false);
                  }}
                >
                  <Ban className="w-4 h-4 mr-2" />
                  Block App
                </Button>
                <Button
                  variant="default"
                  className="flex-1"
                  onClick={() => handleEscalate(selectedAlert)}
                >
                  <Send className="w-4 h-4 mr-2" />
                  Escalate to Investigator
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}