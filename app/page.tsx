
"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import PricingPlans from "@/components/shared/pricing";
import CountdownTimer from "@/components/shared/CountdownTimer";
import MentoringSection from "@/components/shared/MentoringSection";
import GamificationSection from "@/components/shared/GamificationSection";
import ReserveSpotForm from "@/components/shared/ReserveSpotForm";
import EnterpriseInfo from "@/components/shared/EnterpriseInfo";
import AccessibilityFeatures from "@/components/shared/AccessibilityFeatures";
import ContactSupport from "@/components/shared/ContactSupport";

import {
  Shield,
  Search,
  AlertTriangle,
  Smartphone,
  Star,
  Check,
  Lock,
  Zap,
  Users,
  Award,
  ArrowRight,
  Trophy, Target,
  Gift,
  Heart,
  Calendar

} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import PreLaunchListForm from "@/components/shared/PreLaunchListForm";

export default function LandingPage() {
  const features = [
    {
      icon: Search,
      title: "Real-Time Monitoring",
      description:
        "Advanced AI-powered monitoring watches over all digital interactions in real-time.",
    },
    {
      icon: AlertTriangle,
      title: "AI Threat Detection",
      description:
        "Intelligent algorithms detect potential threats, predators, and dangerous content automatically.",
    },
    {
      icon: Smartphone,
      title: "Multi-Platform Protection",
      description:
        "Comprehensive coverage across all devices, apps, and social media platforms.",
    },
    {
      icon: Shield,
      title: "Instant Alerts",
      description:
        "Immediate notifications when concerning behavior or content is detected.",
    },
    {
      icon: Users,
      title: "School Safety",
      description:
        "Specialized monitoring for educational institutions and school networks.",
    },
    {
      icon: Award,
      title: "CyberSafe One",
      description:
        "Premium protection with advanced threat intelligence and priority support.",
    },
  ];

  const stats = [
    { value: "50,000+", label: "Children Protected" },
    { value: "99.9%", label: "Threat Detection Rate" },
    { value: "24/7", label: "Real-Time Monitoring" },
    { value: "4.9/5", label: "Parent Rating" },
  ];

  // const plans = [
  //   {
  //     name: "Family Basic",
  //     description: " Perfect for families with 1-2 children",
  //     price: "$9.99",
  //     period: "/month",
  //     features: [
  //       "Monitor up to 2 devices",
  //       "Real-time threat detection",
  //       "Basic AI analysis",
  //       "Parent dashboard",
  //       "Email alerts",
  //       "24/7 monitoring",
  //     ],
  //   },
  //   {
  //     name: " Family Pro",
  //     description: "Comprehensive protection for larger families",
  //     price: "$19.99",
  //     period: "/month",
  //     popular: true,
  //     features: [
  //       "Monitor up to 5 devices",
  //       "Advanced AI threat detection",
  //       "Behavioral pattern analysis",
  //       "Instant push notifications",
  //       "Detailed reporting",
  //       "Priority support",
  //       "Evidence collection",
  //       "Multi-platform coverage",
  //     ],
  //   },
  //   {
  //     name: "Enterprise",
  //     description: "For schools, organizations, and law enforcement",
  //     price: "Custom ",
  //     period: "pricing",
  //     features: [
  //       "Unlimited devices",
  //       "Investigator portal access",
  //       "Advanced case management",
  //       "Chain of custody documentation",
  //       "Custom integrations",
  //       "Dedicated support",
  //       "Training and onboarding",
  //       "Compliance reporting",
  //     ],
  //   },
  // ];

  // const testimonials = [
  //   {
  //     quote:
  //       "ZyberHero gave me peace of mind. I can finally sleep at night knowing my children are safe online.",
  //     author: "Sarah M.",
  //     role: "Parent of two",
  //     rating: 5,
  //   },
  //   {
  //     quote:
  //       "The real-time alerts are incredible. We discovered an online predator trying to contact our daughter.",
  //     author: "Patricia and James, Washington",
  //     role: "Parents",
  //     rating: 5,
  //   },
  //   {
  //     quote:
  //       "I recommend ZyberHero to all parents. The interface is intuitive and the protection is comprehensive.",
  //     author: "Dr. Emily Chen",
  //     role: "Child Psychologist",
  //     rating: 5,
  //   },
  // ];

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      <header className="border-b border-gray-200 dark:border-gray-800 sticky top-0 z-50 bg-white/95 dark:bg-gray-950/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:supports-[backdrop-filter]:bg-gray-950/60">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative w-12 h-12">
              <Image
                src="/zyber-logo.png"
                alt="ZyberHero"
                fill
                className="object-contain"
              />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold text-gray-900 dark:text-white">ZyberHero</span>
              <span className="text-xs text-gray-600 dark:text-gray-400">
                Innocence Deserves Protection
              </span>
            </div>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <Link
              href="#about"
              className="text-sm text-gray-700 dark:text-gray-300 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors"
            >
              About Us
            </Link>
            <Link
              href="#features"
              className="text-sm text-gray-700 dark:text-gray-300 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors"
            >
              Features
            </Link>
            <Link
              href="#how-it-works"
              className="text-sm text-gray-700 dark:text-gray-300 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors"
            >
              How It Works
            </Link>
            <Link
              href="#founding-team"
              className="text-sm text-gray-700 dark:text-gray-300 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors"
            >
              Team
            </Link>
            <Link
              href="#pricing"
              className="text-sm text-gray-700 dark:text-gray-300 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors"
            >
              Pricing
            </Link>
            <Link
              href="#contact"
              className="text-sm text-gray-700 dark:text-gray-300 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors"
            >
              Contact
            </Link>
          </nav>
          <div className="flex items-center gap-2">

            <Button
              variant="ghost"
              className="text-gray-700 dark:text-gray-300 hover:text-cyan-600 dark:hover:text-cyan-400 hover:bg-cyan-500/10 transition-colors"
              asChild
            >
              <Link href="/login">Login</Link>
            </Button>
            <Button
              className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white hover:shadow-2xl hover:shadow-cyan-500/70 transition-all"
              asChild
            >
              <Link href="/pricing">Register</Link>
            </Button>
            <ThemeToggle />
          </div>
        </div>
      </header>
      <section className="relative z-0 overflow-hidden py-10 md:py-32">
        {/* Dark mode background */}
        <div className="hidden dark:block absolute inset-0 bg-gray-950 z-0"></div>

        {/* Light mode gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-indigo-700 to-purple-800 dark:hidden z-0"></div>

        {/* Radial overlays for light mode */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.15),transparent_50%),radial-gradient(circle_at_80%_80%,rgba(255,255,255,0.15),transparent_50%)] dark:hidden z-10"></div>
        <div className="absolute inset-0 bg-grid-cyan-500/[0.05] bg-[size:20px_20px] dark:hidden z-10"></div>

        <div className="container mx-auto px-4 relative z-20">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-block px-4 py-2 rounded-full text-sm font-semibold mb-6 border
                        bg-white/20 text-white border-white/30 dark:bg-gray-800/50 dark:text-white dark:border-cyan-500/30">
                🛡️ Trusted by 50,000+ Families
              </div>

              <h1 className="text-4xl lg:text-6xl text-white font-bold leading-tight mb-6">
                Your Child's
                <br></br>
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-orange-400 to-pink-400 dark:text-white dark:bg-none dark:inline dark:text-gray-50">
                  Digital Guardian
                </span>
              </h1>

              <p className="text-xl md:text-2xl mb-8 text-white dark:text-gray-400 leading-relaxed">
                Advanced AI-powered monitoring to protect your children and empower families to navigate the digital world safely.
              </p>

              <div className="flex flex-wrap gap-4 mb-8">
                <Button
                  size="lg"
                  className="bg-white text-blue-600 hover:bg-gray-200 shadow-lg px-8 transition-colors dark:bg-gradient-to-r from-cyan-500 to-blue-600 dark:text-white dark:hover:bg-cyan-500"
                  asChild
                >
                  <Link href="/pricing">Register Now</Link>
                </Button>

              </div>

              <div className="flex items-center gap-8 flex-wrap text-white dark:text-gray-400">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center shadow-lg
                            bg-green-500/30 border border-green-400/40 dark:bg-green-700/40 dark:border-green-600/50">
                    <Shield className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-sm font-medium">ISO 27001-2022 Certified</span>
                </div>

                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center shadow-lg
                            bg-cyan-500/30 border border-cyan-400/40 dark:bg-cyan-700/40 dark:border-cyan-600/50">
                    <Zap className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-sm font-medium">Real-Time AI</span>
                </div>
              </div>
            </motion.div>

            {/* Right Panel */}
            <motion.div
  initial={{ opacity: 0, x: 20 }}
  animate={{ opacity: 1, x: 0 }}
  transition={{ duration: 0.6, delay: 0.2 }}
  className="relative"
