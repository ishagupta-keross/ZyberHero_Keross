'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Video, Play, Volume2, AlertTriangle, Flag, Check, Eye } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';

export function MediaMonitoring() {
  const videos = [
    { id: 1, title: 'YouTube - DIY Crafts Tutorial', duration: '10:25', timestamp: '2 hours ago', safe: true, platform: 'YouTube', thumbnail: '🎨' },
    { id: 2, title: 'TikTok - Dance Challenge', duration: '0:30', timestamp: '3 hours ago', safe: true, platform: 'TikTok', thumbnail: '💃' },
    { id: 3, title: 'Instagram Reel - Recipe Video', duration: '1:15', timestamp: '5 hours ago', safe: true, platform: 'Instagram', thumbnail: '🍪' },
    { id: 4, title: 'YouTube - Gaming Stream', duration: '45:00', timestamp: '1 day ago', safe: true, platform: 'YouTube', thumbnail: '🎮' },
  ];

  const audio = [
    { id: 1, title: 'Music - Pop Playlist', duration: '3:45', timestamp: '1 hour ago', safe: true, platform: 'Spotify', thumbnail: '🎵' },
    { id: 2, title: 'Podcast - Kids Science Show', duration: '25:00', timestamp: '2 hours ago', safe: true, platform: 'Podcast', thumbnail: '🔬' },
    { id: 3, title: 'Audiobook - Adventure Story', duration: '15:30', timestamp: '4 hours ago', safe: true, platform: 'Audible', thumbnail: '📚' },
  ];

  const flaggedContent = [
    {
      id: 1,
      type: 'Video',
      title: 'Inappropriate Content Detected',
      reason: 'Contains mature themes and language',
      platform: 'YouTube',
      duration: '5:30',
      timestamp: '30 minutes ago',
      severity: 'high',
      blocked: true,
      thumbnail: '⚠️'
    },
    {
      id: 2,
      type: 'Audio',
      title: 'Explicit Song Lyrics',
      reason: 'Contains profanity and adult themes',
      platform: 'Spotify',
      duration: '3:15',
      timestamp: '2 hours ago',
      severity: 'medium',
      blocked: true,
      thumbnail: '🎵'
    },
  ];

  const handleReview = (id: number, approved: boolean) => {
    toast.success(approved ? 'Content approved' : 'Content blocked');
  };

  return (
    <Tabs defaultValue="videos" className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="videos">Videos Watched</TabsTrigger>
        <TabsTrigger value="audio">Audio Played</TabsTrigger>
        <TabsTrigger value="flagged">
          Flagged Content
          <Badge variant="destructive" className="ml-2">{flaggedContent.length}</Badge>
        </TabsTrigger>
      </TabsList>

      <TabsContent value="videos" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Video className="w-5 h-5" />
              Videos Watched
            </CardTitle>
            <CardDescription>All videos your child has watched recently</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {videos.map((video, index) => (
                <motion.div
                  key={video.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-4 border rounded-lg hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-pink-100 dark:from-purple-900 dark:to-blue-900 rounded-lg flex items-center justify-center text-4xl">
                      {video.thumbnail}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h4 className="font-semibold">{video.title}</h4>
                          <p className="text-sm text-muted-foreground">{video.platform} • {video.duration}</p>
                        </div>
                        {video.safe ? (
                          <Badge className="bg-green-100 text-green-800">
                            <Check className="w-3 h-3 mr-1" />
                            Safe
                          </Badge>
                        ) : (
                          <Badge variant="destructive">Flagged</Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mb-3">{video.timestamp}</p>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          <Play className="w-3 h-3 mr-2" />
                          Watch
                        </Button>
                        <Button size="sm" variant="outline">
                          <Eye className="w-3 h-3 mr-2" />
                          View Details
                        </Button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="audio" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Volume2 className="w-5 h-5" />
              Audio Played
            </CardTitle>
            <CardDescription>All audio content your child has listened to</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {audio.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-4 border rounded-lg hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-20 h-20 bg-gradient-to-br from-cyan-100 to-pink-100 dark:from-blue-900 dark:to-purple-900 rounded-lg flex items-center justify-center text-4xl">
                      {item.thumbnail}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h4 className="font-semibold">{item.title}</h4>
                          <p className="text-sm text-muted-foreground">{item.platform} • {item.duration}</p>
                        </div>
                        <Badge className="bg-green-100 text-green-800">
                          <Check className="w-3 h-3 mr-1" />
                          Safe
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mb-3">{item.timestamp}</p>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          <Play className="w-3 h-3 mr-2" />
                          Listen
                        </Button>
                        <Button size="sm" variant="outline">
                          <Eye className="w-3 h-3 mr-2" />
                          View Details
                        </Button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="flagged" className="space-y-4">
        <Card className="border-red-200 dark:border-red-900">
          <CardHeader className="bg-red-50 dark:bg-red-950/30">
            <CardTitle className="flex items-center gap-2 text-red-700 dark:text-red-400">
              <AlertTriangle className="w-5 h-5" />
              Flagged Content
            </CardTitle>
            <CardDescription>Content that was flagged as inappropriate</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-4">
              {flaggedContent.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-4 border-2 border-red-200 dark:border-red-900 rounded-lg bg-red-50/50 dark:bg-red-950/20"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-20 h-20 bg-red-100 dark:bg-red-900 rounded-lg flex items-center justify-center text-4xl blur-sm">
                      {item.thumbnail}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h4 className="font-semibold">{item.title}</h4>
                          <p className="text-sm text-muted-foreground">{item.platform} • {item.duration}</p>
                        </div>
                        <Badge variant="destructive" className="text-lg px-3 py-1">
                          {item.severity}
                        </Badge>
                      </div>
                      <div className="bg-white dark:bg-gray-900 p-3 rounded-lg mb-3">
                        <p className="text-sm"><strong>Reason:</strong> {item.reason}</p>
                        <p className="text-xs text-muted-foreground mt-1">Blocked {item.timestamp}</p>
                      </div>
                      {item.blocked ? (
                        <Badge className="bg-red-600 text-white">
                          <Flag className="w-3 h-3 mr-1" />
                          Blocked
                        </Badge>
                      ) : (
                        <div className="flex gap-2">
                          <Button size="sm" variant="destructive" onClick={() => handleReview(item.id, false)}>
                            <Flag className="w-3 h-3 mr-2" />
                            Keep Blocked
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => handleReview(item.id, true)}>
                            <Check className="w-3 h-3 mr-2" />
                            Approve
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
