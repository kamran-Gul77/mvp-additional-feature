import { SignUp } from '@clerk/nextjs';
import Link from 'next/link';
import { Truck, Check } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

export default function SignUpPage() {
  return (
    <div className="space-y-6">
      {/* Logo */}
      <div className="text-center">
        <Link href="/" className="inline-flex items-center space-x-2">
          <Truck className="h-8 w-8 text-orange-500" />
          <span className="text-2xl font-bold gradient-text">
            Compliance Buddy
          </span>
        </Link>
        <p className="text-muted-foreground mt-2">
          Join thousands of food truck owners staying compliant
        </p>
      </div>

      {/* Benefits Card */}
      <Card className="bg-gradient-to-r from-orange-600/10 to-orange-500/5 border-orange-600/20">
        <CardContent className="p-4">
          <h3 className="font-semibold mb-3 text-center">What you get for free:</h3>
          <div className="space-y-2">
            <div className="flex items-center space-x-2 text-sm">
              <Check className="h-4 w-4 text-green-500" />
              <span>1 compliance checklist</span>
            </div>
            <div className="flex items-center space-x-2 text-sm">
              <Check className="h-4 w-4 text-green-500" />
              <span>City-specific requirements</span>
            </div>
            <div className="flex items-center space-x-2 text-sm">
              <Check className="h-4 w-4 text-green-500" />
              <span>Progress tracking</span>
            </div>
            <div className="flex items-center space-x-2 text-sm">
              <Check className="h-4 w-4 text-green-500" />
              <span>Mobile access</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Clerk Sign Up Component */}
      <div className="flex justify-center">
        <SignUp 
          appearance={{
            elements: {
              rootBox: "mx-auto",
              card: "bg-card border border-border shadow-2xl",
              headerTitle: "text-foreground",
              headerSubtitle: "text-muted-foreground",
              socialButtonsBlockButton: "bg-accent border-border text-foreground hover:bg-accent/80",
              socialButtonsBlockButtonText: "text-foreground",
              dividerLine: "bg-border",
              dividerText: "text-muted-foreground",
              formFieldLabel: "text-foreground",
              formFieldInput: "bg-background border-border text-foreground",
              footerActionLink: "text-orange-500 hover:text-orange-400",
              identityPreviewText: "text-foreground",
              identityPreviewEditButton: "text-orange-500 hover:text-orange-400",
              formButtonPrimary: "bg-orange-600 hover:bg-orange-700 text-white",
              formFieldInputShowPasswordButton: "text-muted-foreground hover:text-foreground",
              alertText: "text-foreground",
              formFieldErrorText: "text-red-500",
              footerActionText: "text-muted-foreground"
            },
            variables: {
              colorPrimary: "#F97316",
              colorBackground: "hsl(var(--card))",
              colorInputBackground: "hsl(var(--background))",
              colorInputText: "hsl(var(--foreground))",
              colorText: "hsl(var(--foreground))",
              colorTextSecondary: "hsl(var(--muted-foreground))",
              colorNeutral: "hsl(var(--muted))",
              colorShimmer: "hsl(var(--accent))",
              borderRadius: "0.5rem"
            }
          }}
          redirectUrl="/dashboard"
          signInUrl="/sign-in"
        />
      </div>

      {/* Footer */}
      <div className="text-center text-sm text-muted-foreground">
        <p>
          Already have an account?{' '}
          <Link href="/sign-in" className="text-orange-500 hover:text-orange-400 font-medium">
            Sign in here
          </Link>
        </p>
      </div>
    </div>
  );
}