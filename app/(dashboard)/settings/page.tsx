"use client";

import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  User, 
  CreditCard, 
  Crown, 
  Check,
  AlertTriangle,
  Mail,
  Settings
} from 'lucide-react';
import { toast } from 'sonner';
import { useSearchParams } from 'next/navigation';

export default function SettingsPage() {
  const { user } = useUser();
  const searchParams = useSearchParams();
  const defaultTab = searchParams?.get('tab') || 'profile';
  
  const [activeTab, setActiveTab] = useState(defaultTab);
  const [userPlan, setUserPlan] = useState<'free' | 'paid'>('free');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const response = await fetch('/api/user');
      if (response.ok) {
        const data = await response.json();
        setUserPlan(data.subscription || 'free');
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const handleUpgrade = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/payments/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });

      if (response.ok) {
        const { url } = await response.json();
        window.location.href = url;
      } else {
        toast.error('Failed to start checkout process');
      }
    } catch (error) {
      console.error('Error creating checkout session:', error);
      toast.error('Failed to start checkout process');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelSubscription = async () => {
    if (!window.confirm('Are you sure you want to cancel your subscription? You will lose access to Pro features at the end of your billing period.')) {
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/payments/cancel-subscription', {
        method: 'POST',
      });

      if (response.ok) {
        toast.success('Subscription cancelled successfully');
        fetchUserData();
      } else {
        toast.error('Failed to cancel subscription');
      }
    } catch (error) {
      console.error('Error cancelling subscription:', error);
      toast.error('Failed to cancel subscription');
    } finally {
      setLoading(false);
    }
  };

  const planFeatures = {
    free: [
      'Create 1 checklist',
      'Basic compliance tracking',
      'Mobile access'
    ],
    paid: [
      'Unlimited checklists',
      'Automatic renewal reminders',
      'Email notifications',
      'Priority support',
      'Advanced analytics'
    ]
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Settings</h1>
        <p className="text-muted-foreground">
          Manage your account settings and subscription
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="profile" className="flex items-center space-x-2">
            <User className="h-4 w-4" />
            <span>Profile</span>
          </TabsTrigger>
          <TabsTrigger value="billing" className="flex items-center space-x-2">
            <CreditCard className="h-4 w-4" />
            <span>Billing</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <User className="h-5 w-5" />
                <span>Profile Information</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center space-x-4">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={user?.imageUrl} />
                  <AvatarFallback>
                    {user?.firstName?.[0]}{user?.lastName?.[0]}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-lg font-semibold">
                    {user?.firstName} {user?.lastName}
                  </h3>
                  <p className="text-muted-foreground">{user?.emailAddresses?.[0]?.emailAddress}</p>
                  <Badge className={userPlan === 'paid' ? 'bg-orange-600' : 'bg-muted'}>
                    {userPlan === 'paid' ? 'Pro Plan' : 'Free Plan'}
                  </Badge>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    value={user?.firstName || ''}
                    disabled
                    className="bg-muted"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    value={user?.lastName || ''}
                    disabled
                    className="bg-muted"
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={user?.emailAddresses?.[0]?.emailAddress || ''}
                    disabled
                    className="bg-muted"
                  />
                </div>
              </div>

              <div className="flex items-start space-x-3 p-4 bg-blue-600/10 border border-blue-600/20 rounded-lg">
                <AlertTriangle className="h-5 w-5 text-blue-500 mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Profile managed by Clerk</p>
                  <p className="text-sm text-muted-foreground">
                    To update your profile information, please use the Clerk account management system.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="billing" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <CreditCard className="h-5 w-5" />
                <span>Subscription Plan</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                {/* Current Plan */}
                <div className={`p-6 rounded-lg border-2 ${
                  userPlan === 'free' 
                    ? 'border-border bg-card' 
                    : 'border-orange-600 bg-orange-600/10'
                }`}>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">
                      {userPlan === 'free' ? 'Free Plan' : 'Pro Plan'}
                    </h3>
                    {userPlan === 'paid' && (
                      <Badge className="bg-orange-600">
                        <Crown className="mr-1 h-3 w-3" />
                        Current
                      </Badge>
                    )}
                  </div>
                  
                  <div className="text-3xl font-bold mb-4">
                    {userPlan === 'free' ? '$0' : '$19'}
                    <span className="text-sm text-muted-foreground font-normal">
                      /month
                    </span>
                  </div>

                  <ul className="space-y-2">
                    {planFeatures[userPlan].map((feature, index) => (
                      <li key={index} className="flex items-center space-x-2 text-sm">
                        <Check className="h-4 w-4 text-green-500" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-6">
                    {userPlan === 'free' ? (
                      <Button 
                        onClick={handleUpgrade}
                        disabled={loading}
                        className="w-full bg-orange-600 hover:bg-orange-700"
                      >
                        {loading ? 'Processing...' : 'Upgrade to Pro'}
                      </Button>
                    ) : (
                      <Button
                        variant="outline"
                        onClick={handleCancelSubscription}
                        disabled={loading}
                        className="w-full border-red-600/50 text-red-500 hover:bg-red-600/10"
                      >
                        {loading ? 'Processing...' : 'Cancel Subscription'}
                      </Button>
                    )}
                  </div>
                </div>

                {/* Other Plan */}
                <div className={`p-6 rounded-lg border-2 ${
                  userPlan === 'paid' 
                    ? 'border-border bg-card' 
                    : 'border-orange-600/50 bg-orange-600/5'
                }`}>
                  <h3 className="text-lg font-semibold mb-4">
                    {userPlan === 'paid' ? 'Free Plan' : 'Pro Plan'}
                  </h3>
                  
                  <div className="text-3xl font-bold mb-4">
                    {userPlan === 'paid' ? '$0' : '$19'}
                    <span className="text-sm text-muted-foreground font-normal">
                      /month
                    </span>
                  </div>

                  <ul className="space-y-2">
                    {planFeatures[userPlan === 'paid' ? 'free' : 'paid'].map((feature, index) => (
                      <li key={index} className="flex items-center space-x-2 text-sm">
                        <Check className="h-4 w-4 text-green-500" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {userPlan === 'free' && (
                    <div className="mt-6">
                      <Button 
                        onClick={handleUpgrade}
                        disabled={loading}
                        className="w-full bg-orange-600 hover:bg-orange-700"
                      >
                        {loading ? 'Processing...' : 'Upgrade Now'}
                      </Button>
                    </div>
                  )}
                </div>
              </div>

              {/* Plan Comparison */}
              <div className="mt-8 p-6 bg-gradient-to-r from-orange-600/10 to-orange-500/5 rounded-lg border border-orange-600/20">
                <h3 className="text-lg font-semibold mb-4">Why upgrade to Pro?</h3>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                  <li className="flex items-center space-x-2">
                    <Check className="h-4 w-4 text-orange-500" />
                    <span>Never miss renewal deadlines</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <Check className="h-4 w-4 text-orange-500" />
                    <span>Create unlimited checklists</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <Check className="h-4 w-4 text-orange-500" />
                    <span>Get email reminders automatically</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <Check className="h-4 w-4 text-orange-500" />
                    <span>Priority customer support</span>
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}