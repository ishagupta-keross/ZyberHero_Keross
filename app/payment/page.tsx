'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { CreditCard, Lock, Check, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { ThemeToggle } from "@/components/ui/theme-toggle";

function PaymentContent() {
  const [step, setStep] = useState<'trial' | 'payment'>('trial');
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const planName = searchParams.get('plan') || 'Family Basic';
  const planPrice = searchParams.get('price') || '$9.99';
  const isPopular = searchParams.get('popular') === 'true';
  
  const getDeviceCount = (plan: string) => {
    if (plan.includes('Basic')) return 'Up to 2';
    if (plan.includes('Pro')) return 'Up to 5';
    return 'Unlimited';
  };
  
  const getFeatures = (plan: string) => {
    if (plan.includes('Basic')) {
      return [
        'Monitor up to 2 devices',
        'Real-time threat detection',
        'Basic AI analysis',
        'Parent dashboard',
        'Email alerts',
        '24/7 monitoring',
      ];
    }
    if (plan.includes('Pro')) {
      return [
        'Monitor up to 5 devices',
        'Advanced AI threat detection',
        'Behavioral pattern analysis',
        'Instant push notifications',
        'Detailed reporting',
        'Priority support',
        'Evidence collection',
        'Multi-platform coverage',
      ];
    }
    return [
      'Unlimited devices',
      'Investigator portal access',
      'Advanced case management',
      'Chain of custody documentation',
      'Custom integrations',
      'Dedicated support',
    ];
  };

  const handleStartTrial = (e: React.FormEvent) => {
    e.preventDefault();
    setStep('payment');
  };

  const handleGoogleSignUp = () => {
    toast.success('Signing up with Google...');
    setTimeout(() => {
      setStep('payment');
    }, 1000);
  };

  const handlePayment = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Payment processed successfully! Welcome to ZyberHero!');
    setTimeout(() => {
      router.push('/login');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-blue-100 dark:from-gray-950 dark:via-blue-950 dark:to-gray-900 flex items-center justify-center p-4">
     <div className="absolute top-4 left-4 right-4 flex justify-between items-center">
  {/* Left: Back Button */}
  <Button
    variant="ghost"
    className="hover:bg-cyan-50 hover:text-cyan-600 dark:hover:bg-cyan-950 dark:hover:text-cyan-400"
    asChild
  >
    <Link href="/pricing">
      <ArrowLeft className="w-4 h-4 mr-2" />
      Back to Pricing
    </Link>
  </Button>

  {/* Right: Theme Toggle */}
  <ThemeToggle />
</div>


      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-4xl"
      >
        <div className="text-center mb-8">
          <h1 className="text-4xl mb-4 lg:text-5xl font-bold text-gray-900 dark:text-white">
            {step === 'trial' ? 'Start Your Free Trial' : 'Complete Your Subscription'}
          </h1>
          <p className="text-muted-foreground">
            {step === 'trial' ? '14 days free trial, no credit card required' : 'Secure payment powered by Stripe'}
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            {step === 'trial' ? (
              <Card>
                <CardHeader>
                  <CardTitle>Create Your Account</CardTitle>
                  <CardDescription>Start protecting your family today</CardDescription>
                </CardHeader>
                <CardContent>
                  {/* <Button
                    onClick={handleGoogleSignUp}
                    variant="outline"
                    className="w-full mb-6 h-12 text-base font-medium hover:bg-slate-50 dark:hover:bg-slate-900"
                    type="button"
                  >
                    <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                      <path
                        fill="currentColor"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="currentColor"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="currentColor"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      />
                      <path
                        fill="currentColor"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      />
                    </svg>
                    Sign up with Google
                  </Button>

                  <div className="relative mb-6">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-background px-2 text-muted-foreground">
                        Or continue with email
                      </span>
                    </div>
                  </div> */}

                  <form onSubmit={handleStartTrial} className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="firstName">First Name</Label>
                        <Input id="firstName" required />
                      </div>
                      <div>
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input id="lastName" required />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" type="email" required />
                    </div>
                    <div>
                      <Label htmlFor="password">Password</Label>
                      <Input id="password" type="password" required />
                    </div>
                    <div>
                      <Label htmlFor="confirmPassword">Confirm Password</Label>
                      <Input id="confirmPassword" type="password" required />
                    </div>
                    <div className="flex items-center gap-2">
                      <input type="checkbox" id="terms" required className="w-4 h-4" />
                      <Label htmlFor="terms" className="text-sm">
                        I agree to the Terms of Service and Privacy Policy
                      </Label>
                    </div>
                    <Button type="submit" className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white" size="lg">
                      Create Account
                    </Button>
                    <p className="text-xs text-center text-muted-foreground">
                      Your trial will automatically expire after 14 days unless you subscribe
                    </p>
                  </form>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="w-5 h-5" />
                    Payment Information
                  </CardTitle>
                  <CardDescription>Your payment details are secure and encrypted</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handlePayment} className="space-y-4">
                    <div>
                      <Label htmlFor="cardNumber">Card Number</Label>
                      <Input id="cardNumber" placeholder="1234 5678 9012 3456" required />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="expiry">Expiry Date</Label>
                        <Input id="expiry" placeholder="MM/YY" required />
                      </div>
                      <div>
                        <Label htmlFor="cvv">CVV</Label>
                        <Input id="cvv" placeholder="123" maxLength={3} required />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="name">Cardholder Name</Label>
                      <Input id="name" required />
                    </div>
                    <div>
                      <Label htmlFor="billingAddress">Billing Address</Label>
                      <Input id="billingAddress" required />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="city">City</Label>
                        <Input id="city" required />
                      </div>
                      <div>
                        <Label htmlFor="zip">ZIP Code</Label>
                        <Input id="zip" required />
                      </div>
                    </div>
                    <div className="flex items-center gap-2 p-4 bg-muted rounded-lg">
                      <Lock className="w-5 h-5 text-green-500" />
                      <span className="text-sm">Secured by 256-bit SSL encryption</span>
                    </div>
                    <Button type="submit" className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white" size="lg">
                      Complete Subscription
                    </Button>
                  </form>
                </CardContent>
              </Card>
            )}
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Plan Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="font-semibold">{planName}</span>
                  {isPopular && <Badge className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white">Popular</Badge>}
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Devices</span>
                    <span className="font-semibold">{getDeviceCount(planName)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Billing</span>
                    <span className="font-semibold">Monthly</span>
                  </div>
                </div>
                <div className="border-t pt-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>{planPrice}</span>
                  </div>
                  {step === 'trial' && (
                    <div className="flex justify-between items-center text-green-600 mb-2">
                      <span>Trial Discount</span>
                      <span>-{planPrice}</span>
                    </div>
                  )}
                  <div className="flex justify-between items-center font-bold text-lg">
                    <span>Total Today</span>
                    <span>{step === 'trial' ? '$0.00' : planPrice}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-2xl border-0">
              <CardContent className="p-6">
                <h3 className="font-bold mb-4 text-white">What's Included:</h3>
                <ul className="space-y-2">
                  {getFeatures(planName).map((feature, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <Check className="w-4 h-4" />
                      <span className="text-sm text-white">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default function PaymentPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-blue-100 dark:from-gray-950 dark:via-blue-950 dark:to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500 mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
      </div>
    }>
      <PaymentContent />
    </Suspense>
  );
}
