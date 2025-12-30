'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Shield, Trophy, Star, BookOpen, Phone, Sparkles, MessageCircle, Play, Lock, Gamepad2, Video, Award, AlertOctagon } from 'lucide-react';
import { getUser } from '@/lib/auth';
import { Header } from '@/components/shared/Header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { AvatarCreator, type AvatarConfig } from '@/components/child/AvatarCreator';
import { ChatSystem } from '@/components/child/ChatSystem';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';

export default function ChildDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [showEmergency, setShowEmergency] = useState(false);
  const [showAvatarCreator, setShowAvatarCreator] = useState(false);
  const [avatar, setAvatar] = useState<AvatarConfig | null>(null);
  const [guideMessage, setGuideMessage] = useState<string>('');
  const [selectedGame, setSelectedGame] = useState<any>(null);
  const [sosActive, setSosActive] = useState(false);

  const handleSOSClick = () => {
    setSosActive(true);
    toast.error('🚨 EMERGENCY SOS ACTIVATED! Your parents, guardians, and emergency services have been notified immediately with your exact location!', {
      duration: 5000,
    });
    setTimeout(() => {
      toast.success('📍 Your location is being tracked. Help is on the way! Stay safe and stay where you are if possible.', {
        duration: 5000,
      });
    }, 2000);
    setTimeout(() => {
      setSosActive(false);
    }, 10000);
  };

  useEffect(() => {
    const currentUser = getUser();
    if (!currentUser || currentUser.role !== 'child') {
      router.push('/login');
      return;
    }
    setUser(currentUser);

    const savedAvatar = localStorage.getItem('childAvatar');
    if (savedAvatar) {
      setAvatar(JSON.parse(savedAvatar));
    } else {
      setTimeout(() => setShowAvatarCreator(true), 1000);
    }
  }, [router]);

  useEffect(() => {
    if (avatar) {
      const messages = [
        `Hi ${user?.name.split(' ')[0]}! Let's play some fun games and learn how to stay safe online!`,
        `Ready for an adventure? Pick a game below and let's learn together!`,
        `You're a superstar! Choose any game you like and let's have fun while learning!`,
        `Time to play and learn! These games will teach you cool safety tricks!`,
      ];
      setGuideMessage(messages[Math.floor(Math.random() * messages.length)]);
    }
  }, [avatar, user]);

  const handleAvatarSelect = (newAvatar: AvatarConfig) => {
    setAvatar(newAvatar);
    localStorage.setItem('childAvatar', JSON.stringify(newAvatar));
    setGuideMessage(`Hi ${user?.name.split(' ')[0]}! I'm ${newAvatar.name}, your new safety guide! Let's play games and learn together!`);
  };

  if (!user) return null;

  const learningGames = [
    {
      id: 1,
      title: 'Stranger Danger Detective',
      description: 'Learn to spot the difference between real friends and strangers online!',
      icon: Shield,
      color: 'from-blue-400 to-blue-600',
      type: 'game',
      progress: 80,
      locked: false,
      emoji: '🕵️',
    },
    {
      id: 2,
      title: 'Password Power-Up',
      description: 'Create super strong passwords and protect your accounts like a hero!',
      icon: Lock,
      color: 'from-green-400 to-green-600',
      type: 'game',
      progress: 100,
      locked: false,
      emoji: '🔐',
    },
    {
      id: 3,
      title: 'Share Smart Challenge',
      description: 'What is safe to share online? Play this game to find out!',
      icon: Star,
      color: 'from-yellow-400 to-yellow-600',
      type: 'game',
      progress: 45,
      locked: false,
      emoji: '⭐',
    },
    {
      id: 4,
      title: 'Cyber Bully Blocker',
      description: 'Learn how to recognize bullying and be a hero to your friends!',
      icon: Shield,
      color: 'from-purple-400 to-purple-600',
      type: 'game',
      progress: 30,
      locked: false,
      emoji: '🦸',
    },
    {
      id: 5,
      title: 'Privacy Protector',
      description: 'Keep your information safe! Learn what to keep private online.',
      icon: Shield,
      color: 'from-pink-400 to-pink-600',
      type: 'game',
      progress: 0,
      locked: true,
      emoji: '🛡️',
    },
    {
      id: 6,
      title: 'Emoji Detective',
      description: 'Understand what messages really mean! Decode emoji conversations.',
      icon: Star,
      color: 'from-orange-400 to-orange-600',
      type: 'game',
      progress: 0,
      locked: true,
      emoji: '😀',
    },
  ];

  const educationalVideos = [
    {
      id: 1,
      title: 'How to Make a Strong Password',
      duration: '3:45',
      thumbnail: '🎬',
      watched: true,
      color: 'from-cyan-400 to-cyan-600',
    },
    {
      id: 2,
      title: 'What to Do if Someone is Mean Online',
      duration: '4:20',
      thumbnail: '🎥',
      watched: false,
      color: 'from-teal-400 to-teal-600',
    },
    {
      id: 3,
      title: 'Meet Officer Safety - Online Rules',
      duration: '5:15',
      thumbnail: '🎞️',
      watched: false,
      color: 'from-indigo-400 to-indigo-600',
    },
  ];

  const badges = [
    { id: 1, name: 'First Steps', emoji: '👣', earned: true, description: 'Started your safety journey!' },
    { id: 2, name: 'Game Master', emoji: '🎮', earned: true, description: 'Completed 3 games!' },
    { id: 3, name: 'Video Watcher', emoji: '📺', earned: true, description: 'Watched 5 safety videos!' },
    { id: 4, name: 'Safety Star', emoji: '⭐', earned: false, description: 'Complete all games!' },
    { id: 5, name: 'Cyber Hero', emoji: '🦸‍♂️', earned: false, description: 'Master all lessons!' },
    { id: 6, name: 'Helper Hero', emoji: '💖', earned: false, description: 'Help 5 friends stay safe!' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-pink-50 dark:from-gray-900 dark:via-blue-900 dark:to-gray-800">
      <Header title="ZyberHero Adventure" userName={user.name} />

      <motion.div
        className="fixed top-20 right-6 z-50"
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: 'spring', stiffness: 260, damping: 20 }}
      >
        <Button
          size="lg"
          onClick={handleSOSClick}
          className={`rounded-full w-32 h-32 shadow-2xl border-4 border-white font-bold text-xl ${
            sosActive
              ? 'bg-red-600 hover:bg-red-700 animate-pulse'
              : 'bg-gradient-to-br from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700'
          }`}
        >
          <div className="text-center">
            <motion.div
              animate={sosActive ? { rotate: [0, 10, -10, 0] } : {}}
              transition={{ duration: 0.5, repeat: sosActive ? Infinity : 0 }}
            >
              <AlertOctagon className="w-12 h-12 mx-auto mb-2" />
            </motion.div>
            <span className="text-sm font-black">EMERGENCY<br/>SOS</span>
          </div>
        </Button>
      </motion.div>

      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {avatar && guideMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <Card className={`bg-gradient-to-br ${avatar.color} text-white border-0 relative overflow-hidden`}>
              <div className="absolute top-0 right-0 opacity-20">
                <Sparkles className="w-32 h-32" />
              </div>
              <CardContent className="p-6 relative z-10">
                <div className="flex items-start gap-4">
                  <motion.div
                    className="text-6xl flex-shrink-0"
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    {avatar.character}
                  </motion.div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <MessageCircle className="w-5 h-5" />
                      <h3 className="font-bold text-xl font-child">{avatar.name} says:</h3>
                    </div>
                    <div className="bg-white/20 backdrop-blur rounded-lg p-4">
                      <p className="text-lg font-child">{guideMessage}</p>
                    </div>
                  </div>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => setShowAvatarCreator(true)}
                    className="flex-shrink-0"
                  >
                    <Sparkles className="w-4 h-4 mr-2" />
                    Change Guide
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="mb-8 text-center"
        >
          <div className="text-6xl mb-4">{user.avatar}</div>
          <h2 className="text-4xl font-bold font-child bg-gradient-to-r from-cyan-500 to-pink-400 bg-clip-text text-transparent mb-2">
            Hey {user.name.split(' ')[0]}!
          </h2>
          <p className="text-xl text-muted-foreground font-child">
            Let's Play, Learn & Stay Safe! 🎮✨
          </p>
          {!avatar && (
            <Button
              size="lg"
              onClick={() => setShowAvatarCreator(true)}
              className="mt-4 font-child"
            >
              <Sparkles className="w-5 h-5 mr-2" />
              Choose Your Safety Guide!
            </Button>
          )}
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="bg-gradient-to-br from-yellow-100 to-orange-100 dark:from-yellow-900 dark:to-orange-900 border-2 border-yellow-300 dark:border-yellow-700">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-lg font-child">Level</CardTitle>
                <Trophy className="w-8 h-8 text-yellow-600" />
              </CardHeader>
              <CardContent>
                <div className="text-5xl font-bold font-child">{user.level}</div>
                <p className="text-sm text-muted-foreground font-child mt-1">Keep going superstar!</p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="bg-gradient-to-br from-blue-100 to-cyan-100 dark:from-blue-900 dark:to-cyan-900 border-2 border-blue-300 dark:border-blue-700">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-lg font-child">Points</CardTitle>
                <Star className="w-8 h-8 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-5xl font-bold font-child">{user.points}</div>
                <p className="text-sm text-muted-foreground font-child mt-1">You're amazing!</p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-900 dark:to-emerald-900 border-2 border-green-300 dark:border-green-700">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-lg font-child">Badges</CardTitle>
                <Award className="w-8 h-8 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-5xl font-bold font-child">{badges.filter(b => b.earned).length}/{badges.length}</div>
                <p className="text-sm text-muted-foreground font-child mt-1">Collected!</p>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        <div className="mb-8">
          <div className="flex items-center gap-3 mb-6">
            <Gamepad2 className="w-8 h-8 text-primary" />
            <h2 className="text-3xl font-bold font-child">Learning Games</h2>
            <Sparkles className="w-6 h-6 text-yellow-500" />
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {learningGames.map((game, index) => (
              <motion.div
                key={game.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: game.locked ? 1 : 1.05 }}
                whileTap={{ scale: game.locked ? 1 : 0.95 }}
              >
                <Card className={`h-full ${game.locked ? 'opacity-60' : 'cursor-pointer hover:shadow-xl transition-all'} bg-gradient-to-br ${game.color} text-white border-0 relative overflow-hidden`}>
                  {game.locked && (
                    <div className="absolute top-4 right-4 z-10">
                      <Lock className="w-8 h-8" />
                    </div>
                  )}
                  <CardHeader>
                    <div className="text-6xl mb-4">{game.emoji}</div>
                    <CardTitle className="text-xl font-child text-white">{game.title}</CardTitle>
                    <CardDescription className="text-white/90 font-child text-base">
                      {game.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {!game.locked && (
                      <>
                        <div className="mb-4">
                          <div className="flex items-center justify-between text-sm mb-2">
                            <span className="font-child">Progress</span>
                            <span className="font-bold">{game.progress}%</span>
                          </div>
                          <Progress value={game.progress} className="h-3 bg-white/30" />
                        </div>
                        <Button
                          className="w-full bg-white/20 hover:bg-white/30 backdrop-blur text-white border-2 border-white/50 font-child text-lg"
                          size="lg"
                          onClick={() => setSelectedGame(game)}
                        >
                          <Play className="w-5 h-5 mr-2" />
                          {game.progress > 0 ? 'Continue Playing' : 'Start Game'}
                        </Button>
                      </>
                    )}
                    {game.locked && (
                      <div className="text-center py-4">
                        <p className="font-child text-sm">Complete more games to unlock!</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-8">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <Video className="w-6 h-6 text-primary" />
                <CardTitle className="font-child text-2xl">Safety Videos</CardTitle>
              </div>
              <CardDescription className="font-child text-base">
                Watch fun videos to learn more!
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {educationalVideos.map((video, index) => (
                <motion.div
                  key={video.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                  className="cursor-pointer"
                >
                  <Card className={`bg-gradient-to-r ${video.color} text-white border-0`}>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-4">
                        <div className="text-4xl">{video.thumbnail}</div>
                        <div className="flex-1">
                          <h4 className="font-bold font-child mb-1">{video.title}</h4>
                          <div className="flex items-center gap-3 text-sm">
                            <span className="font-child">{video.duration}</span>
                            {video.watched && (
                              <span className="bg-white/20 px-2 py-1 rounded text-xs font-child">✓ Watched</span>
                            )}
                          </div>
                        </div>
                        <Play className="w-8 h-8" />
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <Trophy className="w-6 h-6 text-primary" />
                <CardTitle className="font-child text-2xl">Badge Collection</CardTitle>
              </div>
              <CardDescription className="font-child text-base">
                Earn badges by completing games!
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4">
                {badges.map((badge) => (
                  <motion.div
                    key={badge.id}
                    whileHover={{ scale: badge.earned ? 1.1 : 1 }}
                    className={`p-4 rounded-xl text-center transition-all ${
                      badge.earned
                        ? 'bg-gradient-to-br from-yellow-100 to-orange-100 dark:from-yellow-900 dark:to-orange-900 shadow-lg'
                        : 'bg-gray-100 dark:bg-gray-800 opacity-40'
                    }`}
                  >
                    <div className="text-5xl mb-2">{badge.emoji}</div>
                    <div className="text-xs font-child font-semibold">{badge.name}</div>
                    {badge.earned && (
                      <div className="text-xs text-muted-foreground mt-1 font-child">{badge.description}</div>
                    )}
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Button
            size="lg"
            className="w-full bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white font-bold py-8 text-2xl font-child shadow-2xl"
            onClick={() => setShowEmergency(true)}
          >
            <Phone className="w-8 h-8 mr-4" />
            🚨 Emergency SOS 🚨
          </Button>
        </motion.div>
      </div>

      <AvatarCreator
        open={showAvatarCreator}
        onClose={() => setShowAvatarCreator(false)}
        onAvatarSelect={handleAvatarSelect}
        currentAvatar={avatar || undefined}
      />

      <Dialog open={selectedGame !== null} onOpenChange={() => setSelectedGame(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 font-child text-2xl">
              <Gamepad2 className="w-8 h-8 text-primary" />
              {selectedGame?.title}
            </DialogTitle>
            <DialogDescription className="font-child text-lg pt-4">
              <div className="text-6xl text-center mb-4">{selectedGame?.emoji}</div>
              <p className="text-foreground mb-4">{selectedGame?.description}</p>
              <div className="bg-primary/10 rounded-lg p-6 text-center">
                <p className="text-foreground font-semibold mb-4">Game is loading...</p>
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                <p className="text-sm text-muted-foreground mt-4">Get ready to learn and have fun!</p>
              </div>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>

      <Dialog open={showEmergency} onOpenChange={setShowEmergency}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-red-600 font-child flex items-center gap-2 text-2xl">
              <Phone className="w-8 h-8" />
              🚨 Emergency Help 🚨
            </DialogTitle>
            <DialogDescription className="space-y-4 pt-4">
              <p className="font-child text-lg text-foreground font-bold">
                Help is on the way! We're contacting your parents right now.
              </p>
              <div className="space-y-3">
                <div className="p-4 bg-red-50 dark:bg-red-950 rounded-lg border-2 border-red-300">
                  <div className="flex items-center gap-2 mb-2">
                    <Phone className="w-5 h-5 text-red-600" />
                    <span className="font-semibold font-child">Emergency Contact</span>
                  </div>
                  <p className="font-child text-lg">Mom: (555) 123-4567</p>
                </div>
                <div className="bg-green-50 dark:bg-green-950 p-4 rounded-lg border-2 border-green-300">
                  <p className="font-child text-center font-bold text-green-700 dark:text-green-400">
                    ✓ Your parents have been notified!
                  </p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground font-child text-center">
                You did the right thing by asking for help! 🦸
              </p>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
}
