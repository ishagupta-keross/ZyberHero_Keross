'use client';

import { useState } from 'react';
import { XCircle, Ban, RotateCcw, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { baseApiRequest } from '@/app/utils/apiRequests/baseApiRequest';

const API_BASE = 'http://localhost:8060/api';

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

interface ActivityTableProps {
  apps: ActivityApp[];
  isLoading: boolean;
  deviceId?: number;
  onRefresh?: () => void;
}

const getAppIcon = (appName: string): string => {
  const name = appName.toLowerCase();
  if (name.includes('chrome')) return '🌐';
  if (name.includes('edge') || name.includes('msedge')) return '🔷';
  if (name.includes('firefox')) return '🦊';
  if (name.includes('code') || name.includes('vscode')) return '💻';
  if (name.includes('explorer')) return '📁';
  if (name.includes('terminal') || name.includes('cmd') || name.includes('powershell') || name.includes('windowsterminal')) return '⬛';
  if (name.includes('chat') || name.includes('teams') || name.includes('slack')) return '💬';
  if (name.includes('youtube')) return '▶️';
  if (name.includes('spotify') || name.includes('music')) return '🎵';
  if (name.includes('game')) return '🎮';
  return '📱';
};

const formatDuration = (seconds: number): string => {
  if (!seconds || seconds < 60) return `${seconds ?? 0}s`;
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  if (h > 0) return `${h}h ${m}m`;
  return `${m}m`;
};

export function ActivityTable({ apps, isLoading, deviceId, onRefresh }: ActivityTableProps) {
  const [loadingActions, setLoadingActions] = useState<Record<string, string>>({});

  const handleKillApp = async (appName: string) => {
    if (!deviceId) {
      toast.error('No device linked');
      return;
    }
    setLoadingActions(prev => ({ ...prev, [appName]: 'kill' }));
    try {
      const result: any = await baseApiRequest(
        `${API_BASE}/commands/kill`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ deviceId, appName }),
        },
        { isAccessTokenRequird: true }
      );

      // baseApiRequest returns response *data* (usually JSON), not fetch's Response.
      // Success payload from backend is: { success: true }
      if (result?.success === true) {
        console.log('Kill command succeeded:', result);
        toast.success(`Kill command sent for ${appName}`);
      } else {
        const msg =
          result?.error ||
          result?.message ||
          'Failed to send kill command';
        toast.error(msg);
        console.log('Kill command failed:', result);
      }
    } catch {
      toast.error('Failed to send kill command');
    } finally {
      setLoadingActions(prev => ({ ...prev, [appName]: '' }));
    }
  };

  const handleRelaunchApp = async (appName: string) => {
    if (!deviceId) {
      toast.error('No device linked');
      return;
    }
    setLoadingActions(prev => ({ ...prev, [appName]: 'relaunch' }));
    try {
      const result: any = await baseApiRequest(
        `${API_BASE}/commands/relaunch`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ deviceId, appName }),
        },
        { isAccessTokenRequird: true }
      );

      if (result?.success === true) {
        console.log('Relaunch command succeeded:', result);
        toast.success(`Relaunch command sent for ${appName}`);
      } else {
        const msg = result?.error || result?.message || 'Failed to send relaunch command';
        toast.error(msg);
        console.log('Relaunch command failed:', result);
      }
    } catch {
      toast.error('Failed to send relaunch command');
    } finally {
      setLoadingActions(prev => ({ ...prev, [appName]: '' }));
    }
  };

  // const handleBlockApp = async (appName: string) => {
  //   if (!deviceId) {
  //     toast.error('No device linked');
  //     return;
  //   }
  //   setLoadingActions(prev => ({ ...prev, [appName]: 'block' }));
  //   try {
  //     const res = await fetch(`${API_BASE}/commands/kill`, {
  //       method: 'POST',
  //       headers: { 'Content-Type': 'application/json' },
  //       body: JSON.stringify({ deviceId, appName }),
  //     });
  //     if (res.ok) {
  //       toast.success(`Block command sent for ${appName}`);
  //     } else {
  //       toast.error('Failed to send block command');
  //     }
  //   } catch {
  //     toast.error('Failed to send block command');
  //   } finally {
  //     setLoadingActions(prev => ({ ...prev, [appName]: '' }));
  //   }
  // };

  // const handleRelaunchApp = async (appName: string) => {
  //   if (!deviceId) {
  //     toast.error('No device linked');
  //     return;
  //   }
  //   setLoadingActions(prev => ({ ...prev, [appName]: 'relaunch' }));
  //   try {
  //     const res = await fetch(`${API_BASE}/commands/relaunch`, {
  //       method: 'POST',
  //       headers: { 'Content-Type': 'application/json' },
  //       body: JSON.stringify({ deviceId, appName }),
  //     });
  //     if (res.ok) {
  //       toast.success(`Relaunch command sent for ${appName}`);
  //     } else {
  //       toast.error('Failed to send relaunch command');
  //     }
  //   } catch {
  //     toast.error('Failed to send relaunch command');
  //   } finally {
  //     setLoadingActions(prev => ({ ...prev, [appName]: '' }));
  //   }
  // };



  //  const handleKillApp = async (appName: string) => {
  //     if (!selectedChild) return;
  //     const child = childrenList.find(c => c.id === selectedChild.id);
  //     const deviceId = child?.devices?.[0]?.id;
  //     if (!deviceId) {
  //       toast.error('No device linked to this child');
  //       return;
  //     }
  //     try {
  //       const result = await baseApiRequest(`${API_BASE}/commands/kill`, {
  //         method: 'POST',
  //         headers: { 'Content-Type': 'application/json' },
  //         body: JSON.stringify({ deviceId, appName }),
  //       }, { isAccessTokenRequird: true });
  //       if (result && (result as any).status === 'Failure') {
  //         toast.error((result as any).message || 'Failed to send kill command');
  //       } else {
  //         toast.success(`Kill command sent for ${appName}`);
  //       }
  //     } catch (err) {
  //       console.error('Kill command error:', err);
  //       toast.error('Failed to send kill command');
  //     }
  //   };
  
    // const handleRelaunchApp = async (appName: string) => {
    //   if (!selectedChild) return;
    //   const child = childrenList.find(c => c.id === selectedChild.id);
    //   const deviceId = child?.devices?.[0]?.id;
    //   if (!deviceId) {
    //     toast.error('No device linked to this child');
    //     return;
    //   }
    //   try {
    //     const result = await baseApiRequest(`${API_BASE}/commands/relaunch`, {
    //       method: 'POST',
    //       headers: { 'Content-Type': 'application/json' },
    //       body: JSON.stringify({ deviceId, appName }),
    //     }, { isAccessTokenRequird: true });
    //     if (result && (result as any).status === 'Failure') {
    //       toast.error((result as any).message || 'Failed to send relaunch command');
    //     } else {
    //       toast.success(`Relaunch command sent for ${appName}`);
    //     }
    //   } catch (err) {
    //     console.error('Relaunch command error:', err);
    //     toast.error('Failed to send relaunch command');
    //   }
    // };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
        <span className="ml-2 text-muted-foreground">Loading activity data...</span>
      </div>
    );
  }

  if (apps.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No activity data available for today.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="bg-blue-600 text-white">
            <th className="text-left py-3 px-4 font-semibold">App</th>
            <th className="text-center py-3 px-4 font-semibold">Screen Time</th>
            <th className="text-center py-3 px-4 font-semibold">Actions</th>
            <th className="text-center py-3 px-4 font-semibold">Status</th>
          </tr>
        </thead>
        <tbody>
          {apps.map((activity, index) => (
            <tr
              key={`${activity.app}-${index}`}
              className="border-b hover:bg-muted/50 transition-colors"
            >
              <td className="py-4 px-4">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{getAppIcon(activity.app)}</span>
                  <div>
                    <p className="font-semibold text-foreground">{activity.app}</p>
                    <p className="text-sm text-muted-foreground truncate max-w-[300px]">
                      {activity.windowTitle || activity.app}
                    </p>
                  </div>
                </div>
              </td>
              <td className="text-center py-4 px-4">
                <span className="text-orange-500 font-medium">{formatDuration(activity.focusedTimeSeconds + activity.screenTimeSeconds)}</span>
              </td>
              <td className="text-center py-4 px-4">
                <div className="flex items-center justify-center gap-1">
                  <Button
                    size="sm"
                    variant="destructive"
                    className="bg-red-500 hover:bg-red-600 text-white text-xs px-2 py-1 h-7"
                    onClick={() => handleKillApp(activity.app)}
                    disabled={loadingActions[activity.app] === 'kill'}
                  >
                    {loadingActions[activity.app] === 'kill' ? (
                      <Loader2 className="w-3 h-3 animate-spin" />
                    ) : (
                      'Kill'
                    )}
                  </Button>
                  {/* <Button
                    size="sm"
                    variant="default"
                    className="bg-yellow-500 hover:bg-yellow-600 text-white text-xs px-2 py-1 h-7"
                    onClick={() => handleBlockApp(activity.app)}
                    disabled={loadingActions[activity.app] === 'block'}
                  >
                    {loadingActions[activity.app] === 'block' ? (
                      <Loader2 className="w-3 h-3 animate-spin" />
                    ) : (
                      'Block'
                    )}
                  </Button> */}
                  <Button
                    size="sm"
                    variant="default"
                    className="bg-green-500 hover:bg-green-600 text-white text-xs px-2 py-1 h-7"
                    onClick={() => handleRelaunchApp(activity.app)}
                    disabled={loadingActions[activity.app] === 'relaunch'}
                  >
                    {loadingActions[activity.app] === 'relaunch' ? (
                      <Loader2 className="w-3 h-3 animate-spin" />
                    ) : (
                      'Relaunch'
                    )}
                  </Button>
                </div>
              </td>
              <td className="text-center py-4 px-4">
                {activity.isLive ? (
                  <Badge className="bg-green-500 text-white border-green-600 animate-pulse">
                    <span className="inline-block w-2 h-2 bg-white rounded-full mr-1.5 animate-ping"></span>
                    Live
                  </Badge>
                ) : (
                  <Badge variant="secondary" className="bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-400">
                    Offline
                  </Badge>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
