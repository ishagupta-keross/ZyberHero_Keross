"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Check, ArrowRight } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import ContactSupport from "./ContactSupport";

export default function PricingPlans() {
  const plans = [
    {
      name: "Family Basic",
      description: " Perfect for families with 1-2 children",
      price: "$9.99",
      period: "/month",
      features: [
        "Monitor up to 2 devices",
        "Real-time threat detection",
        "Basic AI analysis",
        "Parent dashboard",
        "Email alerts",
        "24/7 monitoring",
      ],
    },
    {
      name: " Family Pro",
      description: "Comprehensive protection for larger families",
      price: "$19.99",
      period: "/month",
      popular: true,
      features: [
        "Monitor up to 5 devices",
        "Advanced AI threat detection",
        "Behavioral pattern analysis",
        "Instant push notifications",
        "Detailed reporting",
        "Priority support",
        "Evidence collection",
        "Multi-platform coverage",
      ],
    },
    {
      name: "Enterprise",
      description: "For schools, organizations, and law enforcement",
      price: "Custom ",
      period: "pricing",
      features: [
        "Unlimited devices",
        "Investigator portal access",
        "Advanced case management",
        "Chain of custody documentation",
        "Custom integrations",
        "Dedicated support",
        "Training and onboarding",
        "Compliance reporting",
      ],
      contactSales: true, // flag to identify Enterprise plan
    },
  ];

  return (
    <section id="pricing" className="py-20 bg-white dark:bg-black">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <div className="inline-flex items-center mb-4 px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-medium dark:bg-green-500/10 dark:text-green-400">
            Pricing
          </div>
          <h2 className="text-4xl mb-4 lg:text-5xl font-bold text-gray-900 dark:text-white">
            Choose Your Protection Plan
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            Start with a 14-day free trial. No credit card required. Cancel anytime.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card
                className={`h-full relative bg-gray-50 dark:bg-gray-900 border-2 ${plan.popular
                  ? "border-cyan-500/50 shadow-2xl shadow-cyan-500/30"
                  : "border-gray-200 dark:border-gray-800 hover:border-cyan-500/30 "
                  } transition-all flex flex-col hover:shadow-cyan-500/40 hover:-translate-y-1 duration-300`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-6 py-2 rounded-full text-sm font-bold shadow-lg shadow-cyan-500/50">
                    Most Popular
                  </div>
                )}
                <CardHeader className="text-center pb-8">
                  <CardTitle className="text-2xl mb-2 text-gray-900 dark:text-white">
                    {plan.name}
                  </CardTitle>
                  <CardDescription className="text-gray-600 dark:text-gray-400 mb-4">
                    {plan.description}
                  </CardDescription>
                  <div className="mb-4">
                    <span className="text-4xl font-black text-gray-900 dark:text-white">
                      {plan.price}
                    </span>
                    <span className="text-gray-600 dark:text-gray-400">{plan.period}</span>
                  </div>
                </CardHeader>
                <CardContent className="flex-grow flex flex-col">
                  <ul className="space-y-3 mb-6 flex-grow">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-gray-700 dark:text-gray-300">
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>

                  {/* Button with conditional text & link */}
                  {plan.contactSales ? (
                    <ContactSupport
                      trigger={
                        <Button
                          className="w-full border-2 border-cyan-500/50 bg-transparent text-cyan-400 hover:bg-cyan-500 hover:text-white hover:shadow-2xl hover:shadow-cyan-500/70 transition-all"
                          size="lg"
                        >
                          Contact Sales
                        </Button>
                      }
                    />
                  ) : (
                    <Button
                      className={`w-full transition-all ${plan.popular
                        ? "bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white shadow-lg hover:shadow-2xl hover:shadow-cyan-500/70"
                        : "border-2 border-cyan-500/50 bg-transparent text-cyan-400 hover:bg-cyan-500 hover:text-white hover:shadow-2xl hover:shadow-cyan-500/70 transition-all"
                        }`}
                      size="lg"
                      asChild
                    >
                      <Link
                        href={`/payment?plan=${encodeURIComponent(plan.name)}&price=${encodeURIComponent(plan.price)}&popular=${plan.popular || false}`}
                      >
                        Start Free Trial
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Link>
                    </Button>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
         {/* Money Back Guarantee */}
      {/* <div className="max-w-6xl mx-auto px-4 mt-16">
        <div className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-gray-900 dark:to-gray-950 rounded-2xl p-8 md:p-12 text-center border border-gray-200 dark:border-gray-800 transition-colors duration-300">
          <div className="max-w-3xl mx-auto">
            <div className="text-4xl mb-4">💰</div>
            <h3 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-4">
              30-Day Money-Back Guarantee
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-lg md:text-xl leading-relaxed">
              We're so confident in ZyberHero's ability to protect your family that we offer a full refund
              within 30 days if you're not completely satisfied. Your child's safety is our priority.
            </p>
          </div>
        </div>
      </div> */}
      </div>
    </section>
  );
}
