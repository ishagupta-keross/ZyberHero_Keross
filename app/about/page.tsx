'use client';

import { motion } from 'framer-motion';
import { Shield, Users, Target, Award } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ThemeToggle } from '@/components/ui/theme-toggle';

export default function AboutPage() {
  const leadership = [
    {
      name: 'Dr. Sarah Chen',
      role: 'CEO & Founder',
      image: '/logo.png',
      bio: 'Former cybersecurity expert with 15+ years protecting children online. PhD in Computer Science from MIT.',
    },
    {
      name: 'Michael Rodriguez',
      role: 'CTO',
      image: '/logo.png',
      bio: 'Led engineering teams at major tech companies. Passionate about building safe digital spaces for kids.',
    },
    {
      name: 'Dr. Emily Watson',
      role: 'Chief Safety Officer',
      image: '/logo.png',
      bio: 'Child psychologist and digital safety advocate. Published researcher on online child protection.',
    },
  ];

  const values = [
    {
      icon: Shield,
      title: 'Safety First',
      description: 'Every decision we make prioritizes the safety and wellbeing of children.',
    },
    {
      icon: Users,
      title: 'Family Focused',
      description: 'We empower families to navigate the digital world together with confidence.',
    },
    {
      icon: Target,
      title: 'Innovation',
      description: 'Cutting-edge AI technology to stay ahead of emerging online threats.',
    },
    {
      icon: Award,
      title: 'Trust',
      description: 'Privacy and data security are non-negotiable in everything we build.',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-pink-50 dark:from-gray-950 dark:via-blue-950 dark:to-gray-900">
      <div className="absolute top-4 left-4">
        <Button variant="ghost" asChild>
          <Link href="/">← Back to Home</Link>
        </Button>
      </div>
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>

      <div className="container mx-auto px-4 py-16 max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl font-bold mb-4 gradient-blue-purple bg-clip-text text-transparent neon-text">
            About ZyberHero
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            We're on a mission to create a safer digital world for children and peace of mind for parents.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-20"
        >
          <Card className="gradient-blue-purple text-white">
            <CardContent className="p-12">
              <h2 className="text-3xl font-bold mb-6 text-center">Our Story</h2>
              <p className="text-lg leading-relaxed mb-4">
                ZyberHero was born from a simple yet powerful idea: children deserve to explore the digital world safely, and parents deserve the tools to protect them effectively. Founded in 2024 by a team of cybersecurity experts, child psychologists, and concerned parents, we've built a comprehensive platform that combines cutting-edge technology with compassionate understanding of family dynamics.
              </p>
              <p className="text-lg leading-relaxed">
                Today, we protect thousands of families worldwide, continuously evolving our platform to address emerging threats while maintaining the privacy and trust that families deserve.
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <div className="mb-20">
          <h2 className="text-3xl font-bold text-center mb-12">Our Values</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                >
                  <Card className="h-full hover:shadow-xl transition-shadow neon-glow">
                    <CardContent className="p-6 text-center">
                      <div className="w-16 h-16 mx-auto mb-4 rounded-full gradient-blue-purple flex items-center justify-center">
                        <Icon className="w-8 h-8 text-white" />
                      </div>
                      <h3 className="text-xl font-bold mb-2">{value.title}</h3>
                      <p className="text-muted-foreground">{value.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>

        <div>
          <h2 className="text-3xl font-bold text-center mb-12">Leadership Team</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {leadership.map((leader, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + 0.1 * index }}
              >
                <Card className="hover:shadow-xl transition-shadow">
                  <CardContent className="p-6">
                    <div className="mb-4 relative w-32 h-32 mx-auto rounded-full overflow-hidden gradient-blue-purple p-1">
                      <div className="w-full h-full rounded-full bg-white dark:bg-gray-900 flex items-center justify-center">
                        <div className="relative w-28 h-28">
                          <Image
                            src={leader.image}
                            alt={leader.name}
                            fill
                            className="object-contain"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="text-center">
                      <h3 className="text-xl font-bold mb-1">{leader.name}</h3>
                      <p className="text-primary font-semibold mb-3">{leader.role}</p>
                      <p className="text-sm text-muted-foreground">{leader.bio}</p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-20 text-center"
        >
          <Card className="max-w-3xl mx-auto gradient-blue-purple text-white">
            <CardContent className="p-12">
              <h3 className="text-3xl font-bold mb-4">Join Us in Our Mission</h3>
              <p className="text-lg mb-6">
                Together, we can create a safer digital future for the next generation.
              </p>
              <Button size="lg" variant="secondary" asChild>
                <Link href="/pricing">Start Protecting Your Family</Link>
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
