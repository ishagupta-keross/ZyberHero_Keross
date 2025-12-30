"use client";

import React, { useState, useCallback, FormEvent } from "react";
import { Mail, User, Lock, MessageSquare, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";

interface FormState {
  fullName: string;
  emailAddress: string;
  password: string;
  confirmPassword: string;
  challenges: string;
  consent: boolean;
}

const LOCAL_STORAGE_KEY = "zyberhero_accessibility_features_data";

interface AccessibilityFeaturesProps {
  trigger?: React.ReactNode;
}

const AccessibilityFeatures: React.FC<AccessibilityFeaturesProps> = ({ trigger }) => {
  const [formState, setFormState] = useState<FormState>({
    fullName: "",
    emailAddress: "",
    password: "",
    confirmPassword: "",
    challenges: "",
    consent: false,
  });
  const [errors, setErrors] = useState<Partial<FormState>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { id, value, type, checked } = e.target as HTMLInputElement;
      setFormState((prev) => ({
        ...prev,
        [id]: type === "checkbox" ? checked : value,
      }));
      setErrors((prev) => ({ ...prev, [id]: undefined }));
    },
    []
  );

  const validate = (): boolean => {
    const newErrors: Partial<FormState> = {};
    const { fullName, emailAddress, password, confirmPassword, challenges, consent } = formState;

    if (!fullName.trim()) newErrors.fullName = "Full Name is required.";
    if (!emailAddress || !/\S+@\S+\.\S+/.test(emailAddress)) newErrors.emailAddress = "A valid email is required.";
    if (!password || password.length < 8) newErrors.password = "Password must be at least 8 characters.";
    if (password !== confirmPassword) newErrors.confirmPassword = "Passwords do not match.";
    if (!challenges.trim()) newErrors.challenges = "Please tell us about your challenges.";
    if (!consent) newErrors.consent = true as any;

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      toast.error("Please fill out all required fields.");
      return;
    }

    setIsSubmitting(true);

    try {
      const newEntry = {
        fullName: formState.fullName.trim(),
        emailAddress: formState.emailAddress.toLowerCase(),
        challenges: formState.challenges.trim(),
        dateAdded: new Date().toISOString(),
      };

      const existingData = localStorage.getItem(LOCAL_STORAGE_KEY);
      const registrations = existingData ? JSON.parse(existingData) : [];

      registrations.push(newEntry);
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(registrations));

      toast.success("Account created successfully! Welcome to ZyberHero's accessibility features.");

      setFormState({
        fullName: "",
        emailAddress: "",
        password: "",
        confirmPassword: "",
        challenges: "",
        consent: false,
      });
      setErrors({});
      setIsDialogOpen(false);
    } catch (err) {
      console.error(err);
      toast.error("Failed to create account. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 text-lg">
            Accessibility Features
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-xl max-h-[90vh] overflow-y-auto bg-white dark:bg-[#1A1A32] border-gray-200 dark:border-[#3C3C5A]">
        <DialogHeader className="space-y-4">
          <div className="flex justify-center">
            <div className="w-16 h-16 flex items-center justify-center bg-indigo-100 dark:bg-indigo-800 rounded-full">
              <Zap className="w-8 h-8 text-cyan-600 dark:text-cyan-400" />
            </div>
          </div>
          <DialogTitle className="text-center text-2xl font-bold tracking-wider text-gray-900 dark:text-white">
            <span className="text-cyan-600 dark:text-cyan-400">Accessibility</span> Features
          </DialogTitle>
          <DialogDescription className="text-center text-gray-600 dark:text-slate-400">
            Create your account to customize and access inclusive digital safety tools.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          {/* Full Name */}
          <div className="space-y-2">
            <Label htmlFor="fullName" className="flex items-center text-gray-700 dark:text-slate-300">
              <User className="w-4 h-4 mr-2 text-indigo-600 dark:text-indigo-400" /> Full Name <span className="text-red-500">*</span>
            </Label>
            <Input
              id="fullName"
              placeholder="Enter full name"
              value={formState.fullName}
              onChange={handleChange}
              className={`bg-gray-50 dark:bg-[#2C2C4A] border-gray-300 dark:border-none text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-slate-500 focus:ring-2 focus:ring-cyan-500 ${errors.fullName ? "border-red-500 ring-2 ring-red-500" : ""}`}
            />
            {errors.fullName && <p className="text-xs text-red-400 mt-1">{errors.fullName}</p>}
          </div>

          {/* Email Address */}
          <div className="space-y-2">
            <Label htmlFor="emailAddress" className="flex items-center text-gray-700 dark:text-slate-300">
              <Mail className="w-4 h-4 mr-2 text-indigo-600 dark:text-indigo-400" /> Email Address <span className="text-red-500">*</span>
            </Label>
            <Input
              id="emailAddress"
              type="email"
              placeholder="Enter email address"
              value={formState.emailAddress}
              onChange={handleChange}
              className={`bg-gray-50 dark:bg-[#2C2C4A] border-gray-300 dark:border-none text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-slate-500 focus:ring-2 focus:ring-cyan-500 ${errors.emailAddress ? "border-red-500 ring-2 ring-red-500" : ""}`}
            />
            {errors.emailAddress && <p className="text-xs text-red-400 mt-1">{errors.emailAddress}</p>}
          </div>

          {/* Password */}
          <div className="space-y-2">
            <Label htmlFor="password" className="flex items-center text-gray-700 dark:text-slate-300">
              <Lock className="w-4 h-4 mr-2 text-indigo-600 dark:text-indigo-400" /> Password <span className="text-red-500">*</span>
            </Label>
            <Input
              id="password"
              type="password"
              placeholder="Enter password"
              value={formState.password}
              onChange={handleChange}
              className={`bg-gray-50 dark:bg-[#2C2C4A] border-gray-300 dark:border-none text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-slate-500 focus:ring-2 focus:ring-cyan-500 ${errors.password ? "border-red-500 ring-2 ring-red-500" : ""}`}
            />
            <p className="text-xs text-gray-500 dark:text-slate-500">Minimum 8 characters required.</p>
            {errors.password && <p className="text-xs text-red-400 mt-1">{errors.password}</p>}
          </div>

          {/* Confirm Password */}
          <div className="space-y-2">
            <Label htmlFor="confirmPassword" className="flex items-center text-gray-700 dark:text-slate-300">
              <Lock className="w-4 h-4 mr-2 text-indigo-600 dark:text-indigo-400" /> Confirm Password <span className="text-red-500">*</span>
            </Label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="Enter confirm password"
              value={formState.confirmPassword}
              onChange={handleChange}
              className={`bg-gray-50 dark:bg-[#2C2C4A] border-gray-300 dark:border-none text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-slate-500 focus:ring-2 focus:ring-cyan-500 ${errors.confirmPassword ? "border-red-500 ring-2 ring-red-500" : ""}`}
            />
            {errors.confirmPassword && <p className="text-xs text-red-400 mt-1">{errors.confirmPassword}</p>}
          </div>

          {/* Challenges */}
          <div className="space-y-2">
            <Label htmlFor="challenges" className="flex items-center text-gray-700 dark:text-slate-300">
              <MessageSquare className="w-4 h-4 mr-2 text-indigo-600 dark:text-indigo-400" /> What challenges do you face protecting your child online? <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="challenges"
              placeholder="Enter what challenges do you face protecting your child online?"
              value={formState.challenges}
              onChange={handleChange}
              rows={3}
              className={`bg-gray-50 dark:bg-[#2C2C4A] border-gray-300 dark:border-none text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-slate-500 focus:ring-2 focus:ring-cyan-500 resize-none ${errors.challenges ? "border-red-500 ring-2 ring-red-500" : ""}`}
            />
            {errors.challenges && <p className="text-xs text-red-400 mt-1">{errors.challenges}</p>}
          </div>

          {/* Consent */}
          <div className="pt-2">
            <Label htmlFor="consent" className="flex items-start gap-3 cursor-pointer">
              <Checkbox
                id="consent"
                checked={formState.consent}
                onCheckedChange={(checked) =>
                  setFormState((prev) => ({ ...prev, consent: !!checked }))
                }
                className="w-5 h-5 rounded-sm border-gray-400 dark:border-slate-500 data-[state=checked]:bg-cyan-500 data-[state=checked]:border-cyan-500 mt-1 flex-shrink-0"
              />
              <span className="text-gray-700 dark:text-slate-300 text-sm leading-relaxed">
                I consent to ZyberHero collecting this information for account setup and to receive occasional product updates. <span className="text-red-500">*</span>
              </span>
            </Label>
            {errors.consent && <p className="text-xs text-red-400 mt-2">You must consent to continue.</p>}
          </div>

          <p className="text-xs text-center text-gray-500 dark:text-slate-500">
            By clicking Register, you agree to our Terms of Service and Privacy Policy.
          </p>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full h-12 text-lg font-semibold bg-gradient-to-r from-indigo-600 to-cyan-500 text-white rounded-lg shadow-lg hover:from-indigo-700 hover:to-cyan-600 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Registering..." : "Register"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AccessibilityFeatures;
