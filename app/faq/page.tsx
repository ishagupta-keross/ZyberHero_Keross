"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ChevronDown, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import ContactSupport from "@/components/shared/ContactSupport";
import { ThemeToggle } from "@/components/ui/theme-toggle";
export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      question: "What is ZyberHero and how does it protect children?",
      answer: "ZyberHero is a next-generation child digital protection platform that monitors children from pedophiles, grooming, harassment, and harmful content. It continuously analyzes digital interactions to detect and prevent online threats and abuse, helping parents keep their children safe online.",
    },
    {
      question: "How does ZyberHero work in real time?",
      answer: "ZyberHero uses live AI monitoring to observe a child's online activity across video calls, chat, or live streaming. It detects danger signals and suspicious behavior before any harm can occur.",
    },
    {
      question: "What types of data does ZyberHero capture and analyze?",
      answer: "ZyberHero captures and analyzes live streaming data across multiple formats:\n• \"Audio:\" Conversations, call audio, and voice messages\n• \"Audio:\" Abusive or predatory speech\n• \"Video:\" Unsafe visuals, violence, or explicit activity\n• \"Images:\" Harmful or manipulated media\nYour secrets, chatlogs are protected across all digital platforms.",
    },
    {
      question: "How does ZyberHero identify and respond to predatory behavior?",
      answer: "ZyberHero uses advanced AI detection to spot predatory behavior and language patterns that indicate grooming or abuse. When identified, it tracks the predator's digital activity and can notify investigators or child safety authorities to ensure quick action.",
    },
    {
      question: "Can ZyberHero block or stop harmful interactions?",
      answer: "Yes, ZyberHero can pause, block, or send unsafe live sessions and restrict dangerous connections, ensuring the child is immediately protected while notifying the parent via the safety dashboard.",
    },
    {
      question: "What happens during an emergency?",
      answer: "If a serious threat is detected, ZyberHero triggers an emergency alert to the parent and activates emergency mode, which includes the threat level and time-sensitive intervention instructions.",
    },
    {
      question: "What are Safe Zones in ZyberHero?",
      answer: "Safe Zones allow parents to define trusted apps, websites, or platforms where their child can safely interact. Outside these zones, ZyberHero becomes more vigilant and adds an extra protective layer.",
    },
    {
      question: "Who can use ZyberHero?",
      answer: "ZyberHero is built for families, schools, and child protection organizations. Parents can use it at home to protect their children, while institutions such as law enforcement and social services can use it to safeguard vulnerable minors.",
    },
    {
      question: "How can I start using ZyberHero?",
      answer: "Simply sign up on the ZyberHero website, create your parent profile, add your child's device, and set up Safe Zones. Once active, ZyberHero starts 24/7 monitoring and protection automatically.",
    },
    {
      question: "Does ZyberHero provide reports or insights for parents?",
      answer: "Yes, ZyberHero provides smart safety summaries and behavioral insights, showing alerts, trends, and positive changes over time. Parents get clear dashboards that inform and guide their children toward safer online behavior.",
    },
  ];

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-white/80 dark:bg-[#0A0A1B]/80 border-b border-gray-200 dark:border-gray-800">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="relative w-8 h-8">
              <Image
                src="/zyber-logo.png"
                alt="ZyberHero"
                fill
                className="object-contain"
              />
            </div>
            <span className="text-xl font-bold text-gray-900 dark:text-white">
              ZyberHero
            </span>
          </Link>
         <div className="absolute top-4 left-4">
        <Button
          variant="ghost"
          className="hover:bg-cyan-50 hover:text-cyan-600 dark:hover:bg-cyan-950 dark:hover:text-cyan-400"
          asChild
        >
          <Link href="/">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>
        </Button>
      </div>

          <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white dark:from-[#0A0A1B] dark:to-black">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center mb-4 px-4 py-2 bg-cyan-100 text-cyan-800 rounded-full text-sm font-medium dark:bg-cyan-500/10 dark:text-cyan-400">
              Frequently Asked Questions
            </div>
            <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6">
              Frequently Asked Questions
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              Everything you need to know about ZyberHero and how it protects your children
            </p>
          </motion.div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-white dark:bg-black">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                className={`border-2 rounded-lg overflow-hidden transition-all ${
                  openIndex === index
                    ? "border-cyan-500 dark:border-cyan-500 bg-cyan-50/30 dark:bg-cyan-500/5"
                    : "border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900"
                }`}
              >
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full px-6 py-5 flex items-start justify-between gap-4 text-left hover:bg-gray-100 dark:hover:bg-gray-800/50 transition-colors"
                >
                  <div className="flex-1">
                    <span className="text-cyan-500 dark:text-cyan-400 font-bold text-lg mr-2">
                      {index + 1}.
                    </span>
                    <span className="font-semibold text-lg text-gray-900 dark:text-white">
                      {faq.question}
                    </span>
                  </div>
                  <ChevronDown
                    className={`w-5 h-5 text-gray-500 dark:text-gray-400 flex-shrink-0 transition-transform mt-1 ${
                      openIndex === index ? "rotate-180" : ""
                    }`}
                  />
                </button>
                <div
                  className={`overflow-hidden transition-all duration-300 ${
                    openIndex === index ? "max-h-96" : "max-h-0"
                  }`}
                >
                  <div className="px-6 pb-5 pt-2 text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">
                    {faq.answer}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-b from-white to-gray-50 dark:from-black dark:to-[#0A0A1B]">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              Still Have Questions?
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
              Our support team is here to help you 24/7
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
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
              <Link href="/#pricing">
                <Button
                  size="lg"
                  className="border-2 border-cyan-500/50 bg-transparent text-cyan-400 hover:bg-cyan-500 hover:text-white hover:shadow-2xl hover:shadow-cyan-500/70 transition-all"
                >
                  View Pricing Plans
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
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
                    href="/#features"
                    className="hover:text-white transition-colors"
                  >
                    Features
                  </Link>
                </li>
                <li>
                  <Link
                    href="/#pricing"
                    className="hover:text-white transition-colors"
                  >
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link
                    href="/#how-it-works"
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
                <li>
                  <Link href="/#contact" className="hover:text-white transition-colors">
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
