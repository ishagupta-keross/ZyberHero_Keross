"use client";

import React, { useState, useCallback, FormEvent } from "react";
import { Mail, User, Phone, Users, Shield, Zap, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  phoneNumber: string;
  biggestChallenge: string;
  numberOfChildren: string;
  howToUse: string;
  consent: boolean;
}

const LOCAL_STORAGE_KEY = "zyberhero_prelaunch_list_data";

interface PreLaunchListFormProps {
  trigger?: React.ReactNode;
}

const PreLaunchListForm: React.FC<PreLaunchListFormProps> = ({ trigger }) => {
  const [formState, setFormState] = useState<FormState>({
    parentName: "",
    email: "",
    phoneNumber: "",
    biggestChallenge: "",
    numberOfChildren: "",
    howToUse: "",
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

  const handleSelectChange = useCallback((value: string) => {
    setFormState((prev) => ({
      ...prev,
      biggestChallenge: value,
    }));
  }, []);

  const validate = (): boolean => {
    const newErrors: Partial<FormState> = {};
    const { parentName, email, consent } = formState;

    if (!parentName.trim()) newErrors.parentName = "Parent Name is required.";
    if (!email || !/\S+@\S+\.\S+/.test(email))
      newErrors.email = "A valid email is required.";
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
      const { parentName, email, phoneNumber, biggestChallenge, numberOfChildren, howToUse } = formState;
      const newEntry = {
        parentName: parentName.trim(),
        email: email.toLowerCase(),
        phoneNumber: phoneNumber.trim(),
        biggestChallenge,
        numberOfChildren,
        howToUse: howToUse.trim(),
        dateAdded: new Date().toISOString(),
      };

      const existingData = localStorage.getItem(LOCAL_STORAGE_KEY);
      const registrations = existingData ? JSON.parse(existingData) : [];
      registrations.push(newEntry);
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(registrations));

      toast.success("Welcome to the ZyberHero Pre-Launch List!");

      setFormState({
        parentName: "",
        email: "",
        phoneNumber: "",
        biggestChallenge: "",
        numberOfChildren: "",
        howToUse: "",
        consent: false,
      });
      setErrors({});
      setIsDialogOpen(false);
    } catch (err) {
      console.error(err);
      toast.error("Failed to join the list. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const challengeOptions = [
    "Managing screen time and device addiction",
    "Filtering inappropriate content",
    "Cyberbullying and online predators",
    "Privacy concerns and data security",
    "Monitoring multiple devices",
  ];

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 text-lg">
            Join Pre-Launch List
          </Button>
        )}
      </DialogTrigger>

      <DialogContent className="sm:max-w-xl max-h-[90vh] overflow-y-auto bg-white dark:bg-slate-900 border-gray-300 dark:border-[#3C3C5A] text-gray-900 dark:text-white">
        <DialogHeader className="space-y-4">
          <div className="flex justify-center">
            <div className="w-16 h-16 flex items-center justify-center bg-indigo-800 rounded-full">
              <Zap className="w-8 h-8 text-cyan-400" />
            </div>
          </div>
          <DialogTitle className="text-center text-2xl font-bold tracking-wider text-gray-900 dark:text-white">
            Join the <span className="text-cyan-400">ZyberHero</span> Pre-Launch List
          </DialogTitle>
          <DialogDescription className="text-center text-gray-600 dark:text-slate-400">
            Help us refine our platform and be the first to receive notifications about early testing opportunities and launch details.
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
              className={`bg-gray-50 dark:bg-[#2C2C4A] border-gray-300 dark:border-none text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-slate-500 focus:ring-2 focus:ring-cyan-500 ${
                errors.parentName ? "border-red-500 ring-2 ring-red-500" : ""
              }`}
            />
            {errors.parentName && (
              <p className="text-xs text-red-400 mt-1">{errors.parentName}</p>
            )}
          </div>

          {/* Email Address */}
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
              className={`bg-gray-50 dark:bg-[#2C2C4A] border-gray-300 dark:border-none text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-slate-500 focus:ring-2 focus:ring-cyan-500 ${
                errors.email ? "border-red-500 ring-2 ring-red-500" : ""
              }`}
            />
            {errors.email && (
              <p className="text-xs text-red-400 mt-1">{errors.email}</p>
            )}
          </div>

          {/* Phone Number (optional) */}
          <div className="space-y-2">
            <Label htmlFor="phoneNumber" className="flex items-center text-gray-700 dark:text-slate-300">
              <Phone className="w-4 h-4 mr-2 text-indigo-600 dark:text-indigo-400" /> Phone Number
            </Label>
            <Input
              id="phoneNumber"
              type="tel"
              placeholder="e.g., +1 555-123-4567"
              value={formState.phoneNumber}
              onChange={handleChange}
              className="bg-gray-50 dark:bg-[#2C2C4A] border-gray-300 dark:border-none text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-slate-500 focus:ring-2 focus:ring-cyan-500"
            />
          </div>

          {/* Biggest Challenge (optional) */}
          <div className="space-y-2">
            <Label htmlFor="biggestChallenge" className="flex items-center text-gray-700 dark:text-slate-300">
              <Shield className="w-4 h-4 mr-2 text-indigo-600 dark:text-indigo-400" /> Biggest challenge in protecting your child online?
            </Label>
            <Select onValueChange={handleSelectChange} value={formState.biggestChallenge}>
              <SelectTrigger className="w-full bg-gray-50 dark:bg-[#2C2C4A] border-gray-300 dark:border-none text-gray-900 dark:text-white focus:ring-2 focus:ring-cyan-500">
                <SelectValue placeholder="Select your biggest challenge..." />
              </SelectTrigger>
              <SelectContent className="bg-white dark:bg-[#2C2C4A] border border-gray-300 dark:border-[#3C3C5A] text-gray-900 dark:text-white">
                {challengeOptions.map((option) => (
                  <SelectItem key={option} value={option} className="hover:bg-gray-100 dark:hover:bg-indigo-700/50">
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Number of Children (optional) */}
          <div className="space-y-2">
            <Label htmlFor="numberOfChildren" className="flex items-center text-gray-700 dark:text-slate-300">
              <Users className="w-4 h-4 mr-2 text-indigo-600 dark:text-indigo-400" /> Number of Children
            </Label>
            <Input
              id="numberOfChildren"
              type="number"
              min="0"
              placeholder="e.g., 1, 2, 3..."
              value={formState.numberOfChildren}
              onChange={handleChange}
              className="bg-gray-50 dark:bg-[#2C2C4A] border-gray-300 dark:border-none text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-slate-500 focus:ring-2 focus:ring-cyan-500"
            />
          </div>

          {/* How do you plan to use ZyberHero? (optional) */}
          <div className="space-y-2">
            <Label htmlFor="howToUse" className="flex items-center text-gray-700 dark:text-slate-300">
              <MessageSquare className="w-4 h-4 mr-2 text-indigo-600 dark:text-indigo-400" /> How do you plan to use ZyberHero?
            </Label>
            <textarea
              id="howToUse"
              value={formState.howToUse}
              onChange={handleChange}
              placeholder="e.g., To monitor safe online learning and manage screen time."
              rows={3}
              className="w-full px-4 py-3 rounded-lg bg-gray-50 dark:bg-[#2C2C4A] text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-slate-500 focus:ring-2 focus:ring-cyan-500 border border-gray-300 dark:border-transparent focus:border-transparent transition duration-200 resize-none"
            />
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
                I consent to participate in ZyberHero's pre-launch testing and receive communications.<span className="text-red-500">*</span>
              </span>
            </Label>
            {errors.consent && (
              <p className="text-xs text-red-400 mt-2">
                You must consent to join the pre-launch list.
              </p>
            )}
          </div>

          <p className="text-sm text-indigo-400 text-center pt-2">
            Your input is vital! Help us build the future of child digital safety.
          </p>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full h-12 text-lg font-semibold bg-gradient-to-r from-indigo-600 to-cyan-500 text-white rounded-lg shadow-lg hover:from-indigo-700 hover:to-cyan-600 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Joining List..." : "Join Pre-Launch List"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default PreLaunchListForm;
