"use client"
import { Users, MessageCircle, Heart, Shield, BookOpen, UserCheck } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const mentorFeatures = [
  {
    icon: UserCheck,
    title: "Verified Mentors",
    description: "Background-checked child safety experts, educators, and trained volunteers provide guidance and support.",
    color: "text-blue-600"
  },
  {
    icon: MessageCircle,
    title: "Safe Chat Environment",
    description: "Monitored conversations in a secure platform where children can ask questions and get advice.",
    color: "text-green-600"
  },
  {
    icon: BookOpen,
    title: "Educational Guidance",
    description: "Mentors help children understand digital citizenship, online etiquette, and safety best practices.",
    color: "text-purple-600"
  },
  {
    icon: Heart,
    title: "Emotional Support",
    description: "Trained counselors available to help children process difficult online experiences and build confidence.",
    color: "text-pink-600"
  }
];

const mentorProfiles = [
  {
    name: "Sarah Chen",
    role: "Digital Safety Educator",
    experience: "8 years",
    specialties: ["Cyberbullying", "Social Media Safety"],
    avatar: "👩‍🏫",
    rating: 4.9,
    sessions: 1200
  },
  {
    name: "Mike Rodriguez",
    role: "Child Psychologist",
    experience: "12 years",
    specialties: ["Online Trauma", "Digital Wellness"],
    avatar: "👨‍⚕️",
    rating: 5.0,
    sessions: 850
  },
  {
    name: "Emma Thompson",
    role: "Former Law Enforcement",
    experience: "15 years",
    specialties: ["Online Predators", "Digital Evidence"],
    avatar: "👮‍♀️",
    rating: 4.8,
    sessions: 650
  }
];

export default function MentoringSection() {
  return (
    <section className="py-20 bg-white dark:bg-gray-950 transition-colors duration-300">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div className="text-center space-y-4 mb-16">
      <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white">
        Expert Mentoring & Support
      </h2>
      <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
        Connect your children with verified safety experts, educators, and counselors for personalized guidance and support
      </p>
    </div>

    {/* Mentor Features */}
    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
      {mentorFeatures.map((feature, index) => (
        <Card
          key={index}
          className="border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-lg hover:shadow-xl hover:shadow-cyan-500/20 transition-all duration-300"
        >
          <CardHeader className="text-center pb-4">
            <div
              className={`inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-50 dark:bg-gray-800 mb-4 mx-auto`}
            >
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


       
        {/* <div className="mb-16">
          <h3 className="text-2xl font-bold text-gray-900 text-center mb-8">
            Meet Our Expert Mentors
          </h3>
          <div className="grid lg:grid-cols-3 gap-8">
            {mentorProfiles.map((mentor, index) => (
              <Card key={index} className="border-0 shadow-lg">
                <CardHeader className="text-center">
                  <div className="text-6xl mb-4">{mentor.avatar}</div>
                  <CardTitle className="text-xl font-bold text-gray-900">
                    {mentor.name}
                  </CardTitle>
                  <CardDescription className="text-gray-600">
                    {mentor.role}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Experience</span>
                    <span className="font-medium text-gray-900">{mentor.experience}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Rating</span>
                    <div className="flex items-center">
                      <span className="font-medium text-gray-900 mr-1">{mentor.rating}</span>
                      <div className="flex text-yellow-400">
                        {'★'.repeat(5)}
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Sessions</span>
                    <span className="font-medium text-gray-900">{mentor.sessions.toLocaleString()}+</span>
                  </div>
                  <div className="space-y-2">
                    <div className="text-sm text-gray-600">Specialties:</div>
                    <div className="flex flex-wrap gap-2">
                      {mentor.specialties.map((specialty, idx) => (
                        <span key={idx} className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
                          {specialty}
                        </span>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

       
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-8 lg:p-12 text-white">
          <div className="text-center mb-12">
            <h3 className="text-2xl lg:text-3xl font-bold mb-4">
              How Our Mentoring Works
            </h3>
            <p className="text-blue-100 text-lg max-w-3xl mx-auto">
              A safe, structured approach to connecting children with expert guidance and support
            </p>
          </div>

          <div className="grid lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-white/10 backdrop-blur rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold">1</span>
              </div>
              <h4 className="font-semibold mb-2">Assessment</h4>
              <p className="text-blue-100 text-sm">Child's needs and interests are evaluated to match with appropriate mentors</p>
            </div>
            
            <div className="text-center">
              <div className="bg-white/10 backdrop-blur rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold">2</span>
              </div>
              <h4 className="font-semibold mb-2">Matching</h4>
              <p className="text-blue-100 text-sm">AI-powered system pairs children with verified mentors based on compatibility</p>
            </div>
            
            <div className="text-center">
              <div className="bg-white/10 backdrop-blur rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold">3</span>
              </div>
              <h4 className="font-semibold mb-2">Sessions</h4>
              <p className="text-blue-100 text-sm">Scheduled video calls and chat sessions in monitored, safe environment</p>
            </div>
            
            <div className="text-center">
              <div className="bg-white/10 backdrop-blur rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold">4</span>
              </div>
              <h4 className="font-semibold mb-2">Progress</h4>
              <p className="text-blue-100 text-sm">Regular progress reports shared with parents and continuous support provided</p>
            </div>
          </div>

          <div className="text-center mt-12">
            <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
              <Users className="mr-2 h-5 w-5" />
              Connect with a Mentor
            </Button>
          </div>
        </div> */}
      </div>
    </section>
  );
}