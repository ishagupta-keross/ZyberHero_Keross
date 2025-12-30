"use client";

import React, { useState, useCallback, FormEvent } from "react";
import { Mail, User, Phone, Building2, Globe, MapPin, Users, Briefcase, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
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
  organizationName: string;
  typeOfOrganization: string;
  websiteDomain: string;
  countryRegion: string;
  numberOfBeneficiaries: string;
  fullName: string;
  designationRole: string;
  emailAddress: string;
  phoneNumber: string;
  consent: boolean;
}

const LOCAL_STORAGE_KEY = "zyberhero_enterprise_info_data";

interface EnterpriseInfoProps {
  trigger?: React.ReactNode;
}

const EnterpriseInfo: React.FC<EnterpriseInfoProps> = ({ trigger }) => {
  const [formState, setFormState] = useState<FormState>({
    organizationName: "",
    typeOfOrganization: "",
    websiteDomain: "",
    countryRegion: "",
    numberOfBeneficiaries: "",
    fullName: "",
    designationRole: "",
    emailAddress: "",
    phoneNumber: "",
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

  const handleSelectChange = useCallback((field: string, value: string) => {
    setFormState((prev) => ({
      ...prev,
      [field]: value,
    }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  }, []);

  const validate = (): boolean => {
    const newErrors: Partial<FormState> = {};
    const {
      organizationName,
      typeOfOrganization,
      websiteDomain,
      countryRegion,
      numberOfBeneficiaries,
      fullName,
      designationRole,
      emailAddress,
      phoneNumber,
      consent,
    } = formState;

    if (!organizationName.trim()) newErrors.organizationName = "Organization Name is required.";
    if (!typeOfOrganization) newErrors.typeOfOrganization = "Please select organization type.";
    if (!websiteDomain.trim()) newErrors.websiteDomain = "Website/Domain is required.";
    if (!countryRegion.trim()) newErrors.countryRegion = "Country/Region is required.";
    if (!numberOfBeneficiaries.trim()) newErrors.numberOfBeneficiaries = "Number of beneficiaries is required.";
    if (!fullName.trim()) newErrors.fullName = "Full Name is required.";
    if (!designationRole.trim()) newErrors.designationRole = "Designation/Role is required.";
    if (!emailAddress || !/\S+@\S+\.\S+/.test(emailAddress)) newErrors.emailAddress = "A valid email is required.";
    if (!phoneNumber) newErrors.phoneNumber = "Phone number is required.";
    if (phoneNumber.trim() && !/^[\d\s\-\+\(\)]{7,20}$/.test(phoneNumber.trim())) newErrors.phoneNumber = "Enter a valid phone number.";
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
        organizationName: formState.organizationName.trim(),
        typeOfOrganization: formState.typeOfOrganization,
        websiteDomain: formState.websiteDomain.trim(),
        countryRegion: formState.countryRegion.trim(),
        numberOfBeneficiaries: formState.numberOfBeneficiaries.trim(),
        fullName: formState.fullName.trim(),
        designationRole: formState.designationRole.trim(),
        emailAddress: formState.emailAddress.toLowerCase(),
        phoneNumber: formState.phoneNumber.trim(),
        dateAdded: new Date().toISOString(),
      };

      const existingData = localStorage.getItem(LOCAL_STORAGE_KEY);
      const registrations = existingData ? JSON.parse(existingData) : [];

      registrations.push(newEntry);
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(registrations));

      toast.success("Enterprise information submitted successfully! Our team will contact you soon.");

      setFormState({
        organizationName: "",
        typeOfOrganization: "",
        websiteDomain: "",
        countryRegion: "",
        numberOfBeneficiaries: "",
        fullName: "",
        designationRole: "",
        emailAddress: "",
        phoneNumber: "",
        consent: false,
      });
      setErrors({});
      setIsDialogOpen(false);
    } catch (err) {
      console.error(err);
      toast.error("Failed to submit information. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const organizationTypes = [
    "School",
    "University",
    "Non-Profit Organization",
    "Government Agency",
    "Law Enforcement",
    "Corporate/Enterprise",
    "Other",
  ];

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 text-lg">
            Get Enterprise Info
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
      <span className="text-cyan-600 dark:text-cyan-400">Enterprise</span> Info
    </DialogTitle>
    <DialogDescription className="text-center text-gray-600 dark:text-slate-400">
      Secure a custom solution for your school, non-profit, or government organization.
    </DialogDescription>
  </DialogHeader>

  <form onSubmit={handleSubmit} className="space-y-8 mt-4">
    {/* Organization Details Section */}
    <div className="space-y-8">
      <h3 className="text-lg font-semibold text-cyan-600 dark:text-cyan-400">Organization Details</h3>

      {/* Organization Name */}
      <div className="space-y-2">
        <Label htmlFor="organizationName" className="flex items-center text-gray-700 dark:text-slate-300">
          <Building2 className="w-4 h-4 mr-2 text-indigo-600 dark:text-indigo-400" /> Organization Name <span className="text-red-500">*</span>
        </Label>
        <Input
          id="organizationName"
          placeholder="e.g., Green Valley School District"
          value={formState.organizationName}
          onChange={handleChange}
          className={`bg-gray-50 dark:bg-[#2C2C4A] border-gray-300 dark:border-none text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-slate-500 focus:ring-2 focus:ring-cyan-500 ${errors.organizationName ? "border-red-500 ring-2 ring-red-500" : ""}`}
        />
        {errors.organizationName && <p className="text-xs text-red-400 mt-1">{errors.organizationName}</p>}
      </div>

      {/* Type of Organization */}
      <div className="space-y-2">
        <Label htmlFor="typeOfOrganization" className="flex items-center text-gray-700 dark:text-slate-300">
          <Briefcase className="w-4 h-4 mr-2 text-indigo-600 dark:text-indigo-400" /> Type of Organization <span className="text-red-500">*</span>
        </Label>
        <Select onValueChange={(value) => handleSelectChange("typeOfOrganization", value)} value={formState.typeOfOrganization}>
          <SelectTrigger className={`w-full bg-gray-50 dark:bg-[#2C2C4A] border-gray-300 dark:border-none text-gray-900 dark:text-white ${!formState.typeOfOrganization ? 'text-gray-400 dark:text-slate-500' : ''} focus:ring-2 focus:ring-cyan-500 ${errors.typeOfOrganization ? "border-red-500 ring-2 ring-red-500" : ""}`}>
            <SelectValue placeholder="Select type of organization" />
          </SelectTrigger>
          <SelectContent className="bg-white dark:bg-[#2C2C4A] border border-gray-200 dark:border-[#3C3C5A] text-gray-900 dark:text-white">
            {organizationTypes.map((type) => (
              <SelectItem key={type} value={type} className="hover:bg-gray-100 dark:hover:bg-indigo-700/50">
                {type}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.typeOfOrganization && <p className="text-xs text-red-400 mt-1">{errors.typeOfOrganization}</p>}
      </div>

      {/* Website / Domain */}
      <div className="space-y-2">
        <Label htmlFor="websiteDomain" className="flex items-center text-gray-700 dark:text-slate-300">
          <Globe className="w-4 h-4 mr-2 text-indigo-600 dark:text-indigo-400" /> Website / Domain <span className="text-red-500">*</span>
        </Label>
        <Input
          id="websiteDomain"
          placeholder="e.g., example.org"
          value={formState.websiteDomain}
          onChange={handleChange}
          className={`bg-gray-50 dark:bg-[#2C2C4A] border-gray-300 dark:border-none text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-slate-500 focus:ring-2 focus:ring-cyan-500 ${errors.websiteDomain ? "border-red-500 ring-2 ring-red-500" : ""}`}
        />
        {errors.websiteDomain && <p className="text-xs text-red-400 mt-1">{errors.websiteDomain}</p>}
      </div>

      {/* Country / Region */}
      <div className="space-y-2">
        <Label htmlFor="countryRegion" className="flex items-center text-gray-700 dark:text-slate-300">
          <MapPin className="w-4 h-4 mr-2 text-indigo-600 dark:text-indigo-400" /> Country / Region <span className="text-red-500">*</span>
        </Label>
        <Input
          id="countryRegion"
          placeholder="e.g., United States"
          value={formState.countryRegion}
          onChange={handleChange}
          className={`bg-gray-50 dark:bg-[#2C2C4A] border-gray-300 dark:border-none text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-slate-500 focus:ring-2 focus:ring-cyan-500 ${errors.countryRegion ? "border-red-500 ring-2 ring-red-500" : ""}`}
        />
        {errors.countryRegion && <p className="text-xs text-red-400 mt-1">{errors.countryRegion}</p>}
      </div>

      {/* Number of Students / Beneficiaries */}
      <div className="space-y-2">
        <Label htmlFor="numberOfBeneficiaries" className="flex items-center text-gray-700 dark:text-slate-300">
          <Users className="w-4 h-4 mr-2 text-indigo-600 dark:text-indigo-400" /> Number of Students / Beneficiaries <span className="text-red-500">*</span>
        </Label>
        <Input
          id="numberOfBeneficiaries"
          placeholder="e.g., 5000"
          value={formState.numberOfBeneficiaries}
          onChange={handleChange}
          className={`bg-gray-50 dark:bg-[#2C2C4A] border-gray-300 dark:border-none text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-slate-500 focus:ring-2 focus:ring-cyan-500 ${errors.numberOfBeneficiaries ? "border-red-500 ring-2 ring-red-500" : ""}`}
        />
        {errors.numberOfBeneficiaries && <p className="text-xs text-red-400 mt-1">{errors.numberOfBeneficiaries}</p>}
      </div>
    </div>

    {/* Contact Person Section */}
    <div className="space-y-8">
      <h3 className="text-lg font-semibold text-cyan-600 dark:text-cyan-400">Contact Person</h3>

      {/* Full Name */}
      <div className="space-y-2">
        <Label htmlFor="fullName" className="flex items-center text-gray-700 dark:text-slate-300">
          <User className="w-4 h-4 mr-2 text-indigo-600 dark:text-indigo-400" /> Full Name <span className="text-red-500">*</span>
        </Label>
        <Input
          id="fullName"
          placeholder="Your Name"
          value={formState.fullName}
          onChange={handleChange}
          className={`bg-gray-50 dark:bg-[#2C2C4A] border-gray-300 dark:border-none text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-slate-500 focus:ring-2 focus:ring-cyan-500 ${errors.fullName ? "border-red-500 ring-2 ring-red-500" : ""}`}
        />
        {errors.fullName && <p className="text-xs text-red-400 mt-1">{errors.fullName}</p>}
      </div>

      {/* Designation / Role */}
      <div className="space-y-2">
        <Label htmlFor="designationRole" className="flex items-center text-gray-700 dark:text-slate-300">
          <Briefcase className="w-4 h-4 mr-2 text-indigo-600 dark:text-indigo-400" /> Designation / Role <span className="text-red-500">*</span>
        </Label>
        <Input
          id="designationRole"
          placeholder="e.g., IT Director"
          value={formState.designationRole}
          onChange={handleChange}
          className={`bg-gray-50 dark:bg-[#2C2C4A] border-gray-300 dark:border-none text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-slate-500 focus:ring-2 focus:ring-cyan-500 ${errors.designationRole ? "border-red-500 ring-2 ring-red-500" : ""}`}
        />
        {errors.designationRole && <p className="text-xs text-red-400 mt-1">{errors.designationRole}</p>}
      </div>

      {/* Email Address */}
      <div className="space-y-2">
        <Label htmlFor="emailAddress" className="flex items-center text-gray-700 dark:text-slate-300">
          <Mail className="w-4 h-4 mr-2 text-indigo-600 dark:text-indigo-400" /> Email Address <span className="text-red-500">*</span>
        </Label>
        <Input
          id="emailAddress"
          type="email"
          placeholder="email@institution.com"
          value={formState.emailAddress}
          onChange={handleChange}
          className={`bg-gray-50 dark:bg-[#2C2C4A] border-gray-300 dark:border-none text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-slate-500 focus:ring-2 focus:ring-cyan-500 ${errors.emailAddress ? "border-red-500 ring-2 ring-red-500" : ""}`}
        />
        {errors.emailAddress && <p className="text-xs text-red-400 mt-1">{errors.emailAddress}</p>}
      </div>

      {/* Phone Number */}
      <div className="space-y-2">
        <Label htmlFor="phoneNumber" className="flex items-center text-gray-700 dark:text-slate-300">
          <Phone className="w-4 h-4 mr-2 text-indigo-600 dark:text-indigo-400" /> Phone Number <span className="text-red-500">*</span>
        </Label>
        <Input
          id="phoneNumber"
          type="tel"
          placeholder="e.g., +1 555 123-4567"
          value={formState.phoneNumber}
          onChange={handleChange}
          className={`bg-gray-50 dark:bg-[#2C2C4A] border-gray-300 dark:border-none text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-slate-500 focus:ring-2 focus:ring-cyan-500 ${errors.phoneNumber ? "border-red-500 ring-2 ring-red-500" : ""}`}
        />
        {errors.phoneNumber && <p className="text-xs text-red-400 mt-1">{errors.phoneNumber}</p>}
      </div>
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
          I agree to ZyberHero's privacy and data terms. <span className="text-red-500">*</span>
        </span>
      </Label>
      {errors.consent && <p className="text-xs text-red-400 mt-2">You must agree to the terms.</p>}
    </div>

    <p className="text-sm text-indigo-600 dark:text-indigo-400 text-center pt-2">
      Our team will contact you shortly to discuss your custom solution.
    </p>

    {/* Submit Button */}
    <Button
      type="submit"
      disabled={isSubmitting}
      className="w-full h-12 text-lg font-semibold bg-gradient-to-r from-indigo-600 to-cyan-500 text-white rounded-lg shadow-lg hover:from-indigo-700 hover:to-cyan-600 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {isSubmitting ? "Submitting..." : "Submit"}
    </Button>
  </form>
</DialogContent>


    </Dialog>
  );
};

export default EnterpriseInfo;
