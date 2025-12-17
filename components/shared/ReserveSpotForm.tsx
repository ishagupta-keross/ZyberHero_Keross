"use client";

import React, { useState, useCallback, FormEvent, useEffect } from "react";
import { Mail, User, Lock, MessageSquare, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
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
  parentName: string;
  email: string;
  password: string;
  confirmPassword: string;
  interestReason: string;
  consent: boolean;
}

const LOCAL_STORAGE_KEY = "zyberhero_registration_data";

const ReserveSpotForm: React.FC<{ trigger?: React.ReactNode }> = ({ trigger }) => {
  const [formState, setFormState] = useState<FormState>({
    parentName: "",
    email: "",
    password: "",
    confirmPassword: "",
    interestReason: "",
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
    const { parentName, email, password, confirmPassword, interestReason, consent } = formState;

    if (!parentName.trim()) newErrors.parentName = "Parent Name is required.";
    if (!email || !/\S+@\S+\.\S+/.test(email)) newErrors.email = "A valid email is required.";
    if (!password || password.length < 8) newErrors.password = "Password must be at least 8 characters.";
    if (password !== confirmPassword) newErrors.confirmPassword = "Passwords do not match.";
    if (!interestReason.trim()) newErrors.interestReason = "Please tell us why you are interested.";
    if (!consent) newErrors.consent = true as any;

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      toast.error("Please correct the highlighted fields.");
      return;
    }

    setIsSubmitting(true);

    try {
      const { parentName, email, interestReason } = formState;
      const newEntry = {
        parentName: parentName.trim(),
        email: email.toLowerCase(),
        interestReason: interestReason.trim(),
        dateAdded: new Date().toISOString(),
      };

      const existingData = localStorage.getItem(LOCAL_STORAGE_KEY);
      const registrations = existingData ? JSON.parse(existingData) : [];

      registrations.push(newEntry);
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(registrations));

      toast.success("Your spot is reserved! We'll notify you when pre-launch begins.");

      setFormState({
        parentName: "",
        email: "",
        password: "",
        confirmPassword: "",
        interestReason: "",
        consent: false,
      });
      setErrors({});
      setIsDialogOpen(false);
    } catch (err) {
      console.error(err);
      toast.error("Failed to save your registration. Try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 text-lg">
            Reserve Your Spot
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-xl max-h-[90vh] overflow-y-auto bg-white dark:bg-[#1A1A32] border-gray-300 dark:border-[#3C3C5A] text-gray-900 dark:text-white">
        <DialogHeader className="space-y-4">
          <div className="flex justify-center">
            <div className="w-16 h-16 flex items-center justify-center bg-indigo-800 rounded-full">
              <Zap className="w-8 h-8 text-cyan-400" />
            </div>
          </div>
          <DialogTitle className="text-center text-2xl font-bold tracking-wider text-gray-900 dark:text-white">
            Secure Your Child's Digital Future With <span className="text-cyan-400">ZyberHero</span>
          </DialogTitle>
          <DialogDescription className="text-center text-gray-600 dark:text-slate-400">
            Register below for exclusive early access and ensure your family is protected from day one with ZyberHero.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          {/* Parent Name */}
          <div className="space-y-2">
            <Label htmlFor="parentName" className="flex items-center text-gray-700 dark:text-slate-300">
              <User className="w-4 h-4 mr-2 text-indigo-600 dark:text-indigo-400" /> Parent Name <span className="text-red-500">*</span>
            </Label>
            <Input
              id="parentName"
              placeholder="e.g., Alex Johnson"
              value={formState.parentName}
              onChange={handleChange}
              className={`bg-gray-50 dark:bg-[#2C2C4A] border-gray-300 dark:border-none text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-slate-500 focus:ring-2 focus:ring-cyan-500 ${errors.parentName ? "border-red-500 ring-2 ring-red-500" : ""}`}
            />
            {errors.parentName && <p className="text-xs text-red-400 mt-1">{errors.parentName}</p>}
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email" className="flex items-center text-gray-700 dark:text-slate-300">
              <Mail className="w-4 h-4 mr-2 text-indigo-600 dark:text-indigo-400" /> Email Address <span className="text-red-500">*</span>
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={formState.email}
              onChange={handleChange}
              className={`bg-gray-50 dark:bg-[#2C2C4A] border-gray-300 dark:border-none text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-slate-500 focus:ring-2 focus:ring-cyan-500 ${errors.email ? "border-red-500 ring-2 ring-red-500" : ""}`}
            />
            {errors.email && <p className="text-xs text-red-400 mt-1">{errors.email}</p>}
          </div>

          {/* Password */}
          <div className="space-y-2">
            <Label htmlFor="password" className="flex items-center text-gray-700 dark:text-slate-300">
              <Lock className="w-4 h-4 mr-2 text-indigo-600 dark:text-indigo-400" /> Create Password <span className="text-red-500">*</span>
            </Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={formState.password}
              onChange={handleChange}
              className={`bg-gray-50 dark:bg-[#2C2C4A] border-gray-300 dark:border-none text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-slate-500 focus:ring-2 focus:ring-cyan-500 ${errors.password ? "border-red-500 ring-2 ring-red-500" : ""}`}
            />
            <p className="text-xs text-gray-600 dark:text-slate-400">Must be at least 8 characters long.</p>
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
              placeholder="••••••••"
              value={formState.confirmPassword}
              onChange={handleChange}
              className={`bg-gray-50 dark:bg-[#2C2C4A] border-gray-300 dark:border-none text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-slate-500 focus:ring-2 focus:ring-cyan-500 ${errors.confirmPassword ? "border-red-500 ring-2 ring-red-500" : ""}`}
            />
            {errors.confirmPassword && <p className="text-xs text-red-400 mt-1">{errors.confirmPassword}</p>}
          </div>

          {/* Interest Reason */}
          <div className="space-y-2">
            <Label htmlFor="interestReason" className="flex items-center text-gray-700 dark:text-slate-300">
              <MessageSquare className="w-4 h-4 mr-2 text-indigo-600 dark:text-indigo-400" /> Why are you interested? <span className="text-red-500">*</span>
            </Label>
            <textarea
              id="interestReason"
              value={formState.interestReason}
              onChange={handleChange}
              placeholder="Tell us why you want to join ZyberHero..."
              rows={3}
              className={`w-full px-4 py-3 rounded-lg bg-gray-50 dark:bg-[#2C2C4A] text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-slate-500 focus:ring-2 focus:ring-cyan-500 border border-gray-300 dark:border-transparent focus:border-transparent transition duration-200 resize-none ${
                errors.interestReason ? "border-red-500 ring-2 ring-red-500" : ""
              }`}
            />
            {errors.interestReason && <p className="text-xs text-red-400 mt-1">{errors.interestReason}</p>}
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
                I agree to receive updates about ZyberHero's launch and early access.<span className="text-red-500">*</span>
              </span>
            </Label>
            {errors.consent && <p className="text-xs text-red-400 mt-2">You must agree to receive updates.</p>}
          </div>

          <p className="text-sm text-indigo-400 text-center pt-2">
            Don't miss out! Exclusive early bird access is limited.
          </p>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full h-12 text-lg font-semibold bg-gradient-to-r from-indigo-600 to-cyan-500 text-white rounded-lg shadow-lg hover:from-indigo-700 hover:to-cyan-600 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Reserving My Spot..." : "Reserve My Spot"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ReserveSpotForm;
