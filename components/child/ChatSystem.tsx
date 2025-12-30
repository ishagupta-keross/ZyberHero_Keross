'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, Send, Users, Search, Phone, Video, MoreVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Avatar } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';

interface ChatSystemProps {
  childName: string;
}

export function ChatSystem({ childName }: ChatSystemProps) {
  const [selectedFriend, setSelectedFriend] = useState<any>(null);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<any[]>([]);

  const friends = [
    { id: 1, name: 'Alex Johnson', avatar: '👦', status: 'online', distance: '0.3 miles away', lastMessage: 'Want to play?' },
    { id: 2, name: 'Sophie Miller', avatar: '👧', status: 'online', distance: '0.5 miles away', lastMessage: 'See you tomorrow!' },
    { id: 3, name: 'Max Cooper', avatar: '🧒', status: 'offline', distance: '1.2 miles away', lastMessage: 'That was fun!' },
    { id: 4, name: 'Emma Davis', avatar: '👧', status: 'online', distance: '0.8 miles away', lastMessage: 'Thanks!' },
  ];

  const chatMessages = [
    { id: 1, sender: 'them', text: 'Hey! Want to play a game together?', time: '10:30 AM', safe: true },
    { id: 2, sender: 'me', text: 'Yes! Which game?', time: '10:32 AM', safe: true },
    { id: 3, sender: 'them', text: 'How about Password Power-Up?', time: '10:33 AM', safe: true },
    { id: 4, sender: 'me', text: 'Perfect! Let me finish my homework first', time: '10:35 AM', safe: true },
  ];

  const handleSendMessage = () => {
    if (message.trim()) {
      setMessages([...messages, { id: Date.now(), sender: 'me', text: message, time: new Date().toLocaleTimeString(), safe: true }]);
      setMessage('');
    }
  };

  return (
    <div className="grid md:grid-cols-3 gap-4 h-[600px]">
      <Card className="md:col-span-1">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 font-child">
            <Users className="w-5 h-5" />
            Friends Nearby
          </CardTitle>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input placeholder="Search friends..." className="pl-9" />
          </div>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[450px]">
            <div className="space-y-2">
              {friends.map((friend) => (
                <motion.div
                  key={friend.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`p-3 rounded-lg cursor-pointer transition-colors ${
                    selectedFriend?.id === friend.id
                      ? 'bg-primary/10 border-2 border-primary'
                      : 'bg-muted/50 hover:bg-muted'
                  }`}
                  onClick={() => setSelectedFriend(friend)}
                >
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className="text-3xl">{friend.avatar}</div>
                      {friend.status === 'online' && (
                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-sm truncate font-child">{friend.name}</div>
                      <div className="text-xs text-muted-foreground truncate">{friend.lastMessage}</div>
                      <div className="text-xs text-muted-foreground">{friend.distance}</div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      <Card className="md:col-span-2">
        {selectedFriend ? (
          <>
            <CardHeader className="border-b">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="text-4xl">{selectedFriend.avatar}</div>
                  <div>
                    <CardTitle className="font-child">{selectedFriend.name}</CardTitle>
                    <p className="text-sm text-muted-foreground">{selectedFriend.distance}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button size="icon" variant="ghost">
                    <Phone className="w-4 h-4" />
                  </Button>
                  <Button size="icon" variant="ghost">
                    <Video className="w-4 h-4" />
                  </Button>
                  <Button size="icon" variant="ghost">
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <ScrollArea className="h-[400px] p-4">
                <div className="space-y-4">
                  {chatMessages.map((msg) => (
                    <motion.div
                      key={msg.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[70%] rounded-lg p-3 ${
                          msg.sender === 'me'
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted'
                        }`}
                      >
                        <p className="text-sm font-child">{msg.text}</p>
                        <p className="text-xs opacity-70 mt-1">{msg.time}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </ScrollArea>
              <div className="border-t p-4">
                <div className="flex gap-2">
                  <Input
                    placeholder="Type a safe message..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    className="flex-1"
                  />
                  <Button onClick={handleSendMessage} className="gradient-blue-purple text-white">
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground mt-2 font-child">
                  🛡️ All messages are monitored for your safety
                </p>
              </div>
            </CardContent>
          </>
        ) : (
          <CardContent className="h-full flex items-center justify-center">
            <div className="text-center">
              <MessageCircle className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="font-semibold font-child mb-2">Select a Friend to Chat</h3>
              <p className="text-sm text-muted-foreground font-child">
                Choose a friend from the list to start chatting safely!
              </p>
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  );
}