>
  <div className="bg-white/10 dark:bg-gray-900/80 backdrop-blur-xl rounded-3xl p-8 shadow-2xl shadow-white/20 border border-white/20 dark:border-gray-800">
    <div className="space-y-4">
      {/* Status Cards */}
      {[
        { title: "Safe Browsing Active", subtitle: "All devices protected", icon: Check, color: "green" },
        { title: "Alert Detected", subtitle: "Inappropriate content blocked", icon: AlertTriangle, color: "red" },
        { title: "Real-Time Monitoring", subtitle: "24/7 protection active", icon: Zap, color: "cyan" },
      ].map((item, i) => {
        const colorMap = {
          green: {
            border: "border-green-500/30",
            borderHover: "hover:border-green-500/50",
            bg: "bg-green-500",
            shadow: "shadow-green-500/30",
          },
          red: {
            border: "border-red-500/30",
            borderHover: "hover:border-red-500/50",
            bg: "bg-red-500",
            shadow: "shadow-red-500/30",
          },
          cyan: {
            border: "border-cyan-500/30",
            borderHover: "hover:border-cyan-500/50",
            bg: "bg-cyan-500",
            shadow: "shadow-cyan-500/30",
          },
        };

        const c = colorMap[item.color as keyof typeof colorMap];


        return (
          <div
            key={i}
            className={`flex items-center gap-4 p-5 rounded-2xl border transition-all
              bg-white/20 dark:bg-gray-800/50
              ${c.border} ${c.borderHover} shadow-sm shadow-white/20`}
          >
            <div
              className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-lg
                ${c.bg} ${c.shadow}`}
            >
              <item.icon className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="font-bold text-white dark:text-white">{item.title}</div>
              <div className="text-sm text-white/80 dark:text-gray-400">{item.subtitle}</div>
            </div>
          </div>
        );
      })}
    </div>
  </div>
</motion.div>

          </div>
        </div>
      </section>




      {/* Launch Announcement Section */}
      <section className="py-10 bg-gradient-to-br from-green-50 via-blue-50 to-indigo-100 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center space-y-6 mb-16">
            <div className="inline-flex items-center px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-medium dark:bg-green-500/10 dark:text-green-400">
              🚀 Coming Soon
            </div>
            <h2 className="text-3xl lg:text-5xl font-bold text-gray-900 dark:text-white">
              ZyberHero Launch Timeline
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-4xl mx-auto leading-relaxed">
              Join thousands of families and organizations preparing for a safer digital future
            </p>
          </div>

          {/* Countdown Timer */}
          <div id="reserveSpot"  className="mb-16">
            <CountdownTimer />
          </div>

          {/* Timeline + Card */}
          <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
            {/* Left Column */}
            <div className="space-y-8">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-12 h-12 bg-blue-100 dark:bg-blue-500/10 rounded-full flex items-center justify-center">
                  <Calendar className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    Pre-Launch Access
                  </h3>
                  <p className="text-lg text-blue-600 dark:text-blue-400 font-semibold mb-2">
                    December 30, 2025
                  </p>
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                    Be among the first to experience ZyberHero with exclusive early access, special pricing, and direct feedback opportunities.
                  </p>
                </div>
              </div>

              <div  className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-12 h-12 bg-green-100 dark:bg-green-500/10 rounded-full flex items-center justify-center">
                  <Shield className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    Official Launch
                  </h3>
                  <p className="text-lg text-green-600 dark:text-green-400 font-semibold mb-2">
                    January 15, 2026
                  </p>
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                    Full platform launch with complete AI protection, educational modules, and comprehensive family safety tools.
                  </p>
                </div>
              </div>
            </div>

            {/* Right Card */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-8 border hover:shadow-cyan-500/20 border-gray-100 dark:border-gray-800 transition-all duration-300">
              <div className="text-center space-y-6">
                <div className="text-6xl mb-4">🎯</div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Join the Pre-Launch
                </h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  Get notified when pre-launch access begins and secure your spot in the future of child digital safety.
                </p>
                <div className="space-y-4">
                  {/* <ReserveSpotForm 
                    trigger={
                      <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 text-lg">
                        Reserve Your Spot
                      </Button>
                    }
                  /> */}
                  <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 text-lg">
                    Reserve Your Spot
                  </Button>
                  <p className="text-sm text-gray-500 dark:text-gray-500">
                    Limited early access spots available
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Community Focus Cards */}
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-0 shadow-lg bg-white dark:bg-gray-900 hover:shadow-cyan-500/20 transition-all duration-300">
              <CardHeader className="text-center pb-4">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-50 dark:bg-blue-500/10 mb-4 mx-auto">
                  <Users className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                </div>
                <CardTitle className="text-xl font-bold text-gray-900 dark:text-white">
                  Families
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-600 dark:text-gray-400 text-center leading-relaxed">
                  Comprehensive protection for children of all ages with parental controls, educational content, and real-time monitoring.
                </CardDescription>
                <div className="mt-4 text-center">
                  <Button variant="outline" className="w-full border-2 border-cyan-500/50 bg-transparent text-cyan-400 hover:bg-cyan-500 hover:text-white hover:shadow-2xl hover:shadow-cyan-500/70 transition-all">
                  Learn More
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-white dark:bg-gray-900 hover:shadow-purple-500/20 transition-all duration-300">
              <CardHeader className="text-center pb-4">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-purple-50 dark:bg-purple-500/10 mb-4 mx-auto">
                  <Shield className="h-8 w-8 text-purple-600 dark:text-purple-400" />
                </div>
                <CardTitle className="text-xl font-bold text-gray-900 dark:text-white">
                  Organizations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-600 dark:text-gray-400 text-center leading-relaxed">
                  Enterprise solutions for schools, nonprofits, and institutions serving children with advanced admin controls and reporting.
                </CardDescription>
                <div className="mt-4 text-center">
                  {/* <EnterpriseInfo 
                    trigger={
                      <Button variant="outline" className="w-full border-2 border-cyan-500/50 bg-transparent text-cyan-400 hover:bg-cyan-500 hover:text-white hover:shadow-2xl hover:shadow-cyan-500/70 transition-all">
                        Get Enterprise Info
                      </Button>
                    }
                  /> */}
                  <Button variant="outline" className="w-full border-2 border-cyan-500/50 bg-transparent text-cyan-400 hover:bg-cyan-500 hover:text-white hover:shadow-2xl hover:shadow-cyan-500/70 transition-all">
                    Get Enterprise Info
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-gradient-to-br from-pink-50 to-purple-50 dark:from-gray-900 dark:to-gray-950 hover:shadow-pink-500/20 transition-all duration-300">
              <CardHeader className="text-center pb-4">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-pink-100 dark:bg-pink-500/10 mb-4 mx-auto">
                  <Heart className="h-8 w-8 text-pink-600 dark:text-pink-400" />
                </div>
                <CardTitle className="text-xl font-bold text-gray-900 dark:text-white">
                  People of Determination
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-600 dark:text-gray-400 text-center leading-relaxed">
                  Specialized accessibility features and enhanced protection for individuals with special needs, ensuring inclusive digital safety.
                </CardDescription>
                <div className="mt-4 text-center">
                  {/* <AccessibilityFeatures 
                    trigger={
                      <Button variant="outline" className="w-full border-2 border-cyan-500/50 bg-transparent text-cyan-400 hover:bg-cyan-500 hover:text-white hover:shadow-2xl hover:shadow-cyan-500/70 transition-all">
                        Accessibility Features
                      </Button>
                    }
                  /> */}
                  <Button variant="outline" className="w-full border-2 border-cyan-500/50 bg-transparent text-cyan-400 hover:bg-cyan-500 hover:text-white hover:shadow-2xl hover:shadow-cyan-500/70 transition-all">
                    Accessibility Features
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* CTA */}
          <div className="mt-16 text-center bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-8 border border-gray-100 dark:border-gray-800">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Ready to Secure Your Child's Digital Future?
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-2xl mx-auto">
              Join our growing community of families and organizations committed to creating a safer digital world for children.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              
                   {/* <PreLaunchListForm
                    trigger={
                      <Button className="bg-blue-600 hover:bg-blue-700 text-white py-3 text-lg">
                        Join Pre-Launch List
                      </Button>
                    }
                  /> */}
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white py-3 text-lg">
                    Join Pre-Launch List
                  </Button>
                 
            </div>
          </div>
        </div>
      </section>


      {/* About US */}
      <section id="about" className="py-10 bg-gradient-to-r from-green-50 to-blue-50 dark:from-gray-900 dark:to-gray-950">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-flex items-center mb-4 px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-medium dark:bg-green-500/10 dark:text-green-400">
              About Us
            </div>
            <h2 className="text-4xl mb-4 lg:text-5xl font-bold text-gray-900 dark:text-white">
              ZyberHero
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              Protecting innocence in the digital age through advanced AI
              technology and compassionate monitoring
            </p>
          </div>

          <div className="grid md:grid-cols-1 gap-8 max-w-6xl mx-auto mb-12"> {/* Increased max-w to 5xl for horizontal space */}
            {[
              {
                title: "Our Mission",
                desc: `At ZyberHero, we believe every child deserves to explore the digital world safely. Our mission is to provide parents with the most advanced, yet easy-to-use tools to protect their children from online threats while fostering healthy digital habits.

We combine cutting-edge AI technology with child psychology expertise to create solutions that protect without invading privacy, educate without overwhelming, and empower families to thrive in our connected world.`,
                icon: Shield,
              },
              // If you had other items, they would go here.
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                // Styling for the entire Mission Card Container
                className="bg-white dark:bg-gray-800 rounded-3xl p-8 border-2 border-cyan-500/20 hover:border-cyan-500/50 shadow-lg hover:shadow-2xl hover:shadow-cyan-500/30 transition-all"
              >
                {/* GRID LAYOUT: Mission Text (7 cols) and Stats Card (5 cols) */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-10 items-start">

                  {/* LEFT COLUMN: Mission Text and Icon (7 columns) */}
                  <div className="md:col-span-7 flex flex-col items-center text-center">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center shadow-lg shadow-cyan-500/30">
                        <item.icon className="w-8 h-8 text-white" />
                      </div>
                      <h3 className="text-3xl font-bold text-gray-900 dark:text-white">
                        {item.title}
                      </h3>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-lg whitespace-pre-line">
                      {item.desc}
                    </p>
                  </div>


                  {/* RIGHT COLUMN: Stats Card (5 columns) */}
                  <div className="md:col-span-5 flex justify-center md:justify-end">

                    {/* START: Embedded Stats Card JSX */}
                    <div className="
            w-full max-w-sm p-6 mx-auto 
            bg-blue-50-80
            rounded-xl 
            text-center 
            backdrop-blur-sm
           
          ">

                      {/* Icon */}
                      <div className="mb-4">
                        {/* Note: Using emoji here, replace with proper icon if available */}
                        <div className="inline-block p-3 text-3xl text-blue-500 bg-white/50 rounded-full border border-blue-200 shadow-lg">
                          🛡️
                        </div>
                      </div>

                      {/* R&D Title */}
                      <h3 className="text-2xl font-bold text-blue-600 tracking-wider">
                        R&D
                      </h3>
                      {/* Subtitle */}
                      <p className="text-sm text-gray-600 mb-6">
                        Advanced AI Development
                      </p>

                      {/* --- Accuracy Section --- */}
                      <div className="space-y-1 py-3 border-t border-blue-200">
                        <p className="text-4xl font-extrabold text-green-600">
                          99.9%
                        </p>
                        <p className="text-xs text-gray-500">
                          Target Detection Accuracy
                        </p>
                      </div>

                      {/* --- Launch Year Section --- */}
                      <div className="space-y-1 pt-3 border-t border-blue-200">
                        <p className="text-4xl font-extrabold text-purple-600">
                          2026
                        </p>
                        <p className="text-xs text-gray-500">
                          Planned Launch Year
                        </p>
                      </div>
                    </div>
                    {/* END: Embedded Stats Card JSX */}

                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-10 bg-white dark:bg-gray-950 transition-colors duration-500">
        {/* Outer container */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Header section */}
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-4xl mb-4 lg:text-5xl font-bold text-gray-900 dark:text-white">
              Our Roadmap
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              From research and development to becoming a global leader in child digital safety
            </p>
          </div>

          {/* Timeline container */}
          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-1/2 transform -translate-x-px h-full w-0.5 bg-gray-300 dark:bg-gray-700"></div>

            {/* Timeline events */}
            <div className="space-y-12">

              {/* === Event 1 === */}
              <div className="relative flex items-center justify-start">
                <div className="w-5/12 pr-8 text-right">
                  <div className="rounded-lg bg-green-100 dark:bg-green-900 border border-green-300 dark:border-green-700 text-gray-900 dark:text-white shadow-lg hover:shadow-cyan-500/40 hover:-translate-y-1 transition-all duration-300">
                    <div className="flex flex-col space-y-1.5 p-6">
                      <div className="flex items-center justify-between">
                        <h3 className="tracking-tight text-lg font-bold">R&D Phase Initiated</h3>
                        <div className="flex items-center space-x-2">
                          <span className="px-3 py-1 rounded-full text-sm font-medium bg-green-200 dark:bg-green-700 text-green-900 dark:text-green-100">2024</span>
                          <span className="text-green-600 dark:text-green-400">✓</span>
                        </div>
                      </div>
                    </div>
                    <div className="p-6 pt-0">
                      <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                        Started research and development of AI-powered child protection technology with a team of experts.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 rounded-full border-4 border-white dark:border-gray-950 shadow bg-green-400"></div>
              </div>

              {/* === Event 2 === */}
              <div className="relative flex items-center justify-end">
                <div className="w-5/12 pl-8 text-left">
                  <div className="rounded-lg bg-blue-100 dark:bg-blue-900 border border-blue-300 dark:border-blue-700 text-gray-900 dark:text-white shadow-lg hover:shadow-cyan-500/40 hover:-translate-y-1 transition-all duration-300">
                    <div className="flex flex-col space-y-1.5 p-6">
                      <div className="flex items-center justify-between">
                        <h3 className="tracking-tight text-lg font-bold">Investor Partnership</h3>
                        <div className="flex items-center space-x-2">
                          <span className="px-3 py-1 rounded-full text-sm font-medium bg-blue-200 dark:bg-blue-700 text-blue-900 dark:text-blue-100">Nov 2025</span>
                        </div>
                      </div>
                    </div>
                    <div className="p-6 pt-0">
                      <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                        Secure strategic investor partnership to fund development and accelerate product launch.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 rounded-full border-4 border-white dark:border-gray-950 shadow bg-blue-400"></div>
              </div>

              {/* === Event 3 === */}
              <div className="relative flex items-center justify-start">
                <div className="w-5/12 pr-8 text-right">
                  <div className="rounded-lg bg-blue-100 dark:bg-blue-900 border border-blue-300 dark:border-blue-700 text-gray-900 dark:text-white shadow-lg hover:shadow-cyan-500/40 hover:-translate-y-1 transition-all duration-300">
                    <div className="flex flex-col space-y-1.5 p-6">
                      <div className="flex items-center justify-between">
                        <h3 className="tracking-tight text-lg font-bold">Company Establishment</h3>
                        <div className="flex items-center space-x-2">
                          <span className="px-3 py-1 rounded-full text-sm font-medium bg-blue-200 dark:bg-blue-700 text-blue-900 dark:text-blue-100">Dec 2025</span>
                        </div>
                      </div>
                    </div>
                    <div className="p-6 pt-0">
                      <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                        Official company incorporation and team expansion with dedicated development resources.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 rounded-full border-4 border-white dark:border-gray-950 shadow bg-blue-400"></div>
              </div>

              {/* === Event 4 === */}
              <div className="relative flex items-center justify-end">
                <div className="w-5/12 pl-8 text-left">
                  <div className="rounded-lg bg-blue-100 dark:bg-blue-900 border border-blue-300 dark:border-blue-700 text-gray-900 dark:text-white shadow-lg hover:shadow-cyan-500/40 hover:-translate-y-1 transition-all duration-300">
                    <div className="flex flex-col space-y-1.5 p-6">
                      <div className="flex items-center justify-between">
                        <h3 className="tracking-tight text-lg font-bold">B2C Beta Launch</h3>
                        <div className="flex items-center space-x-2">
                          <span className="px-3 py-1 rounded-full text-sm font-medium bg-blue-200 dark:bg-blue-700 text-blue-900 dark:text-blue-100">Jan 2026</span>
                        </div>
                      </div>
                    </div>
                    <div className="p-6 pt-0">
                      <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                        Release beta version of ZyberHero for families and individual consumers.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 rounded-full border-4 border-white dark:border-gray-950 shadow bg-blue-400"></div>
              </div>

              {/* === Event 5 === */}
              <div className="relative flex items-center justify-start">
                <div className="w-5/12 pr-8 text-right">
                  <div className="rounded-lg bg-blue-100 dark:bg-blue-900 border border-blue-300 dark:border-blue-700 text-gray-900 dark:text-white shadow-lg hover:shadow-cyan-500/40 hover:-translate-y-1 transition-all duration-300">
                    <div className="flex flex-col space-y-1.5 p-6">
                      <div className="flex items-center justify-between">
                        <h3 className="tracking-tight text-lg font-bold">B2B Platform Launch</h3>
                        <div className="flex items-center space-x-2">
                          <span className="px-3 py-1 rounded-full text-sm font-medium bg-blue-200 dark:bg-blue-700 text-blue-900 dark:text-blue-100">Feb 2026</span>
                        </div>
                      </div>
                    </div>
                    <div className="p-6 pt-0">
                      <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                        Launch enterprise solution for schools, organizations, and educational institutions.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 rounded-full border-4 border-white dark:border-gray-950 shadow bg-blue-400"></div>
              </div>

              {/* === Event 6 === */}
              <div className="relative flex items-center justify-end">
                <div className="w-5/12 pl-8 text-left">
                  <div className="rounded-lg bg-gray-100 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white shadow-lg hover:shadow-cyan-500/40 hover:-translate-y-1 transition-all duration-300">
                    <div className="flex flex-col space-y-1.5 p-6">
                      <div className="flex items-center justify-between">
                        <h3 className="tracking-tight text-lg font-bold">Global Expansion</h3>
                        <div className="flex items-center space-x-2">
                          <span className="px-3 py-1 rounded-full text-sm font-medium bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100">2026+</span>
                        </div>
                      </div>
                    </div>
                    <div className="p-6 pt-0">
                      <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                        Scale internationally with partnerships in education, law enforcement, and child safety organizations.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 rounded-full border-4 border-white dark:border-gray-950 shadow bg-gray-400"></div>
              </div>

            </div>
          </div>
        </div>
      </section>



      <section id="features" className="py-10 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-flex items-center mb-4 px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-medium dark:bg-green-500/10 dark:text-green-400">
              Features
            </div>
            <h2 className="text-3xl mb-4 lg:text-5xl font-bold text-gray-900 dark:text-white">
              Comprehensive Digital Protection
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Advanced AI-powered monitoring that keeps your children safe
              across all digital platforms
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Card className="h-full hover:shadow-2xl hover:shadow-cyan-500/30 transition-all hover:-translate-y-1 border-2 border-cyan-500/20 hover:border-cyan-500/50 bg-gray-100 dark:bg-gray-800">
                    <CardHeader>
                      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center mb-4 shadow-lg shadow-cyan-500/30">
                        <Icon className="w-7 h-7 text-white" />
                      </div>
                      <CardTitle className="text-xl font-bold text-gray-900 dark:text-white">
                        {feature.title}
                      </CardTitle>
                      <CardDescription className="text-base text-gray-600 dark:text-gray-400">
                        {feature.description}
                      </CardDescription>
                    </CardHeader>
                  </Card>
                </motion.div>
              );
            })}
          </div>

          <div className="mt-20 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-8 lg:p-12 text-white">
            <div className="grid lg:grid-cols-2 gap-8 items-center">
              <div className="space-y-6">
                <h3 className="text-2xl lg:text-3xl font-bold">
                  Investigator Portal
                </h3>
                <p className="text-blue-100 text-lg leading-relaxed">
                  Advanced tools for law enforcement and child protection specialists. Secure evidence collection,
                  predator profiling, and comprehensive case management with full chain of custody documentation.
                </p>
                <div className="flex flex-wrap gap-4">
                  <div className="bg-white/10 backdrop-blur rounded-lg px-4 py-2">
                    <span className="text-sm font-medium">Evidence Collection</span>
                  </div>
                  <div className="bg-white/10 backdrop-blur rounded-lg px-4 py-2">
                    <span className="text-sm font-medium">Predator Profiling</span>
                  </div>
                  <div className="bg-white/10 backdrop-blur rounded-lg px-4 py-2">
                    <span className="text-sm font-medium">Case Management</span>
                  </div>
                </div>
              </div>
              <div className="bg-white/10 backdrop-blur rounded-xl p-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-blue-100">Threat Level Analysis</span>
                    <span className="text-white font-bold">HIGH RISK</span>
                  </div>
                  <div className="w-full bg-white/20 rounded-full h-2">
                    <div className="bg-red-400 h-2 rounded-full w-4/5"></div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="text-blue-100">Suspicious Contacts</div>
                      <div className="text-white font-bold">3 Active</div>
                    </div>
                    <div>
                      <div className="text-blue-100">Evidence Items</div>
                      <div className="text-white font-bold">47 Collected</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>



      <section id="how-it-works" className="py-10 bg-gray-50 dark:bg-gray-950">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-flex items-center mb-4 px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-medium dark:bg-green-500/10 dark:text-green-400">
              How It Works
            </div>
            <h2 className="text-4xl mb-4 lg:text-5xl font-bold text-gray-900 dark:text-white">
              How Our Monitoring Works
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              A safe, structured approach to monitoring digital activities
              without invasion of privacy and with support
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8 max-w-5xl mx-auto">
            {[
              {
                step: "1",
                title: "Assessment",
                desc: "We analyze digital footprints and identify potential risks across all platforms",
              },
              {
                step: "2",
                title: "Monitoring",
                desc: "AI monitors activity 24/7, analyzing content, interactions and behavioral patterns",
              },
              {
                step: "3",
                title: "Analysis",
                desc: "Smart algorithms detect threats, inappropriate content and suspicious behavior",
              },
              {
                step: "4",
                title: "Response",
                desc: "Instant notifications and automated protection when threats are detected",
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center mx-auto mb-4 text-3xl font-black text-white shadow-xl shadow-cyan-500/50">
                  {item.step}
                </div>
                <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">
                  {item.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button
              size="lg"
              className="border-2 border-cyan-500/50 bg-transparent text-cyan-400 hover:bg-cyan-500 hover:text-white hover:shadow-2xl hover:shadow-cyan-500/70 transition-all"
              asChild
            >
              <Link href="/pricing">Start Protecting Now</Link>
            </Button>
          </div>
        </div>
      </section>

      <GamificationSection />
      <MentoringSection />

      <section className="pb-10 bg-white dark:bg-gray-950">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-gray-50 dark:bg-gray-900 backdrop-blur rounded-2xl p-8 shadow-lg border-2 border-cyan-500/20 hover:border-cyan-500/50 hover:shadow-2xl hover:shadow-cyan-500/30 transition-all"
              >
                <div className="text-5xl md:text-6xl font-black bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent mb-2">
                  {stat.value}
                </div>
                <div className="text-gray-600 dark:text-gray-400 font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section id="founding-team" className="py-10 bg-gradient-to-r from-cyan-50 to-blue-100 dark:from-gray-900 dark:to-gray-900 transition-colors duration-300">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-flex items-center mb-4 px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-medium dark:bg-green-500/10 dark:text-green-400">
              Founding Team
            </div>
            <h2 className="text-4xl mb-4 lg:text-5xl font-bold text-gray-900 dark:text-white">
              Meet the visionary behind ZyberHero
            </h2>
          </div>

          {/* --- New Layout Container: Wider and using an equal two-column grid --- */}
          <div className="max-w-4xl mx-auto shadow-xl rounded-3xl">

            {/* 1. Farouk Said - Founder & CEO Card (Vertical Layout) */}
            <div className="bg-gray-50 dark:bg-gray-800 rounded-3xl p-8 md:p-12 border-2 border-cyan-500/20 shadow-xl hover:shadow-cyan-500/20 hover:-translate-y-1 transition-all duration-300">
              <div className="flex flex-col gap-6 items-center text-center">

                {/* Image Section */}
                <div className="flex-shrink-0 w-48 h-48">
                  <Image
                    src="/Farouk_Said.jpg"
                    alt="Farouk Said"
                    width={192}
                    height={192}
                    className="rounded-full shadow-lg object-cover w-full h-full border-4 border-cyan-400"
                  />
                </div>

                {/* Text Content */}
                <div className="text-gray-700 dark:text-gray-300 flex flex-col items-center">
                  <h3 className="text-3xl md:text-4xl font-black mb-1 bg-gradient-to-r from-cyan-600 to-blue-800 bg-clip-text text-transparent dark:text-white">
                    Farouk Said
                  </h3>
                  <p className="text-cyan-400 font-bold text-xl mb-4">
                    Founder & CEO
                  </p>

                  {/* Description/Bio */}
                  <div className="space-y-3 text-sm md:text-base leading-relaxed">
                    <p className="font-semibold text-lg">
                      Child Safety Technology Pioneer
                    </p>
                    <p className="italic text-cyan-600">
                      Dedicated to digital child protection.
                    </p>
                    <p className="mt-2">
                      Visionary leader driving innovation in AI-powered child safety solutions and digital protection technologies.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* 2. Keross R&D Team Section */}
            {/* <div className="bg-gray-50 dark:bg-gray-800 rounded-3xl p-8 md:p-12 border-2 border-cyan-500/20 shadow-xl">
              <div className="flex flex-col gap-6 items-center text-center">
                <div className="flex-shrink-0 w-48 h-48 rounded-full overflow-hidden border-4 border-cyan-400 shadow-lg flex items-center justify-center bg-black">
                  <Image
                    src="/keross-logo.jpg"
                    alt="Keross Logo"
                    width={192}
                    height={192}
                    className="object-contain w-full h-full"
                  />
                </div>
                <div className="text-gray-700 dark:text-gray-300 flex flex-col items-center">
                  <h3 className="text-3xl md:text-4xl font-black mb-1 bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                    Keross Team
                  </h3>
                  <p className="text-cyan-400 font-bold text-xl mb-4">
                    Technology Backbone
                  </p>
                  <div className="space-y-3 text-sm md:text-base leading-relaxed">
                    <p className="font-semibold text-lg">
                      Innovation & Engineering Powerhouse
                    </p>
                    <p className="italic text-cyan-200/80">
                      Driving the core AI and platform development.
                    </p>
                  </div>
                </div>
              </div>
            </div> */}
          </div>

        </div>
      </section>

      {/* <section id="testimonials" className="py-20 bg-black text-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-block px-4 py-2 bg-cyan-500/20 text-cyan-400 rounded-full text-sm font-semibold mb-4 border border-cyan-500/30">
              Testimonials
            </div>
            <h2 className="text-4xl md:text-5xl font-black mb-4 text-white">
              Trusted by Families Worldwide
            </h2>
            <p className="text-xl text-gray-400">
              Real stories from parents who transformed their children's safety
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="h-full bg-gray-900 border-2 border-cyan-500/20 hover:border-cyan-500/50 transition-all hover:shadow-xl hover:shadow-cyan-500/20">
                  <CardHeader>
                    <div className="flex mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star
                          key={i}
                          className="w-5 h-5 fill-cyan-400 text-cyan-400"
                        />
                      ))}
                    </div>
                    <CardDescription className="text-base text-gray-300 italic">
                      "{testimonial.quote}"
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="font-semibold text-white">
                      {testimonial.author}
                    </div>
                    <div className="text-sm text-gray-500">
                      {testimonial.role}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section> */}


      <PricingPlans />


      <section className="py-10 bg-gray-50 dark:bg-black text-gray-900 dark:text-white">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center mb-4 px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-medium dark:bg-green-500/10 dark:text-green-400">
              FAQ
            </div>
            <h2 className="text-4xl mb-4 lg:text-5xl font-bold text-gray-900 dark:text-white">
              Have Questions?
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
              Check out our comprehensive FAQ page or contact our support team
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              {/* <Link href="/faq">
                <Button
                  size="lg"
                  className="border-2 border-cyan-500/50 bg-transparent text-cyan-400 hover:bg-cyan-500 hover:text-white hover:shadow-2xl hover:shadow-cyan-500/70 transition-all"
                >
                  View FAQ
                </Button>
              </Link> */}

              <Button
                  size="lg"
                  className="border-2 border-cyan-500/50 bg-transparent text-cyan-400 hover:bg-cyan-500 hover:text-white hover:shadow-2xl hover:shadow-cyan-500/70 transition-all"
                >
                  View FAQ
                </Button>
                  <ContactSupport
                    trigger={
                      <Button
                size="lg"
                className="border-2 border-cyan-500/50 bg-transparent text-cyan-400 hover:bg-cyan-500 hover:text-white hover:shadow-2xl hover:shadow-cyan-500/70 transition-all"
              >
                Contact Support
              </Button>
                    }
                  />
               
            
            </div>
          </motion.div>
        </div>
      </section>

      <footer id="contact" className="bg-gray-900 text-gray-300 py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="relative w-8 h-8">
                  <Image
                    src="/zyber-logo.png"
                    alt="ZyberHero"
                    fill
                    className="object-contain"
                  />
                </div>
                <span className="text-white font-bold text-lg">ZyberHero</span>
              </div>
              <p className="text-sm text-gray-300">
                Advanced AI-powered child protection platform. Keeping families safe in the digital world through intelligent monitoring and threat detection.
              </p>
            </div>

            <div>
              <h3 className="text-white font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-sm text-gray-300">
                <li>
                  <Link
                    href="#features"
                    className="hover:text-white transition-colors"
                  >
                    Features
                  </Link>
                </li>
                <li>
                  <Link
                    href="#pricing"
                    className="hover:text-white transition-colors"
                  >
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link
                    href="#how-it-works"
                    className="hover:text-white transition-colors"
                  >
                    How It Works
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-white font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-sm text-gray-300">
                {/* <li>
                  <Link href="#contact" className="hover:text-white transition-colors">
                    Help Center
                  </Link>
                </li> */}
                <li>
                  <Link href="#contact" className="hover:text-white transition-colors">
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Terms of Service
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-white font-semibold mb-4">Contact</h3>
              <ul className="space-y-2 text-sm text-gray-300">
                <li>zyberHeroSupport@keross.com</li>
                <li>+971 56 7441943</li>
                <li>24/7 Protection Support</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 text-center text-sm text-gray-300">
            <p>
              &copy; 2025 ZyberHero. All rights reserved. Innocence Deserves Protection.
            </p>
          </div>

          <div className="mt-8 p-4 bg-red-900/20 border border-red-800 rounded-lg">
            <div className="text-center">
              <h4 className="font-semibold text-red-400 mb-2">
                Emergency Situations
              </h4>
              <p className="text-sm text-gray-300 mb-2">
                If you believe a child is in immediate danger, contact local law enforcement immediately.
              </p>
              <div className="flex justify-center space-x-4 text-sm">
                <span className="text-red-400">🚨 Emergency: 911</span>
                <span className="text-red-400">📞 FBI: 1-800-CALL-FBI</span>
                <span className="text-red-400">
                  💻 CyberTipline: www.missingkids.org
                </span>
              </div>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
}
