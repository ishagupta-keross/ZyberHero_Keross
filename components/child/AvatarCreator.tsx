'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface AvatarCreatorProps {
  open: boolean;
  onClose: () => void;
  onAvatarSelect: (avatar: AvatarConfig) => void;
  currentAvatar?: AvatarConfig;
}

export interface AvatarConfig {
  character: string;
  name: string;
  color: string;
  personality: string;
}

const avatarOptions = [
  { character: '🦸‍♂️', name: 'Captain Safe', color: 'from-blue-400 to-blue-600', personality: 'brave' },
  { character: '🦸‍♀️', name: 'Wonder Guard', color: 'from-pink-400 to-pink-600', personality: 'wise' },
  { character: '🐱', name: 'Cyber Cat', color: 'from-orange-400 to-orange-600', personality: 'smart' },
  { character: '🐶', name: 'Safety Pup', color: 'from-yellow-400 to-yellow-600', personality: 'friendly' },
  { character: '🦊', name: 'Foxy Friend', color: 'from-red-400 to-red-600', personality: 'clever' },
  { character: '🦁', name: 'Brave Lion', color: 'from-amber-400 to-amber-600', personality: 'courageous' },
  { character: '🐼', name: 'Panda Pal', color: 'from-gray-400 to-gray-600', personality: 'calm' },
  { character: '🐯', name: 'Tiger Guide', color: 'from-orange-500 to-orange-700', personality: 'strong' },
  { character: '🦄', name: 'Magic Unicorn', color: 'from-purple-400 to-purple-600', personality: 'magical' },
  { character: '🐉', name: 'Dragon Hero', color: 'from-green-400 to-green-600', personality: 'powerful' },
  { character: '🦉', name: 'Wise Owl', color: 'from-indigo-400 to-indigo-600', personality: 'wise' },
  { character: '🐸', name: 'Froggy Friend', color: 'from-lime-400 to-lime-600', personality: 'helpful' },
];

export function AvatarCreator({ open, onClose, onAvatarSelect, currentAvatar }: AvatarCreatorProps) {
  const [selectedAvatar, setSelectedAvatar] = useState<AvatarConfig | null>(currentAvatar || null);
  const [step, setStep] = useState(1);

  const handleSelect = (avatar: AvatarConfig) => {
    setSelectedAvatar(avatar);
  };

  const handleConfirm = () => {
    if (selectedAvatar) {
      onAvatarSelect(selectedAvatar);
      onClose();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl font-child">
            <Sparkles className="w-6 h-6 text-yellow-500" />
            Choose Your Safety Guide!
          </DialogTitle>
          <DialogDescription className="text-base font-child">
            Pick a friend who will help you stay safe online and guide you through your journey!
          </DialogDescription>
        </DialogHeader>

        <div className="py-6">
          <AnimatePresence mode="wait">
            <motion.div
              key="selection"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <div className="grid grid-cols-3 md:grid-cols-4 gap-4 mb-6">
                {avatarOptions.map((avatar, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Card
                      className={`cursor-pointer transition-all ${
                        selectedAvatar?.character === avatar.character
                          ? 'ring-4 ring-primary shadow-xl'
                          : 'hover:shadow-lg'
                      }`}
                      onClick={() => handleSelect(avatar)}
                    >
                      <CardContent className="p-4 text-center relative">
                        {selectedAvatar?.character === avatar.character && (
                          <div className="absolute top-2 right-2">
                            <div className="bg-primary rounded-full p-1">
                              <Check className="w-4 h-4 text-primary-foreground" />
                            </div>
                          </div>
                        )}
                        <div className="text-5xl mb-2">{avatar.character}</div>
                        <div className="text-sm font-semibold font-child">{avatar.name}</div>
                        <div className={`text-xs mt-1 bg-gradient-to-r ${avatar.color} bg-clip-text text-transparent font-semibold`}>
                          {avatar.personality}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>

              {selectedAvatar && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-6"
                >
                  <Card className={`bg-gradient-to-br ${selectedAvatar.color} text-white border-0`}>
                    <CardHeader>
                      <div className="flex items-center gap-4">
                        <div className="text-6xl">{selectedAvatar.character}</div>
                        <div>
                          <CardTitle className="text-white text-2xl font-child">
                            Meet {selectedAvatar.name}!
                          </CardTitle>
                          <CardDescription className="text-white/90 text-base font-child">
                            Your {selectedAvatar.personality} safety guide
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="bg-white/20 backdrop-blur rounded-lg p-4">
                        <p className="text-white font-child">
                          "Hi there! I'm {selectedAvatar.name}, and I'm here to be your friend and keep you safe online.
                          We'll learn together, play fun games, and I'll always be here if you need help!"
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}

              <div className="flex gap-3 justify-end">
                <Button 
                className='"hover:bg-cyan-50 hover:text-cyan-600 dark:hover:bg-cyan-950 dark:hover:text-cyan-400"'
                variant="outline" onClick={onClose}>
                  Cancel
                </Button>
                <Button
                  onClick={handleConfirm}
                  disabled={!selectedAvatar}
                  size="lg"
                  className="font-child"
                >
                  <Check className="w-4 h-4 mr-2" />
                  Choose This Guide!
                </Button>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </DialogContent>
    </Dialog>
  );
}
