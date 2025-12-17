"use client"
import { Trophy, Star, Target, Gift, Users, BookOpen } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

const gamificationFeatures = [
  {
    icon: Trophy,
    title: "Safety Achievements",
    description: "Children earn badges and trophies for making smart digital choices and completing safety lessons.",
    color: "text-yellow-600"
  },
  {
    icon: Star,
    title: "Learning Streaks",
    description: "Build daily learning streaks by completing interactive safety modules and quizzes.",
    color: "text-purple-600"
  },
  {
    icon: Target,
    title: "Safety Challenges",
    description: "Weekly challenges that teach children about online safety through fun, age-appropriate activities.",
    color: "text-green-600"
  },
  {
    icon: Gift,
    title: "Reward System",
    description: "Earn points for safe behavior that can be redeemed for real-world rewards approved by parents.",
    color: "text-blue-600"
  }
];

export default function GamificationSection() {
  return (
   <section className="py-20 bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 dark:bg-gray-950 dark:bg-none transition-colors duration-300">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    {/* Section Header */}
    <div className="text-center space-y-4 mb-16">
      <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white">
        Learning Through Play
      </h2>
      <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
        Transform digital safety education into an engaging adventure with gamification, mentoring, and interactive learning
      </p>
    </div>

    {/* Gamification Features */}
    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
      {gamificationFeatures.map((feature, index) => (
        <Card
          key={index}
          className="border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-lg hover:shadow-xl hover:shadow-cyan-500/20 transition-all duration-300"
        >
          <CardHeader className="text-center pb-4">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-50 dark:bg-gray-800 mb-4 mx-auto">
              <feature.icon className={`h-8 w-8 ${feature.color}`} />
            </div>
            <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">
              {feature.title}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription className="text-gray-600 dark:text-gray-400 text-center leading-relaxed">
              {feature.description}
            </CardDescription>
          </CardContent>
        </Card>
      ))}
    </div>

    {/* Interactive Learning Dashboard Preview */}
    <div className="grid lg:grid-cols-2 gap-12 items-center">
      <div className="space-y-6">
        <h3 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white">
          Interactive Safety Education
        </h3>
        <p className="text-gray-600 dark:text-gray-400 text-lg leading-relaxed">
          Our gamified learning platform makes digital safety education fun and memorable. Children progress through 
          age-appropriate lessons, earn rewards, and build lasting safety habits through interactive experiences.
        </p>

        {/* Progress Bars */}
        <div className="space-y-4">
          {[
            { title: "Digital Citizenship Course", progress: "8/12 lessons", bar: "w-2/3" },
            { title: "Stranger Danger Online", progress: "5/8 lessons", bar: "w-3/5" },
            { title: "Password Security", progress: "3/5 lessons", bar: "w-3/5" },
          ].map((item, i) => (
            <div key={i}>
              <div className="flex items-center justify-between mb-1">
                <span className="font-medium text-gray-800 dark:text-gray-200">{item.title}</span>
                <span className="text-sm text-gray-500 dark:text-gray-500">{item.progress}</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-800 rounded-full h-2">
                <div className={`bg-gradient-to-r from-cyan-400 to-blue-500 h-2 rounded-full ${item.bar}`}></div>
              </div>
            </div>
          ))}
        </div>

        {/* Badges */}
        <div className="flex flex-wrap gap-3 pt-4">
          {[
            { color: "bg-yellow-100 text-yellow-800 border border-yellow-400/30 dark:bg-gray-900/80 dark:text-white", label: "Safety Champion", icon: Trophy },
            { color: "bg-purple-100 text-purple-800 border border-purple-400/30 dark:bg-gray-900/80 dark:text-white", label: "7-Day Streak", icon: Star },
            { color: "bg-green-100 text-green-800 border border-green-400/30 dark:bg-gray-900/80 dark:text-white", label: "Quiz Master", icon: Target },
          ].map((badge, i) => (
            <div key={i} className={`px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1 ${badge.color}`}>
              <badge.icon className="h-4 w-4" />
              {badge.label}
            </div>
          ))}
        </div>
      </div>

      {/* Right Panel */}
      <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl shadow-2xl p-8 text-gray-900 dark:text-white hover:shadow-cyan-500/20 hover:-translate-y-1 transition-all duration-300">
        <div className="space-y-6">
          <div className="text-center">
            <div className="text-6xl mb-4">🎮</div>
            <h4 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">
              Safety Adventure Game
            </h4>
            <p className="text-gray-600 dark:text-gray-400">Level 12 - Cyber Detective</p>
          </div>

          <div className="space-y-4">
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-4 text-white">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium">Current Mission</span>
                <span className="text-sm opacity-90">2/3 Complete</span>
              </div>
              <p className="text-sm opacity-90">Identify suspicious messages in your inbox</p>
              <div className="w-full bg-white/20 rounded-full h-2 mt-3">
                <div className="bg-white h-2 rounded-full w-2/3"></div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="bg-yellow-50 dark:bg-gray-800 rounded-lg p-3">
                <div className="text-2xl mb-1">🏆</div>
                <div className="text-sm font-medium text-cyan-400">15</div>
                <div className="text-xs text-gray-700 dark:text-gray-400">Badges</div>
              </div>
              <div className="bg-blue-50 dark:bg-gray-800 rounded-lg p-3">
                <div className="text-2xl mb-1">⭐</div>
                <div className="text-sm font-medium text-cyan-400">2,450</div>
                <div className="text-xs text-gray-700 dark:text-gray-400">Points</div>
              </div>
              <div className="bg-green-50 dark:bg-gray-800 rounded-lg p-3">
                <div className="text-2xl mb-1">🎯</div>
                <div className="text-sm font-medium text-cyan-400">Level 12</div>
                <div className="text-xs text-gray-700 dark:text-gray-400">Rank</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

  );
}