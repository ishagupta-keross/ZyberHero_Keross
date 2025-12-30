"use client";

import React, { useState } from "react";
import { Mail, Phone, Clock, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface ContactSupportProps {
  trigger?: React.ReactNode;
}

const ContactSupport: React.FC<ContactSupportProps> = ({ trigger }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 text-lg">
            Contact Support
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg bg-white dark:bg-[#1A1A32] border-gray-200 dark:border-[#3C3C5A]">
        <DialogHeader className="space-y-4">
          <DialogTitle className="text-center text-2xl font-bold tracking-wider text-gray-900 dark:text-white">
            Contact Support
          </DialogTitle>
          <div className="text-center">
            <h3 className="text-xl font-semibold text-cyan-600 dark:text-cyan-400 mb-4">
              Innocence Deserves Protection
            </h3>
            <DialogDescription className="text-center text-gray-600 dark:text-slate-400">
              Our team is available to discuss enterprise pricing, deployment, and custom solutions for your organization.
            </DialogDescription>
          </div>
        </DialogHeader>

        <div className="space-y-4 mt-6">
          {/* Email Support */}
          <div className="p-4 rounded-lg bg-gray-50 dark:bg-[#2C2C4A] border border-gray-200 dark:border-transparent">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 flex items-center justify-center bg-cyan-100 dark:bg-cyan-500/20 rounded-lg">
                  <Mail className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
                </div>
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-600 dark:text-slate-400 mb-1">Email Support</p>
                <a 
                  href="mailto:zyberHeroSupport@keross.com"
                  className="text-base font-semibold text-gray-900 dark:text-white hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors"
                >
                  zyberHeroSupport@keross.com
                </a>
              </div>
            </div>
          </div>

          {/* Phone / WhatsApp */}
          <div className="p-4 rounded-lg bg-gray-50 dark:bg-[#2C2C4A] border border-gray-200 dark:border-transparent">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 flex items-center justify-center bg-cyan-100 dark:bg-cyan-500/20 rounded-lg">
                  <Phone className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
                </div>
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-600 dark:text-slate-400 mb-1">Phone / WhatsApp</p>
                <a 
                  href="tel:+971567441943"
                  className="text-base font-semibold text-gray-900 dark:text-white hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors"
                >
                  +971 56 7441943
                </a>
              </div>
            </div>
          </div>

          {/* Service Pledge */}
          <div className="p-4 rounded-lg bg-gray-50 dark:bg-[#2C2C4A] border border-gray-200 dark:border-transparent">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 flex items-center justify-center bg-cyan-100 dark:bg-cyan-500/20 rounded-lg">
                  <Clock className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
                </div>
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-600 dark:text-slate-400 mb-1">Service Pledge</p>
                <p className="text-base font-semibold text-gray-900 dark:text-white">
                  24/7 Protection Support
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Close Button */}
        <div className="mt-6">
          <Button
            onClick={() => setIsDialogOpen(false)}
            className="w-full h-12 text-lg font-semibold bg-gradient-to-r from-indigo-600 to-cyan-500 text-white rounded-lg shadow-lg hover:from-indigo-700 hover:to-cyan-600 transition duration-300"
          >
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ContactSupport;
